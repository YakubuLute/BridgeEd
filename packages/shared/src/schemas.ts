import { z } from "zod";

import { GradeLevel, Role } from "./types";

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  name: z.string().min(1)
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const OtpPhoneNumberSchema = z
  .string()
  .regex(/^\+233\d{9}$/, "Phone number must be +233XXXXXXXXX");
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

export const AuthUserSchema = z
  .object({
    id: z.string().min(1),
    role: z.nativeEnum(Role),
    roles: z.array(z.nativeEnum(Role)).min(1).optional(),
    name: z.string().min(1),
    scope: AuthScopeSchema.optional()
  })
  .refine((value) => !value.roles || value.roles.includes(value.role), {
    message: "Primary role must be included in roles."
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

export const RegisterEmailRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  schoolId: z.string().trim().min(1, "School identifier is required."),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(/[a-z]/, "Password must include at least one lowercase letter.")
    .regex(/[0-9]/, "Password must include at least one number.")
});

export const RegisterEmailResponseSchema = LoginSessionResponseSchema;

export type RegisterEmailRequest = z.infer<typeof RegisterEmailRequestSchema>;
export type RegisterEmailResponse = z.infer<typeof RegisterEmailResponseSchema>;

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

export const SchoolSchema = z.object({
  id: z.string().min(1),
  schoolId: z.string().min(1),
  name: z.string().min(1),
  district: z.string().min(1),
  region: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type SchoolRecord = z.infer<typeof SchoolSchema>;

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

export const AssessmentStatusSchema = z.enum(["at_risk", "support", "on_track"]);

export const LearnerAssessmentSnapshotSchema = z.object({
  learnerId: z.string().min(1),
  name: z.string().min(1),
  gradeLevel: GradeLevelSchema,
  status: AssessmentStatusSchema,
  literacyScore: z.number().min(0).max(100).nullable(),
  numeracyScore: z.number().min(0).max(100).nullable(),
  lastAssessedAt: z.string().datetime().nullable()
});

export const ClassAssessmentSummarySchema = z.object({
  atRisk: z.number().int().nonnegative(),
  support: z.number().int().nonnegative(),
  onTrack: z.number().int().nonnegative(),
  totalStudents: z.number().int().nonnegative()
});

export const ClassAssessmentOverviewResponseSchema = z.object({
  class: z.object({
    classId: z.string().min(1),
    name: z.string().min(1),
    subject: z.string().min(1).optional(),
    gradeLevel: GradeLevelSchema
  }),
  summary: ClassAssessmentSummarySchema,
  learners: z.array(LearnerAssessmentSnapshotSchema)
});

export const ClassAssessmentHistoryItemSchema = z.object({
  attemptId: z.string().min(1),
  learnerId: z.string().min(1),
  learnerName: z.string().min(1),
  assessmentName: z.string().min(1),
  score: z.number().min(0).max(100).nullable(),
  assessedAt: z.string().datetime()
});

export const ClassAssessmentHistoryResponseSchema = z.object({
  attempts: z.array(ClassAssessmentHistoryItemSchema)
});

export const ActivityItemSchema = z.object({
  id: z.string().min(1),
  action: z.string().min(1),
  entity: z.string().min(1),
  entityId: z.string().min(1).optional(),
  result: z.enum(["success", "failure"]),
  metadata: z.record(z.unknown()).optional(),
  occurredAt: z.string().datetime()
});

export const ActivityResponseSchema = z.object({
  activities: z.array(ActivityItemSchema)
});

export const ReportTrendPointSchema = z.object({
  label: z.string().min(1),
  value: z.number().min(0).max(100),
  timestamp: z.string().datetime()
});

export const TeacherReportResponseSchema = z.object({
  summary: z.object({
    totalClasses: z.number().int().nonnegative(),
    totalStudents: z.number().int().nonnegative(),
    avgMastery: z.number().min(0).max(100),
    diagnosticCoverage: z.number().min(0).max(100)
  }),
  skillPerformance: z.array(
    z.object({
      skill: z.string().min(1),
      mastery: z.number().min(0).max(100)
    })
  ),
  masteryTrend: z.array(ReportTrendPointSchema)
});

export const SchoolReportResponseSchema = z.object({
  summary: z.object({
    totalTeachers: z.number().int().nonnegative(),
    totalStudents: z.number().int().nonnegative(),
    coveragePercent: z.number().min(0).max(100),
    atRiskPercent: z.number().min(0).max(100)
  }),
  gradePerformance: z.array(
    z.object({
      grade: z.string().min(1),
      literacy: z.number().min(0).max(100),
      numeracy: z.number().min(0).max(100)
    })
  ),
  regionalRank: z.number().int().positive().optional()
});

export const UpdateProfileRequestSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().trim().optional(),
  language: z.string().optional()
});

