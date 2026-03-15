import { 
  TeacherReportResponseSchema, 
  SchoolReportResponseSchema,
  type TeacherReportResponse,
  type SchoolReportResponse
} from "@bridgeed/shared";
import { apiClient } from "../api";
import { readDataRecord, type ApiEnvelope } from "../response";

export const getTeacherReport = async (): Promise<TeacherReportResponse> => {
  const response = await apiClient.get<ApiEnvelope>("/reports/teacher");
  const data = readDataRecord(response.data);
  const parseResult = TeacherReportResponseSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid teacher report response.");
  }
  return parseResult.data;
};

export const getSchoolReport = async (): Promise<SchoolReportResponse> => {
  const response = await apiClient.get<ApiEnvelope>("/reports/school");
  const data = readDataRecord(response.data);
  const parseResult = SchoolReportResponseSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid school report response.");
  }
  return parseResult.data;
};
