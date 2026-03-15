import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationResult, UseMutationOptions, UseQueryResult } from "@tanstack/react-query";
import type { 
  GenerateScreenerRequest, 
  GeneratedScreenerResponse, 
  CreateAssessmentRequest, 
  Assessment 
} from "@bridgeed/shared";

import { 
  generateScreener, 
  createAssessment, 
  getAssessment,
  submitAssessmentResults 
} from "../services/assessments.service";

export const useGenerateScreenerMutation = (
  options?: Omit<UseMutationOptions<GeneratedScreenerResponse, Error, GenerateScreenerRequest>, "mutationFn" | "mutationKey">
): UseMutationResult<GeneratedScreenerResponse, Error, GenerateScreenerRequest> => {
  return useMutation({
    mutationFn: generateScreener,
    ...options
  });
};

export const useCreateAssessmentMutation = (
  options?: Omit<UseMutationOptions<Assessment, Error, CreateAssessmentRequest>, "mutationFn" | "mutationKey">
): UseMutationResult<Assessment, Error, CreateAssessmentRequest> => {
  return useMutation({
    mutationFn: createAssessment,
    ...options
  });
};

export const useAssessmentQuery = (assessmentId: string): UseQueryResult<Assessment, Error> => {
  return useQuery({
    queryKey: ["assessments", assessmentId],
    queryFn: () => getAssessment(assessmentId),
    enabled: !!assessmentId
  });
};

export const useSubmitResultsMutation = (
  assessmentId: string,
  options?: Omit<UseMutationOptions<any, Error, { classId: string; results: any[] }>, "mutationFn" | "mutationKey">
): UseMutationResult<any, Error, { classId: string; results: any[] }> => {
  return useMutation({
    mutationFn: (data) => submitAssessmentResults(assessmentId, data),
    ...options
  });
};
