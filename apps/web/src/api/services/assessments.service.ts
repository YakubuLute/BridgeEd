import type { GenerateScreenerRequest, GeneratedScreenerResponse } from "@bridgeed/shared";
import { api } from "./api";

export const generateScreener = async (
  data: GenerateScreenerRequest
): Promise<GeneratedScreenerResponse> => {
  const response = await api.post<{ data: GeneratedScreenerResponse }>(
    "/v1/assessments/generate",
    data
  );
  return response.data.data;
};
