import {
  EmailLoginErrorDetailsSchema,
  type EmailLoginRequest,
  EmailLoginRequestSchema,
  ForgotPasswordRequestSchema,
  ForgotPasswordResponseSchema,
  LoginSessionResponseSchema,
  RegisterEmailRequestSchema,
  RequestOtpRequestSchema,
  RequestOtpResponseSchema,
  VerifyOtpRequestSchema,
  type EmailLoginErrorDetails,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type LoginSessionResponse,
  type RegisterEmailRequest,
  type RequestOtpRequest,
  type RequestOtpResponse,
  type VerifyOtpRequest
} from "@bridgeed/shared";

import { ApiClientError, apiClient, isApiClientError } from "../api";

const OTP_REQUEST_TIMEOUT_MS = 10_000;

export type RequestOtpInput = RequestOtpRequest;
export type RequestOtpResult = RequestOtpResponse;
export type VerifyOtpInput = VerifyOtpRequest;
export type VerifyOtpResult = LoginSessionResponse;
export type RegisterEmailInput = RegisterEmailRequest;
export type RegisterEmailResult = LoginSessionResponse;
export type EmailLoginInput = EmailLoginRequest;
export type EmailLoginResult = LoginSessionResponse;
export type ForgotPasswordInput = ForgotPasswordRequest;
export type ForgotPasswordResult = ForgotPasswordResponse;

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

const throwNormalizedAuthError = (error: unknown): never => {
  if (isApiClientError(error) && error.code === "ECONNABORTED") {
    throw new Error("Request timed out after 10 seconds. Please try again.");
  }

  if (isApiClientError(error) && ["INVALID_CREDENTIALS", "ACCOUNT_LOCKED"].includes(error.code ?? "")) {
    const detailsParse = EmailLoginErrorDetailsSchema.safeParse(error.details);
    if (detailsParse.success) {
      throw new ApiClientError({
        message: error.message,
        status: error.status,
        code: error.code,
        details: detailsParse.data,
        isNetworkError: error.isNetworkError
      });
    }
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error("Request failed. Please try again.");
};

export const requestOtp = async ({ phoneNumber }: RequestOtpInput): Promise<RequestOtpResult> => {
  const requestParse = RequestOtpRequestSchema.safeParse({ phoneNumber });
  if (!requestParse.success) {
    throw new Error("Invalid phone number format.");
  }

  try {
    const response = await apiClient.post<ApiEnvelope>(
      "/auth/otp/request",
      requestParse.data,
      {
        timeout: OTP_REQUEST_TIMEOUT_MS
      }
    );

    const data = readDataRecord(response.data);
    const parseResult = RequestOtpResponseSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error("Invalid OTP request response.");
    }

    return parseResult.data;
  } catch (error: unknown) {
    return throwNormalizedAuthError(error);
  }
};

export const verifyOtp = async ({
  phoneNumber,
  requestId,
  otp
}: VerifyOtpInput): Promise<VerifyOtpResult> => {
  const requestParse = VerifyOtpRequestSchema.safeParse({
    phoneNumber,
    requestId,
    otp
  });
  if (!requestParse.success) {
    throw new Error("Invalid OTP verification payload.");
  }

  try {
    const response = await apiClient.post<ApiEnvelope>(
      "/auth/otp/verify",
      requestParse.data,
      {
        timeout: OTP_REQUEST_TIMEOUT_MS
      }
    );

    const data = readDataRecord(response.data);
    const parseResult = LoginSessionResponseSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error("Invalid OTP verification response.");
    }

    return parseResult.data;
  } catch (error: unknown) {
    return throwNormalizedAuthError(error);
  }
};

export const loginWithEmail = async ({
  email,
  password
}: EmailLoginInput): Promise<EmailLoginResult> => {
  const requestParse = EmailLoginRequestSchema.safeParse({ email, password });
  if (!requestParse.success) {
    throw new Error("Invalid email login payload.");
  }

  try {
    const response = await apiClient.post<ApiEnvelope>("/auth/email/login", requestParse.data, {
      timeout: OTP_REQUEST_TIMEOUT_MS
    });

    const data = readDataRecord(response.data);
    const parseResult = LoginSessionResponseSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error("Invalid email login response.");
    }

    return parseResult.data;
  } catch (error: unknown) {
    return throwNormalizedAuthError(error);
  }
};

export const registerWithEmail = async ({
  name,
  schoolId,
  email,
  password
}: RegisterEmailInput): Promise<RegisterEmailResult> => {
  const requestParse = RegisterEmailRequestSchema.safeParse({ name, schoolId, email, password });
  if (!requestParse.success) {
    throw new Error("Invalid registration payload.");
  }

  try {
    const response = await apiClient.post<ApiEnvelope>("/auth/email/register", requestParse.data, {
      timeout: OTP_REQUEST_TIMEOUT_MS
    });

    const data = readDataRecord(response.data);
    const parseResult = LoginSessionResponseSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error("Invalid email registration response.");
    }

    return parseResult.data;
  } catch (error: unknown) {
    return throwNormalizedAuthError(error);
  }
};

export const requestPasswordReset = async ({
  email
}: ForgotPasswordInput): Promise<ForgotPasswordResult> => {
  const requestParse = ForgotPasswordRequestSchema.safeParse({ email });
  if (!requestParse.success) {
    throw new Error("Invalid forgot password payload.");
  }

  try {
    const response = await apiClient.post<ApiEnvelope>(
      "/auth/email/forgot-password",
      requestParse.data,
      {
        timeout: OTP_REQUEST_TIMEOUT_MS
      }
    );

    const data = readDataRecord(response.data);
    const parseResult = ForgotPasswordResponseSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error("Invalid forgot password response.");
    }

    return parseResult.data;
  } catch (error: unknown) {
    return throwNormalizedAuthError(error);
  }
};

export const readEmailLoginErrorDetails = (error: unknown): EmailLoginErrorDetails | null => {
  if (!isApiClientError(error)) {
    return null;
  }

  const parsed = EmailLoginErrorDetailsSchema.safeParse(error.details);
  return parsed.success ? parsed.data : null;
};
