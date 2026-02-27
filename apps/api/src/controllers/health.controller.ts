import { API_VERSION, HealthResponseSchema } from "@bridgeed/shared";
import type { RequestHandler } from "express";

import { env } from "../config/env";
import { successResponse } from "../utils/api-response";

export const getHealth: RequestHandler = (_req, res) => {
  const health = HealthResponseSchema.parse({
    status: "ok",
    name: "BridgeEd API"
  });

  res.status(200).json(successResponse(health));
};

export const getVersion: RequestHandler = (_req, res) => {
  const version = process.env.npm_package_version ?? "0.1.0";

  res.status(200).json(
    successResponse({
      version,
      env: env.NODE_ENV,
      apiVersion: API_VERSION
    })
  );
};
