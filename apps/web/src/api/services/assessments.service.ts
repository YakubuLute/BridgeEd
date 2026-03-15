import type { 
  GenerateScreenerRequest, 
  GeneratedScreenerResponse, 
  CreateAssessmentRequest, 
  Assessment 
} from "@bridgeed/shared";
import { apiClient } from "../api";

export const generateScreener = async (
  data: GenerateScreenerRequest
): Promise<GeneratedScreenerResponse> => {
  const response = await apiClient.post<{ data: GeneratedScreenerResponse }>(
    "/assessments/generate",
    data
  );
  return response.data.data;
};

export const createAssessment = async (
  data: CreateAssessmentRequest
): Promise<Assessment> => {
  const response = await apiClient.post<{ data: Assessment }>(
    "/assessments",
    data
  );
  return response.data.data;
};

export const getAssessment = async (
  assessmentId: string
): Promise<Assessment> => {
  const response = await apiClient.get<{ data: Assessment }>(
    `/assessments/${assessmentId}`
  );
  return response.data.data;
};

export const submitAssessmentResults = async (
  assessmentId: string,
  data: { classId: string; results: any[] }
): Promise<any> => {
  const response = await apiClient.post(
    `/assessments/${assessmentId}/results`,
    data
  );
  return response.data.data;
};
