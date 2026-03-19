import { ActivityResponseSchema, type ActivityResponse } from "@bridgeed/shared";
import { apiClient } from "../api";
import { readDataRecord, type ApiEnvelope } from "../response";

export const getActivity = async (): Promise<ActivityResponse> => {
  const response = await apiClient.get<ApiEnvelope>("/activity");
  const data = readDataRecord(response.data);
  const parseResult = ActivityResponseSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid activity response.");
  }

  return parseResult.data;
};
