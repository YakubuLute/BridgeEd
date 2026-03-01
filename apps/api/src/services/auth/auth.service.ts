import crypto from "node:crypto";
import { Role } from "@bridgeed/shared";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginSessionResponse,
  RequestOtpRequest,
  RequestOtpResponse,
  VerifyOtpRequest
} from "@bridgeed/shared";

import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";
import { logAuditEvent, toAuditActor } from "../audit/audit.service";

type OtpRecord = {
  phoneNumber: string;
  otp: string;
  expiresAt: number;
};

type AuthAccount = {
  email: string;
  password: string;
  user: {
    id: string;
    role: Role;
    name: string;
  };
  failedAttempts: number;
  lockedUntilMs: number | null;
};

type PasswordResetRecord = {
  token: string;
  expiresAt: number;
};

const otpRecords = new Map<string, OtpRecord>();
const passwordResetRecords = new Map<string, PasswordResetRecord>();

const accountsByEmail = new Map<string, AuthAccount>([
  [
    "teacher@bridgeed.gh",
    {
      email: "teacher@bridgeed.gh",
      password: "Teacher123",
      user: {
        id: "teacher-1",
        role: Role.Teacher,
        name: "BridgeEd Teacher"
      },
      failedAttempts: 0,
      lockedUntilMs: null
    }
  ]
]);

const createToken = (): string => crypto.randomBytes(32).toString("hex");
const createOtpCode = (): string => `${Math.floor(100000 + Math.random() * 900000)}`;

const createSession = (user: AuthAccount["user"]): LoginSessionResponse => {
  const expiresAt = new Date(Date.now() + env.AUTH_SESSION_TTL_MINUTES * 60_000).toISOString();
  return {
    accessToken: createToken(),
    refreshToken: createToken(),
    expiresAt,
    user
  };
};

const getRemainingLockoutMinutes = (lockedUntilMs: number): number =>
  Math.max(1, Math.ceil((lockedUntilMs - Date.now()) / 60_000));

const clearExpiredOtpRecords = (): void => {
  const now = Date.now();
  for (const [requestId, record] of otpRecords.entries()) {
    if (record.expiresAt <= now) {
      otpRecords.delete(requestId);
    }
  }
};

const clearExpiredPasswordResetRecords = (): void => {
  const now = Date.now();
  for (const [email, record] of passwordResetRecords.entries()) {
    if (record.expiresAt <= now) {
      passwordResetRecords.delete(email);
    }
  }
};

