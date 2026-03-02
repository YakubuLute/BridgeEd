import {
  BatchCreateLearnersRequestSchema,
  BatchCreateLearnersResponseSchema,
  CreateLearnerRequestSchema,
  LearnerProfileResponseSchema,
  LearnerSchema,
  type BatchCreateLearnersRequest,
  type BatchCreateLearnersResponse,
  type CreateLearnerRequest,
  type LearnerProfileResponse,
  type LearnerRecord
} from "@bridgeed/shared";

import { apiClient } from "../api";
import { readDataRecord, type ApiEnvelope } from "../response";

export type CreateLearnerInput = CreateLearnerRequest;
export type BatchCreateLearnersInput = BatchCreateLearnersRequest;

export const createLearner = async (payload: CreateLearnerInput): Promise<LearnerRecord> => {
  const requestParse = CreateLearnerRequestSchema.safeParse(payload);
  if (!requestParse.success) {
    throw new Error("Invalid learner payload.");
  }

  const response = await apiClient.post<ApiEnvelope>("/learners", requestParse.data);
  const data = readDataRecord(response.data);
  const parseResult = LearnerSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid learner create response.");
  }

  return parseResult.data;
};

export const batchCreateLearners = async (
  payload: BatchCreateLearnersInput
): Promise<BatchCreateLearnersResponse> => {
  const requestParse = BatchCreateLearnersRequestSchema.safeParse(payload);
  if (!requestParse.success) {
    throw new Error("Invalid learners batch payload.");
  }

  const response = await apiClient.post<ApiEnvelope>("/learners/batch", requestParse.data);
  const data = readDataRecord(response.data);
  const parseResult = BatchCreateLearnersResponseSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid learners batch response.");
  }

  return parseResult.data;
};

export const getLearnerProfile = async (learnerId: string): Promise<LearnerProfileResponse> => {
  const response = await apiClient.get<ApiEnvelope>(`/learners/${learnerId}/profile`);
  const data = readDataRecord(response.data);
  const parseResult = LearnerProfileResponseSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid learner profile response.");
  }

  return parseResult.data;
};
