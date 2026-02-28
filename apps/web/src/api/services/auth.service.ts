import { apiClient, isApiClientError } from "../api";

const OTP_REQUEST_TIMEOUT_MS = 10_000;

export type RequestOtpInput = {
  phoneNumber: string;
};

export type RequestOtpResult = {
  requestId: string;
  expiresInSeconds?: number;
};

export type VerifyOtpInput = {
  phoneNumber: string;
  requestId: string;
  otp: string;
};

export type VerifyOtpResult = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user?: {
    id?: string;
    role?: string;
    name?: string;
  };
};

type ApiEnvelope = {
  data?: unknown;
};

const readDataRecord = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    throw new Error("Invalid API response shape.");
  }

  const rawData = (payload as ApiEnvelope).data;
  if (!rawData || typeof rawData !== "object") {
    throw new Error("Invalid API response payload.");
  }

  return rawData as Record<string, unknown>;
};

const readString = (source: Record<string, unknown>, key: string): string | null =>
  typeof source[key] === "string" && (source[key] as string).length > 0
    ? (source[key] as string)
    : null;

const readOptionalString = (source: Record<string, unknown>, key: string): string | undefined =>
  typeof source[key] === "string" ? (source[key] as string) : undefined;

const throwNormalizedAuthError = (error: unknown): never => {
  if (isApiClientError(error) && error.code === "ECONNABORTED") {
    throw new Error("OTP send timed out after 10 seconds. Please try again.");
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error("Request failed. Please try again.");
};

export const requestOtp = async ({ phoneNumber }: RequestOtpInput): Promise<RequestOtpResult> => {
  try {
    const response = await apiClient.post<ApiEnvelope>(
      "/auth/otp/request",
      { phoneNumber },
      {
        timeout: OTP_REQUEST_TIMEOUT_MS
      }
    );

    const data = readDataRecord(response.data);
    const requestId = readString(data, "requestId");
    const expiresInSeconds =
      typeof data.expiresInSeconds === "number" ? data.expiresInSeconds : undefined;

    if (!requestId) {
      throw new Error("OTP request did not return a request id.");
    }

    return {
      requestId,
      expiresInSeconds
    };
  } catch (error: unknown) {
    return throwNormalizedAuthError(error);
  }
};

export const verifyOtp = async ({
  phoneNumber,
  requestId,
  otp
}: VerifyOtpInput): Promise<VerifyOtpResult> => {
  try {
    const response = await apiClient.post<ApiEnvelope>(
      "/auth/otp/verify",
      { phoneNumber, requestId, otp },
      {
        timeout: OTP_REQUEST_TIMEOUT_MS
      }
    );

    const data = readDataRecord(response.data);
    const accessToken = readString(data, "accessToken") ?? readString(data, "token");

    if (!accessToken) {
      throw new Error("Login succeeded but no secure session token was returned.");
    }

    const userPayload = data.user;
    const userRecord =
      userPayload && typeof userPayload === "object"
        ? (userPayload as Record<string, unknown>)
        : undefined;

    return {
      accessToken,
      refreshToken: readOptionalString(data, "refreshToken"),
      expiresAt: readOptionalString(data, "expiresAt"),
      user: userRecord
        ? {
            id: readOptionalString(userRecord, "id"),
            role: readOptionalString(userRecord, "role"),
            name: readOptionalString(userRecord, "name")
          }
        : undefined
    };
  } catch (error: unknown) {
    return throwNormalizedAuthError(error);
  }
};
