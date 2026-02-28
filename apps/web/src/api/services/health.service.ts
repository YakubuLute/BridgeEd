import { HealthResponseSchema, type HealthResponse } from "@bridgeed/shared";

import { apiClient } from "../api";

type HealthEnvelope = {
  data?: unknown;
};

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthEnvelope>("/health");
  const payload = response.data;

  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    throw new Error("Invalid API response shape");
  }

  const result = HealthResponseSchema.safeParse(payload.data);
  if (!result.success) {
    throw new Error("Invalid health payload");
  }

  return result.data;
};
