import { API_VERSION, type ApiErrorPayload } from "@bridgeed/shared";
import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";

const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;
const SESSION_STORAGE_KEY = "bridgeed.session";

type SessionPayload = {
  accessToken?: string;
  token?: string;
};

type ErrorEnvelope = {
  error?: ApiErrorPayload;
};

const resolveRequestTimeoutMs = (): number => {
  const parsedTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? DEFAULT_REQUEST_TIMEOUT_MS);
  return Number.isFinite(parsedTimeout) && parsedTimeout > 0
    ? Math.floor(parsedTimeout)
    : DEFAULT_REQUEST_TIMEOUT_MS;
};

const getAccessToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const sessionJson = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionJson) {
    return null;
  }

  try {
    const session = JSON.parse(sessionJson) as SessionPayload;
    if (typeof session.accessToken === "string" && session.accessToken.length > 0) {
      return session.accessToken;
    }

    if (typeof session.token === "string" && session.token.length > 0) {
      return session.token;
    }
  } catch {
    return null;
  }

  return null;
};

export class ApiClientError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly isNetworkError: boolean;

  constructor({
    message,
    status,
    code,
    details,
    isNetworkError
  }: {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
    isNetworkError: boolean;
  }) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.isNetworkError = isNetworkError;
  }
}

const toApiClientError = (error: unknown): ApiClientError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorEnvelope>;
    const status = axiosError.response?.status;
    const responseError = axiosError.response?.data?.error;
    const isNetworkError = !axiosError.response;

    if (axiosError.code === "ECONNABORTED") {
      return new ApiClientError({
        message: "Request timed out. Please try again.",
        status,
        code: axiosError.code,
        details: responseError?.details,
        isNetworkError
      });
    }

    if (isNetworkError) {
      return new ApiClientError({
        message: "Network error. Check your connection and try again.",
        status,
        code: axiosError.code,
        details: responseError?.details,
        isNetworkError
      });
    }

    return new ApiClientError({
      message: responseError?.message ?? "Request failed. Please try again.",
      status,
      code: responseError?.code ?? axiosError.code,
      details: responseError?.details,
      isNetworkError
    });
  }

  if (error instanceof Error) {
    return new ApiClientError({
      message: error.message,
      isNetworkError: false
    });
  }

  return new ApiClientError({
    message: "Unexpected error. Please try again.",
    isNetworkError: false
  });
};

export const isApiClientError = (error: unknown): error is ApiClientError =>
  error instanceof ApiClientError;

export const apiClient: AxiosInstance = axios.create({
  baseURL: `/api/${API_VERSION}`,
  timeout: resolveRequestTimeoutMs(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiClientError(error))
);
