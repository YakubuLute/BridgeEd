import crypto from "node:crypto";
import { Role } from "@bridgeed/shared";
import type {
  AuthScope,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginSessionResponse,
  RegisterEmailRequest,
  RequestOtpRequest,
  RequestOtpResponse,
  VerifyOtpRequest
} from "@bridgeed/shared";

import { env } from "../../config/env";
import { SchoolModel } from "../../models/school.model";
import { UserModel } from "../../models/user.model";
import { AppError } from "../../utils/app-error";
import { createAccessToken } from "../../utils/jwt";
import { hashPassword, verifyPassword } from "../../utils/password";
import { createUuidV7 } from "../../utils/uuid";
import { logAuditEvent, toAuditActor } from "../audit/audit.service";

type OtpRecord = {
  phoneNumber: string;
  otp: string;
  expiresAt: number;
};

type PasswordResetRecord = {
  token: string;
  expiresAt: number;
};

type SessionUser = LoginSessionResponse["user"];

const otpRecords = new Map<string, OtpRecord>();
const passwordResetRecords = new Map<string, PasswordResetRecord>();

const createToken = (): string => crypto.randomBytes(32).toString("hex");
const createOtpCode = (): string => `${Math.floor(100000 + Math.random() * 900000)}`;
const normalizeEmail = (email: string): string => email.trim().toLowerCase();
const normalizeSchoolId = (schoolId: string): string => schoolId.trim();

const isStrongPassword = (password: string): boolean =>
  password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);

const normalizeScope = (scope?: AuthScope): AuthScope | undefined => {
  if (!scope) {
    return undefined;
  }

  const normalizedScope: AuthScope = {};
  if (scope.schoolId) {
    normalizedScope.schoolId = scope.schoolId;
  }
  if (scope.districtId) {
    normalizedScope.districtId = scope.districtId;
  }
  if (scope.region) {
    normalizedScope.region = scope.region;
  }

  return Object.keys(normalizedScope).length > 0 ? normalizedScope : undefined;
};

const mapUserToSessionUser = (user: {
  userId: string;
  role: Role;
  name: string;
  scope?: AuthScope;
}): SessionUser => ({
  id: user.userId,
  role: user.role,
  name: user.name,
  scope: normalizeScope(user.scope)
});

const createSession = (user: SessionUser): LoginSessionResponse => {
  const expiresAt = new Date(Date.now() + env.AUTH_SESSION_TTL_MINUTES * 60_000).toISOString();
  return {
    accessToken: createAccessToken({
      userId: user.id,
      role: user.role,
      name: user.name,
      scope: user.scope,
      ttlMinutes: env.AUTH_SESSION_TTL_MINUTES
    }),
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

const invalidCredentialsErrorDetails = {
  attemptsRemaining: env.AUTH_MAX_LOGIN_ATTEMPTS - 1,
  maxAttempts: env.AUTH_MAX_LOGIN_ATTEMPTS,
  isLockedOut: false
};

const isMongoDuplicateError = (error: unknown): boolean =>
  typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 11000;

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

    const user: SessionUser = {
      id: `teacher-${payload.phoneNumber.slice(-6)}`,
      role: Role.Teacher,
      name: "BridgeEd Teacher",
      scope: {
        schoolId: "school-demo-001",
        districtId: "district-demo-001",
        region: "Greater Accra"
      }
    };

    logAuditEvent({
      action: "auth.otp.verify",
      actor: toAuditActor(payload.phoneNumber, "phone"),
      entity: "session",
      result: "success"
    });

    return createSession(user);
  },

  async registerWithEmail(payload: RegisterEmailRequest): Promise<LoginSessionResponse> {
    const normalizedEmail = normalizeEmail(payload.email);
    const normalizedSchoolId = normalizeSchoolId(payload.schoolId);

    if (!isStrongPassword(payload.password)) {
      throw new AppError(
        400,
        "WEAK_PASSWORD",
        "Password must be at least 8 characters and include uppercase, lowercase, and numeric characters."
      );
    }

    const school = await SchoolModel.findOne({ schoolId: normalizedSchoolId }).exec();
    if (!school) {
      throw new AppError(400, "INVALID_SCHOOL_IDENTIFIER", "School identifier is invalid.");
    }

    if (!school.isActive) {
      throw new AppError(
        400,
        "INVALID_SCHOOL_IDENTIFIER",
        "School identifier is inactive. Contact your administrator."
      );
    }

    const existingAccount = await UserModel.exists({ email: normalizedEmail });
    if (existingAccount) {
      throw new AppError(409, "EMAIL_ALREADY_REGISTERED", "Email is already registered.");
    }

    try {
      const createdAccount = await UserModel.create({
        userId: createUuidV7(),
        name: payload.name.trim(),
        email: normalizedEmail,
        passwordHash: await hashPassword(payload.password),
        failedLoginAttempts: 0,
        lockedUntilMs: null,
        role: Role.Teacher,
        scope: {
          schoolId: school.schoolId
        }
      });

      logAuditEvent({
        action: "auth.email.register",
        actor: toAuditActor(normalizedEmail, "email"),
        entity: "user",
        entityId: createdAccount.userId,
        result: "success",
        metadata: {
          role: createdAccount.role
        }
      });

      return createSession(mapUserToSessionUser(createdAccount));
    } catch (error) {
      if (isMongoDuplicateError(error)) {
        throw new AppError(409, "EMAIL_ALREADY_REGISTERED", "Email is already registered.");
      }

      throw error;
    }
  },

  async loginWithEmail(email: string, password: string): Promise<LoginSessionResponse> {
    const normalizedEmail = normalizeEmail(email);
    const account = await UserModel.findOne({ email: normalizedEmail }).exec();

    if (!account || !account.passwordHash) {
      logAuditEvent({
        action: "auth.email.login",
        actor: toAuditActor(normalizedEmail, "email"),
        entity: "session",
        result: "failure"
      });
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.", invalidCredentialsErrorDetails);
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

    const passwordMatches = await verifyPassword(password, account.passwordHash);
    if (!passwordMatches) {
      account.failedLoginAttempts += 1;

      const attemptsRemaining = Math.max(0, env.AUTH_MAX_LOGIN_ATTEMPTS - account.failedLoginAttempts);
      const shouldLock = account.failedLoginAttempts >= env.AUTH_MAX_LOGIN_ATTEMPTS;

      if (shouldLock) {
        account.lockedUntilMs = Date.now() + env.AUTH_LOCKOUT_MINUTES * 60_000;
      }

      await account.save();

      if (shouldLock) {
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

    account.failedLoginAttempts = 0;
    account.lockedUntilMs = null;
    await account.save();

    logAuditEvent({
      action: "auth.email.login",
      actor: toAuditActor(normalizedEmail, "email"),
      entity: "session",
      result: "success"
    });

    return createSession(mapUserToSessionUser(account));
  },

  async requestPasswordReset(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    clearExpiredPasswordResetRecords();

    const normalizedEmail = normalizeEmail(payload.email);
    const accountExists = Boolean(await UserModel.exists({ email: normalizedEmail, passwordHash: { $exists: true } }));
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
