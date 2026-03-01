import { z } from "zod";
import { Role } from "./types";

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

export const AuthUserSchema = z.object({
  id: z.string().min(1),
  role: z.nativeEnum(Role),
  name: z.string().min(1)
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
