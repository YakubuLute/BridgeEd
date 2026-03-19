import { UserProfileSchema, type UserProfile, type UpdateProfileRequest } from "@bridgeed/shared";
import { apiClient } from "../api";
import { readDataRecord, type ApiEnvelope } from "../response";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<ApiEnvelope>("/profile");
  const data = readDataRecord(response.data);
  const parseResult = UserProfileSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid profile response.");
  }
  return parseResult.data;
};

export const updateProfile = async (payload: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await apiClient.patch<ApiEnvelope>("/profile", payload);
  const data = readDataRecord(response.data);
  const parseResult = UserProfileSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Invalid profile update response.");
  }
  return parseResult.data;
};
