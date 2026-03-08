import type { RequestHandler } from "express";
import { SchoolSchema } from "@bridgeed/shared";

import { schoolService } from "../services/schools/school.service";
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

export const getSchoolByIdController: RequestHandler = async (req, res, next) => {
  try {
    const schoolIdParam = req.params.schoolId;
    const schoolId = Array.isArray(schoolIdParam) ? schoolIdParam[0] : schoolIdParam;
    if (!schoolId) {
      throw new AppError(400, "VALIDATION_ERROR", "School identifier is required.");
    }

    const result = await schoolService.getSchoolById(getAuthContext(req.auth), schoolId);
    const validatedResult = parseWithSchema("school response", SchoolSchema.safeParse(result));
    res.status(200).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};
