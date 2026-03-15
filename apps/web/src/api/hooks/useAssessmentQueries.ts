import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult, UseMutationOptions } from "@tanstack/react-query";
import type { GenerateScreenerRequest, GeneratedScreenerResponse } from "@bridgeed/shared";

import { generateScreener } from "../services/assessments.service";

type MutationOptions = Omit<
  UseMutationOptions<GeneratedScreenerResponse, Error, GenerateScreenerRequest>,
  "mutationFn" | "mutationKey"
>;

export const useGenerateScreenerMutation = (
  options?: MutationOptions
): UseMutationResult<GeneratedScreenerResponse, Error, GenerateScreenerRequest> => {
  return useMutation({
    mutationFn: generateScreener,
    ...options
  });
};
