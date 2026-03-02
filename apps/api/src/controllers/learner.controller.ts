import type { RequestHandler } from "express";
import {
  BatchCreateLearnersRequestSchema,
  BatchCreateLearnersResponseSchema,
  CreateLearnerRequestSchema,
  LearnerProfileResponseSchema,
  LearnerSchema
} from "@bridgeed/shared";

import { learnerService } from "../services/learners/learner.service";
import { learnerProfileService } from "../services/profile/learner-profile.service";
import type { AuthContext } from "../types/auth";
import { successResponse } from "../utils/api-response";
import { AppError } from "../utils/app-error";

const parseWithSchema = <T>(schemaName: string, parseResult: { success: boolean; data?: T; error?: unknown }): T => {
  if (!parseResult.success) {
    throw new AppError(400, "VALIDATION_ERROR", `Invalid ${schemaName} payload.`, parseResult.error);
  }

  return parseResult.data as T;
};

const getAuthContext = (auth: AuthContext | undefined): AuthContext => {
  if (!auth) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication is required.");
  }

  return auth;
};

export const createLearnerController: RequestHandler = async (req, res, next) => {
  try {
    const payload = parseWithSchema("create learner", CreateLearnerRequestSchema.safeParse(req.body));
    const result = await learnerService.createLearner(getAuthContext(req.auth), payload);
    const validatedResult = parseWithSchema("create learner response", LearnerSchema.safeParse(result));
    res.status(201).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};

export const batchCreateLearnersController: RequestHandler = async (req, res, next) => {
  try {
    const payload = parseWithSchema("batch create learners", BatchCreateLearnersRequestSchema.safeParse(req.body));
    const result = await learnerService.batchCreateLearners(getAuthContext(req.auth), payload);
    const validatedResult = parseWithSchema(
      "batch create learners response",
      BatchCreateLearnersResponseSchema.safeParse(result)
    );
    res.status(201).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};

export const getLearnerProfileController: RequestHandler = async (req, res, next) => {
  try {
    const learnerIdParam = req.params.learnerId;
    const learnerId = Array.isArray(learnerIdParam) ? learnerIdParam[0] : learnerIdParam;
    if (!learnerId) {
      throw new AppError(400, "VALIDATION_ERROR", "Learner identifier is required.");
    }

    const result = await learnerProfileService.getLearnerProfile(getAuthContext(req.auth), learnerId);
    const validatedResult = parseWithSchema(
      "learner profile response",
      LearnerProfileResponseSchema.safeParse(result)
    );
    res.status(200).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};
