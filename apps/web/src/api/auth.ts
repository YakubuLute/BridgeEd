import { API_VERSION } from "@bridgeed/shared";

const REQUEST_TIMEOUT_MS = 10_000;

type RequestOtpInput = {
  phoneNumber: string;
};

export type RequestOtpResult = {
  requestId: string;
  expiresInSeconds?: number;
};

type VerifyOtpInput = {
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

type ApiSuccessPayload = {
  data: Record<string, unknown>;
};

type UserPayload = {
  id?: unknown;
  role?: unknown;
  name?: unknown;
};

type ApiErrorPayload = {
  error?: {
    message?: string;
  };
};

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const getErrorMessage = (payload: unknown, fallback: string): string => {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    (payload as ApiErrorPayload).error &&
    typeof (payload as ApiErrorPayload).error?.message === "string"
  ) {
    return (payload as ApiErrorPayload).error?.message ?? fallback;
  }

  return fallback;
};

const postAuthJson = async (path: string, body: Record<string, unknown>): Promise<unknown> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`/api/${API_VERSION}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const payload = await readJson(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(payload, "Request failed. Please try again."));
    }

    return payload;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("OTP send timed out after 10 seconds. Please try again.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const requestOtp = async ({ phoneNumber }: RequestOtpInput): Promise<RequestOtpResult> => {
  const payload = await postAuthJson("/auth/otp/request", { phoneNumber });

  if (
    !payload ||
    typeof payload !== "object" ||
    !("data" in payload) ||
    !(payload as ApiSuccessPayload).data
  ) {
    throw new Error("Invalid OTP request response.");
  }

  const data = (payload as ApiSuccessPayload).data;
  const requestId = typeof data.requestId === "string" ? data.requestId : null;
  const expiresInSeconds =
    typeof data.expiresInSeconds === "number" ? data.expiresInSeconds : undefined;

  if (!requestId) {
    throw new Error("OTP request did not return a request id.");
  }

  return { requestId, expiresInSeconds };
};

export const verifyOtp = async ({
  phoneNumber,
  requestId,
  otp
}: VerifyOtpInput): Promise<VerifyOtpResult> => {
  const payload = await postAuthJson("/auth/otp/verify", { phoneNumber, requestId, otp });

  if (
    !payload ||
    typeof payload !== "object" ||
    !("data" in payload) ||
    !(payload as ApiSuccessPayload).data
  ) {
    throw new Error("Invalid OTP verification response.");
  }

  const data = (payload as ApiSuccessPayload).data;
  const accessToken =
    typeof data.accessToken === "string"
      ? data.accessToken
      : typeof data.token === "string"
        ? data.token
        : null;

  if (!accessToken) {
    throw new Error("Login succeeded but no secure session token was returned.");
  }

  const userPayload = data.user && typeof data.user === "object" ? (data.user as UserPayload) : null;

  return {
    accessToken,
    refreshToken: typeof data.refreshToken === "string" ? data.refreshToken : undefined,
    expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : undefined,
    user: userPayload
      ? {
          id: typeof userPayload.id === "string" ? userPayload.id : undefined,
          role: typeof userPayload.role === "string" ? userPayload.role : undefined,
          name: typeof userPayload.name === "string" ? userPayload.name : undefined
        }
      : undefined
  };
};
