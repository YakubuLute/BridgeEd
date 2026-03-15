import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type {
  ClassAssessmentHistoryResponse,
  ClassAssessmentOverviewResponse,
  ClassRecord,
  LearnerRecord
} from "@bridgeed/shared";

import { queryKeys } from "../query-keys";
import {
  createClass,
  getClassAssessmentHistory,
  getClassAssessmentOverview,
  getClassLearners,
  getClasses,
  updateClass,
  type CreateClassInput,
  type UpdateClassInput
} from "../services/classes.service";

type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn" | "mutationKey"
>;

export const useClassesQuery = (): UseQueryResult<ClassRecord[], Error> =>
  useQuery({
    queryKey: queryKeys.classes.list(),
    queryFn: getClasses
  });

export const useCreateClassMutation = (
  options?: MutationOptions<ClassRecord, CreateClassInput>
): UseMutationResult<ClassRecord, Error, CreateClassInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.classes.create(),
    mutationFn: createClass,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.classes.list() });
      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options
  });
};

export const useUpdateClassMutation = (
  options?: MutationOptions<ClassRecord, UpdateClassInput>
): UseMutationResult<ClassRecord, Error, UpdateClassInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.classes.update(),
    mutationFn: updateClass,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.classes.list() });
      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options
  });
};

export const useClassLearnersQuery = (classId: string): UseQueryResult<LearnerRecord[], Error> =>
  useQuery({
    queryKey: queryKeys.classes.learners(classId),
    queryFn: () => getClassLearners(classId),
    enabled: classId.length > 0
  });

export const useClassAssessmentOverviewQuery = (
  classId: string
): UseQueryResult<ClassAssessmentOverviewResponse, Error> =>
  useQuery({
    queryKey: queryKeys.classes.assessmentOverview(classId),
    queryFn: () => getClassAssessmentOverview(classId),
    enabled: classId.length > 0
  });

export const useClassAssessmentHistoryQuery = (
  classId: string
): UseQueryResult<ClassAssessmentHistoryResponse, Error> =>
  useQuery({
    queryKey: queryKeys.classes.assessmentHistory(classId),
    queryFn: () => getClassAssessmentHistory(classId),
    enabled: classId.length > 0
  });
