import { Role, type AuthUser } from "@bridgeed/shared";

const ROLE_HOME_PATHS: Partial<Record<Role, string>> = {
  [Role.Teacher]: "/dashboard/teacher",
  [Role.SchoolAdmin]: "/dashboard/school-admin",
  [Role.NationalAdmin]: "/dashboard/national-admin"
};

const dedupeRoles = (roles: Role[]): Role[] => Array.from(new Set(roles));

export const getUserRoles = (user: Pick<AuthUser, "role" | "roles">): Role[] => {
  const extraRoles = Array.isArray(user.roles) ? user.roles : [];
  return dedupeRoles([user.role, ...extraRoles]);
};

export const getRoleHomePath = (role: Role): string | null => ROLE_HOME_PATHS[role] ?? null;

export const getPostLoginPath = (user: Pick<AuthUser, "role" | "roles">): string => {
  const userRoles = getUserRoles(user);
  if (userRoles.length > 1) {
    return "/role-selection";
  }

  const primaryRole = userRoles[0];
  if (!primaryRole) {
    return "/role-selection";
  }

  return getRoleHomePath(primaryRole) ?? "/role-selection";
};

export const hasAnyAllowedRole = (
  user: Pick<AuthUser, "role" | "roles">,
  allowedRoles: Role[]
): boolean => {
  const userRoles = getUserRoles(user);
  return userRoles.some((userRole) => allowedRoles.includes(userRole));
};
