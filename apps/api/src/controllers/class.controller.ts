import type { RequestHandler } from "express";
import {
  ClassListResponseSchema,
  ClassSchema,
  CreateClassRequestSchema,
  LearnerListResponseSchema,
  UpdateClassRequestSchema
} from "@bridgeed/shared";

import { classService } from "../services/classes/class.service";
import { learnerService } from "../services/learners/learner.service";
import { successResponse } from "../utils/api-response";
import { AppError } from "../utils/app-error";

const parseWithSchema = <T>(schemaName: string, parseResult: { success: boolean; data?: T; error?: unknown }): T => {
  if (!parseResult.success) {
    throw new AppError(400, "VALIDATION_ERROR", `Invalid ${schemaName} payload.`, parseResult.error);
  }

  return parseResult.data as T;
};

const getAuthContext = (auth: RequestHandler extends never ? never : Express.Request["auth"]) => {
  if (!auth) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication is required.");
  }

  return auth;
};

export const createClassController: RequestHandler = async (req, res, next) => {
  try {
    const payload = parseWithSchema("create class", CreateClassRequestSchema.safeParse(req.body));
    const result = await classService.createClass(getAuthContext(req.auth), payload);
    const validatedResult = parseWithSchema("create class response", ClassSchema.safeParse(result));
    res.status(201).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};

export const listClassesController: RequestHandler = async (req, res, next) => {
  try {
    const result = await classService.listClasses(getAuthContext(req.auth));
    const validatedResult = parseWithSchema(
      "class list response",
      ClassListResponseSchema.safeParse({ classes: result })
    );
    res.status(200).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};

export const updateClassController: RequestHandler = async (req, res, next) => {
  try {
    const payload = parseWithSchema("update class", UpdateClassRequestSchema.safeParse(req.body));
    const classId = req.params.classId;
    if (!classId) {
      throw new AppError(400, "VALIDATION_ERROR", "Class identifier is required.");
    }

    const result = await classService.updateClass(getAuthContext(req.auth), classId, payload);
    const validatedResult = parseWithSchema("update class response", ClassSchema.safeParse(result));
    res.status(200).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};

export const listClassLearnersController: RequestHandler = async (req, res, next) => {
  try {
    const classId = req.params.classId;
    if (!classId) {
      throw new AppError(400, "VALIDATION_ERROR", "Class identifier is required.");
    }

    const result = await learnerService.listLearnersForClass(getAuthContext(req.auth), classId);
    const validatedResult = parseWithSchema(
      "learner list response",
      LearnerListResponseSchema.safeParse({ learners: result })
    );
    res.status(200).json(successResponse(validatedResult));
  } catch (error) {
    next(error);
  }
};