export const UserProfileSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  role: z.nativeEnum(Role),
  scope: AuthScopeSchema.optional(),
  language: z.string().optional()
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;

export type ActivityItem = z.infer<typeof ActivityItemSchema>;
export type ActivityResponse = z.infer<typeof ActivityResponseSchema>;
export type TeacherReportResponse = z.infer<typeof TeacherReportResponseSchema>;
export type SchoolReportResponse = z.infer<typeof SchoolReportResponseSchema>;
export type ReportTrendPoint = z.infer<typeof ReportTrendPointSchema>;

export type LearnerRecord = z.infer<typeof LearnerSchema>;
export type CreateLearnerRequest = z.infer<typeof CreateLearnerRequestSchema>;
export type BatchCreateLearnersRequest = z.infer<typeof BatchCreateLearnersRequestSchema>;
export type BatchCreateLearnersResponse = z.infer<typeof BatchCreateLearnersResponseSchema>;
export type LearnerListResponse = z.infer<typeof LearnerListResponseSchema>;
export type AssessmentTimelineItem = z.infer<typeof AssessmentTimelineItemSchema>;
export type SkillTrendPoint = z.infer<typeof SkillTrendPointSchema>;
export type SkillMasteryTrend = z.infer<typeof SkillMasteryTrendSchema>;
export type LearnerProfileResponse = z.infer<typeof LearnerProfileResponseSchema>;
export type AssessmentStatus = z.infer<typeof AssessmentStatusSchema>;
export type LearnerAssessmentSnapshot = z.infer<typeof LearnerAssessmentSnapshotSchema>;
export type ClassAssessmentSummary = z.infer<typeof ClassAssessmentSummarySchema>;
export type ClassAssessmentOverviewResponse = z.infer<typeof ClassAssessmentOverviewResponseSchema>;
export type ClassAssessmentHistoryItem = z.infer<typeof ClassAssessmentHistoryItemSchema>;
export type ClassAssessmentHistoryResponse = z.infer<typeof ClassAssessmentHistoryResponseSchema>;

export const GenerateScreenerRequestSchema = z.object({
  classId: z.string().min(1),
  subject: z.string().min(1),
  gradeLevel: z.string().min(1)
});

export const ScreenerQuestionSchema = z.object({
  questionText: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctAnswer: z.string().min(1),
  skillTag: z.string().optional()
});

export const GeneratedScreenerResponseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  questions: z.array(ScreenerQuestionSchema).min(1)
});

export const AssessmentSchema = z.object({
  id: z.string().min(1),
  assessmentId: z.string().min(1),
  teacherId: z.string().min(1),
  classId: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  questions: z.array(ScreenerQuestionSchema).min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const CreateAssessmentRequestSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  questions: z.array(ScreenerQuestionSchema).min(1)
});

export type GenerateScreenerRequest = z.infer<typeof GenerateScreenerRequestSchema>;
export type ScreenerQuestion = z.infer<typeof ScreenerQuestionSchema>;
export type GeneratedScreenerResponse = z.infer<typeof GeneratedScreenerResponseSchema>;
export type Assessment = z.infer<typeof AssessmentSchema>;
export type CreateAssessmentRequest = z.infer<typeof CreateAssessmentRequestSchema>;

export const LearnerAssessmentResultSchema = z.object({
  learnerId: z.string().min(1),
  scores: z.array(z.object({
    questionText: z.string().min(1),
    isCorrect: z.boolean(),
    skillTag: z.string().optional()
  }))
});

export const SubmitAssessmentResultsRequestSchema = z.object({
  assessmentId: z.string().min(1),
  classId: z.string().min(1),
  results: z.array(LearnerAssessmentResultSchema).min(1)
});

export type LearnerAssessmentResult = z.infer<typeof LearnerAssessmentResultSchema>;
export type SubmitAssessmentResultsRequest = z.infer<typeof SubmitAssessmentResultsRequestSchema>;
