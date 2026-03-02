import { z } from "zod";

import { GradeLevel, Role } from "./types";

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  name: z.string().min(1)
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const OtpPhoneNumberSchema = z.string().regex(/^\+233\d{9}$/, "Phone number must be +233XXXXXXXXX");
export const OtpCodeSchema = z.string().regex(/^\d{6}$/, "OTP must be a 6-digit code");

export const RequestOtpRequestSchema = z.object({
  phoneNumber: OtpPhoneNumberSchema
});

export const RequestOtpResponseSchema = z.object({
  requestId: z.string().min(1),
  expiresInSeconds: z.number().int().positive()
});

export type RequestOtpRequest = z.infer<typeof RequestOtpRequestSchema>;
export type RequestOtpResponse = z.infer<typeof RequestOtpResponseSchema>;

export const VerifyOtpRequestSchema = z.object({
  phoneNumber: OtpPhoneNumberSchema,
  requestId: z.string().min(1),
  otp: OtpCodeSchema
});

export const AuthScopeSchema = z
  .object({
    schoolId: z.string().min(1).optional(),
    districtId: z.string().min(1).optional(),
    region: z.string().min(1).optional()
  })
  .strict();

export const AuthUserSchema = z.object({
  id: z.string().min(1),
  role: z.nativeEnum(Role),
  name: z.string().min(1),
  scope: AuthScopeSchema.optional()
});

export const LoginSessionResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  user: AuthUserSchema
});

export type VerifyOtpRequest = z.infer<typeof VerifyOtpRequestSchema>;
export type LoginSessionResponse = z.infer<typeof LoginSessionResponseSchema>;

export const EmailLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type EmailLoginRequest = z.infer<typeof EmailLoginRequestSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email()
});

export const ForgotPasswordResponseSchema = z.object({
  email: z.string().email(),
  resetTokenExpiresInMinutes: z.number().int().positive()
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponseSchema>;

export const EmailLoginErrorDetailsSchema = z.object({
  attemptsRemaining: z.number().int().min(0).optional(),
  maxAttempts: z.number().int().positive().optional(),
  lockoutMinutes: z.number().int().positive().optional(),
  isLockedOut: z.boolean().optional()
});

export type EmailLoginErrorDetails = z.infer<typeof EmailLoginErrorDetailsSchema>;

export const GradeLevelSchema = z.nativeEnum(GradeLevel);
export type GradeLevelValue = z.infer<typeof GradeLevelSchema>;

export const JwtAuthClaimsSchema = z.object({
  sub: z.string().min(1),
  role: z.nativeEnum(Role),
  name: z.string().min(1),
  scope: AuthScopeSchema.optional(),
  iat: z.number().int().nonnegative(),
  exp: z.number().int().positive()
});

export type JwtAuthClaims = z.infer<typeof JwtAuthClaimsSchema>;

export const ClassSchema = z.object({
  id: z.string().min(1),
  classId: z.string().min(1),
  schoolId: z.string().min(1),
  teacherId: z.string().min(1),
  name: z.string().min(1),
  gradeLevel: GradeLevelSchema,
  subject: z.string().min(1).optional(),
  academicYear: z.string().min(1).optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const CreateClassRequestSchema = z.object({
  name: z.string().trim().min(1, "Class name is required."),
  gradeLevel: GradeLevelSchema,
  subject: z.string().trim().min(1).optional(),
  academicYear: z.string().trim().min(1).optional()
});

export const UpdateClassRequestSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    gradeLevel: GradeLevelSchema.optional(),
    subject: z.string().trim().min(1).optional(),
    academicYear: z.string().trim().min(1).optional(),
    isActive: z.boolean().optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required to update a class."
  });

export const ClassListResponseSchema = z.object({
  classes: z.array(ClassSchema)
});

export type ClassRecord = z.infer<typeof ClassSchema>;
export type CreateClassRequest = z.infer<typeof CreateClassRequestSchema>;
export type UpdateClassRequest = z.infer<typeof UpdateClassRequestSchema>;
export type ClassListResponse = z.infer<typeof ClassListResponseSchema>;

export const LearnerSchema = z.object({
  id: z.string().min(1),
  learnerId: z.string().min(1),
  schoolId: z.string().min(1),
  classId: z.string().min(1),
  name: z.string().min(1),
  gradeLevel: GradeLevelSchema,
  createdBy: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const CreateLearnerRequestSchema = z.object({
  classId: z.string().min(1),
  name: z.string().trim().min(1, "Learner name is required."),
  gradeLevel: GradeLevelSchema
});

export const LearnerBatchRowSchema = z.object({
  name: z.string().trim().min(1, "Learner name is required."),
  gradeLevel: GradeLevelSchema
});

export const BatchCreateLearnersRequestSchema = z.object({
  classId: z.string().min(1),
  rows: z.array(LearnerBatchRowSchema).min(1).max(500)
});

export const BatchCreateLearnersResponseSchema = z.object({
  createdCount: z.number().int().nonnegative(),
  learners: z.array(LearnerSchema)
});

export const LearnerListResponseSchema = z.object({
  learners: z.array(LearnerSchema)
});

export const AssessmentTimelineItemSchema = z.object({
  attemptId: z.string().min(1),
  assessmentName: z.string().min(1),
  domain: z.string().min(1).optional(),
  score: z.number().min(0).max(100).nullable(),
  assessedAt: z.string().datetime()
});

export const SkillTrendPointSchema = z.object({
  measuredAt: z.string().datetime(),
  masteryScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1).nullable()
});

export const SkillMasteryTrendSchema = z.object({
  skillCode: z.string().min(1),
  skillName: z.string().min(1),
  points: z.array(SkillTrendPointSchema)
});

export const LearnerProfileResponseSchema = z.object({
  learner: LearnerSchema,
  assessmentTimeline: z.array(AssessmentTimelineItemSchema),
  masteryTrends: z.array(SkillMasteryTrendSchema)
});

export type LearnerRecord = z.infer<typeof LearnerSchema>;
export type CreateLearnerRequest = z.infer<typeof CreateLearnerRequestSchema>;
export type BatchCreateLearnersRequest = z.infer<typeof BatchCreateLearnersRequestSchema>;
export type BatchCreateLearnersResponse = z.infer<typeof BatchCreateLearnersResponseSchema>;
export type LearnerListResponse = z.infer<typeof LearnerListResponseSchema>;
export type AssessmentTimelineItem = z.infer<typeof AssessmentTimelineItemSchema>;
export type SkillTrendPoint = z.infer<typeof SkillTrendPointSchema>;
export type SkillMasteryTrend = z.infer<typeof SkillMasteryTrendSchema>;
export type LearnerProfileResponse = z.infer<typeof LearnerProfileResponseSchema>;
