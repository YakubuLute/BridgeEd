export enum Role {
  Teacher = "teacher",
  SchoolAdmin = "school_admin",
  DistrictOfficer = "district_officer",
  NationalAdmin = "national_admin",
  ContentSpecialist = "content_specialist",
  Support = "support"
}

export enum GradeLevel {
  JHS1 = "JHS1",
  JHS2 = "JHS2",
  JHS3 = "JHS3",
  SHS1 = "SHS1",
  SHS2 = "SHS2",
  SHS3 = "SHS3",
  TVET1 = "TVET1",
  TVET2 = "TVET2",
  TVET3 = "TVET3"
}

export type AuthScope = {
  schoolId?: string;
  districtId?: string;
  region?: string;
};

export type AuthUser = {
  id: string;
  role: Role;
  name: string;
  scope?: AuthScope;
};

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
