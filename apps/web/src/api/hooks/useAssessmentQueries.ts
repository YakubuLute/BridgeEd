import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationResult, UseMutationOptions, UseQueryResult } from "@tanstack/react-query";
import type { 
  GenerateScreenerRequest, 
  GeneratedScreenerResponse, 
  CreateAssessmentRequest, 
  Assessment,
  AssessmentSession,
  CreateAssessmentSessionRequest
} from "@bridgeed/shared";

import { 
  generateScreener, 
  createAssessment, 
  getAssessments,
  getAssessment,
  submitAssessmentResults,
  createAssessmentSession,
  joinAssessmentSession
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

export const useAssessmentsQuery = (): UseQueryResult<Assessment[], Error> => {
  return useQuery({
    queryKey: ["assessments", "list"],
    queryFn: getAssessments
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

export const useCreateSessionMutation = (
  options?: Omit<UseMutationOptions<AssessmentSession, Error, CreateAssessmentSessionRequest>, "mutationFn" | "mutationKey">
): UseMutationResult<AssessmentSession, Error, CreateAssessmentSessionRequest> => {
  return useMutation({
    mutationFn: createAssessmentSession,
    ...options
  });
};

export const useJoinSessionQuery = (accessCode: string): UseQueryResult<{ session: AssessmentSession; assessment: Assessment }, Error> => {
  return useQuery({
    queryKey: ["sessions", "join", accessCode],
    queryFn: () => joinAssessmentSession(accessCode),
    enabled: !!accessCode && accessCode.length === 6
  });
};
