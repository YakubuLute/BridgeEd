import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { BatchCreateLearnersResponse, LearnerProfileResponse, LearnerRecord } from "@bridgeed/shared";

import { queryKeys } from "../query-keys";
import {
  batchCreateLearners,
  createLearner,
  getLearnerProfile,
  type BatchCreateLearnersInput,
  type CreateLearnerInput
} from "../services/learners.service";

type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn" | "mutationKey"
>;

export const useCreateLearnerMutation = (
  classId: string,
  options?: MutationOptions<LearnerRecord, CreateLearnerInput>
): UseMutationResult<LearnerRecord, Error, CreateLearnerInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.learners.create(),
    mutationFn: createLearner,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.classes.learners(classId) });
      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options
  });
};

export const useBatchCreateLearnersMutation = (
  classId: string,
  options?: MutationOptions<BatchCreateLearnersResponse, BatchCreateLearnersInput>
): UseMutationResult<BatchCreateLearnersResponse, Error, BatchCreateLearnersInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.learners.batchCreate(),
    mutationFn: batchCreateLearners,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.classes.learners(classId) });
      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options
  });
};

export const useLearnerProfileQuery = (learnerId: string): UseQueryResult<LearnerProfileResponse, Error> =>
  useQuery({
    queryKey: queryKeys.learners.profile(learnerId),
    queryFn: () => getLearnerProfile(learnerId),
    enabled: learnerId.length > 0
  });
