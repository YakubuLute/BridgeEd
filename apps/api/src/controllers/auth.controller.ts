import type { RequestHandler } from "express";
import {
  EmailLoginRequestSchema,
  ForgotPasswordResponseSchema,
  ForgotPasswordRequestSchema,
  LoginSessionResponseSchema,
  RegisterEmailRequestSchema,
  RegisterEmailResponseSchema,
  RequestOtpRequestSchema,
  RequestOtpResponseSchema,
  VerifyOtpRequestSchema
} from "@bridgeed/shared";

import { authService } from "../services/auth/auth.service";
import { successResponse } from "../utils/api-response";
import { AppError } from "../utils/app-error";

const parseWithSchema = <T>(schemaName: string, parseResult: { success: boolean; data?: T; error?: unknown }): T => {
  if (!parseResult.success) {
    throw new AppError(400, "VALIDATION_ERROR", `Invalid ${schemaName} payload.`, parseResult.error);
  }

  return parseResult.data as T;
};

export const requestOtpController: RequestHandler = (req, res) => {
  const payload = parseWithSchema("request OTP", RequestOtpRequestSchema.safeParse(req.body));
  const result = authService.requestOtp(payload);
  const validatedResult = parseWithSchema("request OTP response", RequestOtpResponseSchema.safeParse(result));

  res.status(200).json(successResponse(validatedResult));
};

export const verifyOtpController: RequestHandler = (req, res) => {
  const payload = parseWithSchema("verify OTP", VerifyOtpRequestSchema.safeParse(req.body));
  const result = authService.verifyOtp(payload);
  const validatedResult = parseWithSchema("verify OTP response", LoginSessionResponseSchema.safeParse(result));

  res.status(200).json(successResponse(validatedResult));
};

export const registerEmailController: RequestHandler = async (req, res, next) => {
  try {
    const payload = parseWithSchema("email registration", RegisterEmailRequestSchema.safeParse(req.body));
    const result = await authService.registerWithEmail(payload);
    const validatedResult = parseWithSchema(
      "email registration response",
      RegisterEmailResponseSchema.safeParse(result)
    );

    res.status(201).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};

export const emailLoginController: RequestHandler = async (req, res, next) => {
  try {
    const payload = parseWithSchema("email login", EmailLoginRequestSchema.safeParse(req.body));
    const result = await authService.loginWithEmail(payload.email, payload.password);
    const validatedResult = parseWithSchema("email login response", LoginSessionResponseSchema.safeParse(result));

    res.status(200).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController: RequestHandler = async (req, res, next) => {
  try {
    const payload = parseWithSchema("forgot password", ForgotPasswordRequestSchema.safeParse(req.body));
    const result = await authService.requestPasswordReset(payload);
    const validatedResult = parseWithSchema(
      "forgot password response",
      ForgotPasswordResponseSchema.safeParse(result)
    );

    res.status(200).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};
