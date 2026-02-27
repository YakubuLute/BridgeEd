import { API_VERSION, HealthResponseSchema, type HealthResponse } from "@bridgeed/shared";

type HealthApiResponse = {
  data: HealthResponse;
};

export const fetchHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`/api/${API_VERSION}/health`, {
    headers: {
      Accept: "application/json"
    }
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch API health");
  }

  if (typeof payload !== "object" || payload === null || !("data" in payload)) {
    throw new Error("Invalid API response shape");
  }

  const result = HealthResponseSchema.safeParse((payload as HealthApiResponse).data);

  if (!result.success) {
    throw new Error("Invalid health payload");
  }

  return result.data;
};
