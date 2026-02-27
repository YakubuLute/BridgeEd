export enum Role {
  Teacher = "teacher",
  SchoolAdmin = "school_admin",
  DistrictOfficer = "district_officer",
  NationalAdmin = "national_admin",
  ContentSpecialist = "content_specialist",
  Support = "support"
}

export type ApiSuccessResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorPayload = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiErrorResponse = {
  error: ApiErrorPayload;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
