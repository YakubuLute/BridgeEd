import {
  ClassAssessmentOverviewResponseSchema,
  ClassListResponseSchema,
  ClassSchema,
  CreateClassRequestSchema,
  UpdateClassRequestSchema,
  LearnerListResponseSchema,
  type ClassAssessmentOverviewResponse,
  type ClassRecord,
  type CreateClassRequest,
  type UpdateClassRequest,
  type LearnerRecord
} from "@bridgeed/shared";

import { apiClient } from "../api";
import { readDataRecord, type ApiEnvelope } from "../response";

export type CreateClassInput = CreateClassRequest;
export type UpdateClassInput = { classId: string; payload: UpdateClassRequest };

export const getClasses = async (): Promise<ClassRecord[]> => {
  const response = await apiClient.get<ApiEnvelope>("/classes");
  const data = readDataRecord(response.data);
  const parseResult = ClassListResponseSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid class list response.");
  }

  return parseResult.data.classes;
};

export const createClass = async (payload: CreateClassInput): Promise<ClassRecord> => {
  const requestParse = CreateClassRequestSchema.safeParse(payload);
  if (!requestParse.success) {
    throw new Error("Invalid class payload.");
  }

  const response = await apiClient.post<ApiEnvelope>("/classes", requestParse.data);
  const data = readDataRecord(response.data);
  const parseResult = ClassSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid class create response.");
  }

  return parseResult.data;
};

export const updateClass = async ({ classId, payload }: UpdateClassInput): Promise<ClassRecord> => {
  const requestParse = UpdateClassRequestSchema.safeParse(payload);
  if (!requestParse.success) {
    throw new Error("Invalid class update payload.");
  }

  const response = await apiClient.patch<ApiEnvelope>(`/classes/${classId}`, requestParse.data);
  const data = readDataRecord(response.data);
  const parseResult = ClassSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid class update response.");
  }

  return parseResult.data;
};

export const getClassLearners = async (classId: string): Promise<LearnerRecord[]> => {
  const response = await apiClient.get<ApiEnvelope>(`/classes/${classId}/learners`);
  const data = readDataRecord(response.data);
  const parseResult = LearnerListResponseSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid class learners response.");
  }

  return parseResult.data.learners;
};

export const getClassAssessmentOverview = async (
  classId: string
): Promise<ClassAssessmentOverviewResponse> => {
  const response = await apiClient.get<ApiEnvelope>(`/classes/${classId}/assessment-overview`);
  const data = readDataRecord(response.data);
  const parseResult = ClassAssessmentOverviewResponseSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid class assessment overview response.");
  }

  return parseResult.data;
};
