import crypto from "node:crypto";
import { JwtAuthClaimsSchema, type JwtAuthClaims, type AuthScope, type Role } from "@bridgeed/shared";

import { env } from "../config/env";
import { AppError } from "./app-error";

const encodeBase64Url = (value: string): string => Buffer.from(value).toString("base64url");
const decodeBase64Url = (value: string): string => Buffer.from(value, "base64url").toString("utf8");

const sign = (value: string): string =>
  crypto.createHmac("sha256", env.JWT_ACCESS_SECRET).update(value).digest("base64url");

export const createAccessToken = ({
  userId,
  name,
  role,
  scope,
  ttlMinutes
}: {
  userId: string;
  name: string;
  role: Role;
  scope?: AuthScope;
  ttlMinutes: number;
}): string => {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload: JwtAuthClaims = {
    sub: userId,
    role,
    name,
    scope,
    iat: nowSeconds,
    exp: nowSeconds + ttlMinutes * 60
  };

  const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = sign(`${header}.${encodedPayload}`);

  return `${header}.${encodedPayload}.${signature}`;
};

export const verifyAccessToken = (token: string): JwtAuthClaims => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AppError(401, "INVALID_TOKEN", "Invalid access token.");
  }

  const [header, payload, signature] = parts;
  if (!header || !payload || !signature) {
    throw new AppError(401, "INVALID_TOKEN", "Invalid access token.");
  }

  const expectedSignature = sign(`${header}.${payload}`);
  if (signature.length !== expectedSignature.length) {
    throw new AppError(401, "INVALID_TOKEN", "Invalid access token signature.");
  }

  const isValidSignature = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!isValidSignature) {
    throw new AppError(401, "INVALID_TOKEN", "Invalid access token signature.");
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(decodeBase64Url(payload));
  } catch {
    throw new AppError(401, "INVALID_TOKEN", "Access token payload is malformed.");
  }

  const validatedClaims = JwtAuthClaimsSchema.safeParse(parsedPayload);
  if (!validatedClaims.success) {
    throw new AppError(401, "INVALID_TOKEN", "Access token payload is invalid.");
  }

  if (validatedClaims.data.exp <= Math.floor(Date.now() / 1000)) {
    throw new AppError(401, "TOKEN_EXPIRED", "Access token has expired.");
  }

  return validatedClaims.data;
};
