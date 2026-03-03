import { Role, type SchoolRecord } from "@bridgeed/shared";

import { SchoolModel } from "../../models/school.model";
import type { AuthContext } from "../../types/auth";
import { AppError } from "../../utils/app-error";

const mapSchoolRecord = (value: {
  _id: { toString(): string };
  schoolId: string;
  name: string;
  district: string;
  region: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SchoolRecord => ({
  id: value._id.toString(),
  schoolId: value.schoolId,
  name: value.name,
  district: value.district,
  region: value.region,
  isActive: value.isActive,
  createdAt: value.createdAt.toISOString(),
  updatedAt: value.updatedAt.toISOString()
});

const resolveAccessibleSchoolId = (auth: AuthContext, requestedSchoolId: string): string => {
  if (auth.role === Role.NationalAdmin) {
    return requestedSchoolId;
  }

  if (auth.role === Role.SchoolAdmin) {
    const scopedSchoolId = auth.scope?.schoolId;
    if (!scopedSchoolId) {
      throw new AppError(403, "SCOPE_REQUIRED", "School admin scope is required for this action.");
    }

    if (scopedSchoolId !== requestedSchoolId) {
      throw new AppError(403, "FORBIDDEN", "You do not have access to this school.");
    }

    return scopedSchoolId;
  }

  throw new AppError(403, "FORBIDDEN", "You do not have permission to perform this action.");
};

export const schoolService = {
  async getSchoolById(auth: AuthContext, schoolId: string): Promise<SchoolRecord> {
    const accessibleSchoolId = resolveAccessibleSchoolId(auth, schoolId.trim());
    const school = await SchoolModel.findOne({ schoolId: accessibleSchoolId }).exec();

    if (!school) {
      throw new AppError(404, "SCHOOL_NOT_FOUND", "School was not found.");
    }

    return mapSchoolRecord(school);
  }
};
