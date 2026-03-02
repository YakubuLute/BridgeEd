import type { RequestHandler } from "express";

import { AppError } from "../utils/app-error";

type Bucket = {
  count: number;
  resetAtMs: number;
};

const buckets = new Map<string, Bucket>();

export const createRateLimitMiddleware = ({
  keyPrefix,
  windowMs,
  maxRequests
}: {
  keyPrefix: string;
  windowMs: number;
  maxRequests: number;
}): RequestHandler => {
  const cleanupIntervalMs = Math.max(windowMs, 30_000);
  let nextCleanupAtMs = Date.now() + cleanupIntervalMs;

  return (req, _res, next) => {
    const now = Date.now();
    const ip = req.ip || "unknown";
    const key = `${keyPrefix}:${ip}`;

    const current = buckets.get(key);
    if (!current || current.resetAtMs <= now) {
      buckets.set(key, {
        count: 1,
        resetAtMs: now + windowMs
      });
      next();
      return;
    }

    if (current.count >= maxRequests) {
      throw new AppError(429, "RATE_LIMIT_EXCEEDED", "Too many requests. Please try again shortly.", {
        retryAfterSeconds: Math.ceil((current.resetAtMs - now) / 1000),
        maxRequests
      });
    }

    current.count += 1;
    buckets.set(key, current);

    if (now >= nextCleanupAtMs) {
      for (const [bucketKey, bucket] of buckets.entries()) {
        if (bucket.resetAtMs <= now) {
          buckets.delete(bucketKey);
        }
      }
      nextCleanupAtMs = now + cleanupIntervalMs;
    }

    next();
  };
};
