import { Router } from "express";

import { env } from "../../config/env";
import {
  emailLoginController,
  forgotPasswordController,
  registerEmailController,
  requestOtpController,
  verifyOtpController
} from "../../controllers/auth.controller";
import { createRateLimitMiddleware } from "../../middlewares/rate-limit.middleware";

const router = Router();

const authRateLimit = createRateLimitMiddleware({
  keyPrefix: "auth",
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  maxRequests: env.AUTH_RATE_LIMIT_MAX
});

router.post("/auth/otp/request", authRateLimit, requestOtpController);
router.post("/auth/otp/verify", authRateLimit, verifyOtpController);
router.post("/auth/email/register", authRateLimit, registerEmailController);
router.post("/auth/email/login", authRateLimit, emailLoginController);
router.post("/auth/email/forgot-password", authRateLimit, forgotPasswordController);

export default router;
