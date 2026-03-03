import { Role, type AuthUser } from "@bridgeed/shared";

import { SESSION_STORAGE_KEY } from "../features/auth/auth.constants";

export type SessionState = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user: AuthUser;
  loginAt: string;
};

const isRole = (value: unknown): value is Role =>
  typeof value === "string" && Object.values(Role).includes(value as Role);

export const readSession = (): SessionState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SessionState> & {
      user?: {
        id?: unknown;
        role?: unknown;
        roles?: unknown;
        name?: unknown;
        scope?: unknown;
      };
    };

    if (
      typeof parsed.accessToken !== "string" ||
      !parsed.user ||
      typeof parsed.user.id !== "string" ||
      !isRole(parsed.user.role) ||
      (parsed.user.roles !== undefined &&
        (!Array.isArray(parsed.user.roles) || !parsed.user.roles.every((role) => isRole(role)))) ||
      typeof parsed.user.name !== "string"
    ) {
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      refreshToken: typeof parsed.refreshToken === "string" ? parsed.refreshToken : undefined,
      expiresAt: typeof parsed.expiresAt === "string" ? parsed.expiresAt : undefined,
      user: {
        id: parsed.user.id,
        role: parsed.user.role,
        roles: Array.isArray(parsed.user.roles)
          ? (parsed.user.roles.filter((role): role is Role => isRole(role)) as Role[])
          : undefined,
        name: parsed.user.name,
        scope:
          parsed.user.scope && typeof parsed.user.scope === "object"
            ? (parsed.user.scope as AuthUser["scope"])
            : undefined
      },
      loginAt: typeof parsed.loginAt === "string" ? parsed.loginAt : new Date().toISOString()
    };
  } catch {
    return null;
  }
};

export const clearSession = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
};
