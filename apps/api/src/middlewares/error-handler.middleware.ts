import type { ErrorRequestHandler } from "express";

import { AppError } from "../utils/app-error";
import { errorResponse } from "../utils/api-response";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(errorResponse(error.code, error.message, error.details));
    return;
  }

  console.error("Unhandled API error", error);
  res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Unexpected server error"));
};
