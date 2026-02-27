import type { ApiErrorResponse, ApiSuccessResponse } from "@bridgeed/shared";

export const successResponse = <T>(
  data: T,
  meta?: Record<string, unknown>
): ApiSuccessResponse<T> => {
  if (meta) {
    return { data, meta };
  }

  return { data };
};

export const errorResponse = (
  code: string,
  message: string,
  details?: unknown
): ApiErrorResponse => ({
  error: {
    code,
    message,
    details
  }
});
