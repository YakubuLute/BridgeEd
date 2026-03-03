import { SchoolSchema, type SchoolRecord } from "@bridgeed/shared";

import { apiClient } from "../api";
import { readDataRecord, type ApiEnvelope } from "../response";

export const getSchoolById = async (schoolId: string): Promise<SchoolRecord> => {
  const normalizedSchoolId = schoolId.trim();
  if (normalizedSchoolId.length === 0) {
    throw new Error("School identifier is required.");
  }

  const response = await apiClient.get<ApiEnvelope>(`/schools/${encodeURIComponent(normalizedSchoolId)}`);
  const data = readDataRecord(response.data);
  const parseResult = SchoolSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid school details response.");
  }

  return parseResult.data;
};
