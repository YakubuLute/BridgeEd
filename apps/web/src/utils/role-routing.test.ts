import { describe, expect, it } from "vitest";
import { Role } from "@bridgeed/shared";

import { getPostLoginPath, getUserRoles, hasAnyAllowedRole } from "./role-routing";

describe("role-routing utils", () => {
  it("returns direct dashboard path for single-role users", () => {
    const path = getPostLoginPath({
      role: Role.Teacher
    });

    expect(path).toBe("/dashboard/teacher");
  });

  it("returns role-selection path for multi-role users", () => {
    const path = getPostLoginPath({
      role: Role.Teacher,
      roles: [Role.Teacher, Role.SchoolAdmin]
    });

    expect(path).toBe("/role-selection");
  });

  it("normalizes and deduplicates roles", () => {
    const roles = getUserRoles({
      role: Role.Teacher,
      roles: [Role.Teacher, Role.SchoolAdmin]
    });

    expect(roles).toEqual([Role.Teacher, Role.SchoolAdmin]);
  });

  it("authorizes access if any assigned role matches", () => {
    const result = hasAnyAllowedRole(
      {
        role: Role.Teacher,
        roles: [Role.Teacher, Role.SchoolAdmin]
      },
      [Role.SchoolAdmin]
    );

    expect(result).toBe(true);
  });
});