export const authService = {
  requestOtp(payload: RequestOtpRequest): RequestOtpResponse {
    clearExpiredOtpRecords();

    const requestId = crypto.randomUUID();
    const otpCode = createOtpCode();
    const expiresAt = Date.now() + env.OTP_EXPIRY_SECONDS * 1000;

    otpRecords.set(requestId, {
      phoneNumber: payload.phoneNumber,
      otp: otpCode,
      expiresAt
    });

    logAuditEvent({
      action: "auth.otp.request",
      actor: toAuditActor(payload.phoneNumber, "phone"),
      entity: "otp_request",
      entityId: requestId,
      result: "success",
      metadata: { expiresInSeconds: env.OTP_EXPIRY_SECONDS }
    });

    if (env.NODE_ENV !== "production") {
      console.info("[auth][debug] OTP generated", {
        requestId,
        phoneNumber: payload.phoneNumber,
        otp: otpCode
      });
    }

    return {
      requestId,
      expiresInSeconds: env.OTP_EXPIRY_SECONDS
    };
  },

  verifyOtp(payload: VerifyOtpRequest): LoginSessionResponse {
    clearExpiredOtpRecords();

    const record = otpRecords.get(payload.requestId);
    if (!record) {
      throw new AppError(400, "INVALID_OTP_REQUEST", "OTP request was not found.");
    }

    if (record.phoneNumber !== payload.phoneNumber) {
      throw new AppError(400, "INVALID_OTP_REQUEST", "OTP request does not match this phone number.");
    }

    if (record.expiresAt <= Date.now()) {
      otpRecords.delete(payload.requestId);
      throw new AppError(400, "OTP_EXPIRED", "OTP has expired. Request a new code.");
    }

    if (record.otp !== payload.otp) {
      throw new AppError(400, "INVALID_OTP", "Invalid OTP. Please try again.");
    }

    otpRecords.delete(payload.requestId);

    const user = {
      id: `teacher-${payload.phoneNumber.slice(-6)}`,
      role: Role.Teacher,
      name: "BridgeEd Teacher"
    };

    logAuditEvent({
      action: "auth.otp.verify",
      actor: toAuditActor(payload.phoneNumber, "phone"),
      entity: "session",
      result: "success"
    });

    return createSession(user);
  },

  loginWithEmail(email: string, password: string): LoginSessionResponse {
    const normalizedEmail = email.trim().toLowerCase();
    const account = accountsByEmail.get(normalizedEmail);

    if (!account) {
      logAuditEvent({
        action: "auth.email.login",
        actor: toAuditActor(normalizedEmail, "email"),
        entity: "session",
        result: "failure"
      });
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.", {
        attemptsRemaining: env.AUTH_MAX_LOGIN_ATTEMPTS - 1,
        maxAttempts: env.AUTH_MAX_LOGIN_ATTEMPTS,
        isLockedOut: false
      });
    }

    if (account.lockedUntilMs && account.lockedUntilMs > Date.now()) {
      const lockoutMinutes = getRemainingLockoutMinutes(account.lockedUntilMs);
      throw new AppError(423, "ACCOUNT_LOCKED", `Account locked. Please try again in ${lockoutMinutes} minutes.`, {
        attemptsRemaining: 0,
        maxAttempts: env.AUTH_MAX_LOGIN_ATTEMPTS,
        isLockedOut: true,
        lockoutMinutes
      });
    }

    if (account.password !== password) {
      account.failedAttempts += 1;

      const attemptsRemaining = Math.max(0, env.AUTH_MAX_LOGIN_ATTEMPTS - account.failedAttempts);
      const shouldLock = account.failedAttempts >= env.AUTH_MAX_LOGIN_ATTEMPTS;

      if (shouldLock) {
        account.lockedUntilMs = Date.now() + env.AUTH_LOCKOUT_MINUTES * 60_000;
        throw new AppError(
          423,
          "ACCOUNT_LOCKED",
          `Too many failed attempts. Account locked for ${env.AUTH_LOCKOUT_MINUTES} minutes.`,
          {
            attemptsRemaining: 0,
            maxAttempts: env.AUTH_MAX_LOGIN_ATTEMPTS,
            isLockedOut: true,
            lockoutMinutes: env.AUTH_LOCKOUT_MINUTES
          }
        );
      }

      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.", {
        attemptsRemaining,
        maxAttempts: env.AUTH_MAX_LOGIN_ATTEMPTS,
        isLockedOut: false
      });
    }

    account.failedAttempts = 0;
    account.lockedUntilMs = null;

    logAuditEvent({
      action: "auth.email.login",
      actor: toAuditActor(normalizedEmail, "email"),
      entity: "session",
      result: "success"
    });

    return createSession(account.user);
  },

  requestPasswordReset(payload: ForgotPasswordRequest): ForgotPasswordResponse {
    clearExpiredPasswordResetRecords();

    const normalizedEmail = payload.email.trim().toLowerCase();
    const accountExists = accountsByEmail.has(normalizedEmail);
    const expiresAt = Date.now() + env.PASSWORD_RESET_TOKEN_TTL_MINUTES * 60_000;

    if (accountExists) {
      passwordResetRecords.set(normalizedEmail, {
        token: createToken(),
        expiresAt
      });
    }

    logAuditEvent({
      action: "auth.password.forgot",
      actor: toAuditActor(normalizedEmail, "email"),
      entity: "password_reset",
      result: "success",
      metadata: { accountExists }
    });

    return {
      email: normalizedEmail,
      resetTokenExpiresInMinutes: env.PASSWORD_RESET_TOKEN_TTL_MINUTES
    };
  }
};
