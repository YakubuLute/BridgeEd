import type { RequestHandler } from "express";
import { Role } from "@bridgeed/shared";

import { AppError } from "../utils/app-error";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    throw new AppError(401, "UNAUTHORIZED", "Missing authorization header.");
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new AppError(401, "UNAUTHORIZED", "Authorization header must use Bearer token format.");
  }

  const claims = verifyAccessToken(token);
  req.auth = {
    userId: claims.sub,
    role: claims.role,
    name: claims.name,
    scope: claims.scope
  };

  next();
};

export const requireRoles =
  (...allowedRoles: Role[]): RequestHandler =>
  (req, _res, next) => {
    const auth = req.auth;
    if (!auth) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication is required.");
    }

    if (!allowedRoles.includes(auth.role)) {
      throw new AppError(403, "FORBIDDEN", "You do not have permission to perform this action.");
    }

    next();
  };
