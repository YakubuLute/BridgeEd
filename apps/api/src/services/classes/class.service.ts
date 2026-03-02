import type { ClassRecord, CreateClassRequest, UpdateClassRequest } from "@bridgeed/shared";

import { ClassModel } from "../../models/class.model";
import type { AuthContext } from "../../types/auth";
import { AppError } from "../../utils/app-error";
import { createUuidV7 } from "../../utils/uuid";
import { recordAuditLog } from "../audit/audit-log.service";

const mapClassRecord = (value: {
  _id: { toString(): string };
  classId: string;
  schoolId: string;
  teacherId: string;
  name: string;
  gradeLevel: ClassRecord["gradeLevel"];
  subject?: string;
  academicYear?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ClassRecord => ({
  id: value._id.toString(),
  classId: value.classId,
  schoolId: value.schoolId,
  teacherId: value.teacherId,
  name: value.name,
  gradeLevel: value.gradeLevel,
  subject: value.subject,
  academicYear: value.academicYear,
  isActive: value.isActive,
  createdAt: value.createdAt.toISOString(),
  updatedAt: value.updatedAt.toISOString()
});

const getTeacherSchoolId = (auth: AuthContext): string => {
  const schoolId = auth.scope?.schoolId;
  if (!schoolId) {
    throw new AppError(403, "SCOPE_REQUIRED", "Teacher school scope is required for this action.");
  }

  return schoolId;
};

const isMongoDuplicateError = (error: unknown): boolean =>
  typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 11000;

export const classService = {
  async createClass(auth: AuthContext, payload: CreateClassRequest): Promise<ClassRecord> {
    const schoolId = getTeacherSchoolId(auth);

    try {
      const created = await ClassModel.create({
        classId: createUuidV7(),
        schoolId,
        teacherId: auth.userId,
        name: payload.name,
        gradeLevel: payload.gradeLevel,
        subject: payload.subject,
        academicYear: payload.academicYear,
        isActive: true
      });

      await recordAuditLog({
        action: "class.create",
        actorId: auth.userId,
        actorRole: auth.role,
        entity: "class",
        entityId: created.classId,
        result: "success",
        metadata: {
          schoolId,
          gradeLevel: created.gradeLevel
        }
      });

      return mapClassRecord(created);
    } catch (error) {
      if (isMongoDuplicateError(error)) {
        throw new AppError(
          409,
          "CLASS_ALREADY_EXISTS",
          "A class with the same name, grade, and academic year already exists in this school."
        );
      }

      throw error;
    }
  },

  async listClasses(auth: AuthContext): Promise<ClassRecord[]> {
    const schoolId = getTeacherSchoolId(auth);
    const classes = await ClassModel.find({
      schoolId,
      teacherId: auth.userId
    })
      .sort({ createdAt: -1 })
      .exec();

    return classes.map((item) => mapClassRecord(item));
  },

  async updateClass(auth: AuthContext, classId: string, payload: UpdateClassRequest): Promise<ClassRecord> {
    const schoolId = getTeacherSchoolId(auth);

    const existing = await ClassModel.findOne({ classId }).exec();
    if (!existing) {
      throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found.");
    }

    if (existing.schoolId !== schoolId || existing.teacherId !== auth.userId) {
      throw new AppError(403, "FORBIDDEN", "You do not have access to this class.");
    }

    if (payload.name !== undefined) {
      existing.name = payload.name;
    }
    if (payload.gradeLevel !== undefined) {
      existing.gradeLevel = payload.gradeLevel;
    }
    if (payload.subject !== undefined) {
      existing.subject = payload.subject;
    }
    if (payload.academicYear !== undefined) {
      existing.academicYear = payload.academicYear;
    }
    if (payload.isActive !== undefined) {
      existing.isActive = payload.isActive;
    }

    try {
      const updated = await existing.save();

      await recordAuditLog({
        action: "class.update",
        actorId: auth.userId,
        actorRole: auth.role,
        entity: "class",
        entityId: updated.classId,
        result: "success",
        metadata: {
          schoolId: updated.schoolId
        }
      });

      return mapClassRecord(updated);
    } catch (error) {
      if (isMongoDuplicateError(error)) {
        throw new AppError(
          409,
          "CLASS_ALREADY_EXISTS",
          "A class with the same name, grade, and academic year already exists in this school."
        );
      }

      throw error;
    }
  }
};
