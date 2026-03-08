export type ApiEnvelope = {
  data?: unknown;
};

export const readDataRecord = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    throw new Error("Invalid API response shape.");
  }

  const rawData = (payload as ApiEnvelope).data;
  if (!rawData || typeof rawData !== "object") {
    throw new Error("Invalid API response payload.");
  }

  return rawData as Record<string, unknown>;
};
