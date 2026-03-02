import type {
  BatchCreateLearnersRequest,
  BatchCreateLearnersResponse,
  CreateLearnerRequest,
  LearnerRecord
} from "@bridgeed/shared";

import { ClassModel } from "../../models/class.model";
import { LearnerModel } from "../../models/learner.model";
import type { AuthContext } from "../../types/auth";
import { AppError } from "../../utils/app-error";
import { createUuidV7 } from "../../utils/uuid";
import { recordAuditLog } from "../audit/audit-log.service";

const mapLearnerRecord = (value: {
  _id: { toString(): string };
  learnerId: string;
  schoolId: string;
  classId: string;
  name: string;
  gradeLevel: LearnerRecord["gradeLevel"];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}): LearnerRecord => ({
  id: value._id.toString(),
  learnerId: value.learnerId,
  schoolId: value.schoolId,
  classId: value.classId,
  name: value.name,
  gradeLevel: value.gradeLevel,
  createdBy: value.createdBy,
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

const getAuthorizedClass = async (auth: AuthContext, classId: string) => {
  const schoolId = getTeacherSchoolId(auth);
  const classRecord = await ClassModel.findOne({ classId }).exec();
  if (!classRecord) {
    throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found.");
  }

  if (classRecord.schoolId !== schoolId || classRecord.teacherId !== auth.userId) {
    throw new AppError(403, "FORBIDDEN", "You do not have access to this class.");
  }

  return classRecord;
};

export const learnerService = {
  async createLearner(auth: AuthContext, payload: CreateLearnerRequest): Promise<LearnerRecord> {
    const classRecord = await getAuthorizedClass(auth, payload.classId);

    const created = await LearnerModel.create({
      learnerId: createUuidV7(),
      schoolId: classRecord.schoolId,
      classId: classRecord.classId,
      name: payload.name,
      gradeLevel: payload.gradeLevel,
      createdBy: auth.userId
    });

    await recordAuditLog({
      action: "learner.create",
      actorId: auth.userId,
      actorRole: auth.role,
      entity: "learner",
      entityId: created.learnerId,
      result: "success",
      metadata: {
        classId: created.classId
      }
    });

    return mapLearnerRecord(created);
  },

  async batchCreateLearners(
    auth: AuthContext,
    payload: BatchCreateLearnersRequest
  ): Promise<BatchCreateLearnersResponse> {
    const classRecord = await getAuthorizedClass(auth, payload.classId);

    const records = payload.rows.map((row) => ({
      learnerId: createUuidV7(),
      schoolId: classRecord.schoolId,
      classId: classRecord.classId,
      name: row.name,
      gradeLevel: row.gradeLevel,
      createdBy: auth.userId
    }));

    const created = await LearnerModel.insertMany(records, { ordered: true });

    await recordAuditLog({
      action: "learner.batch_create",
      actorId: auth.userId,
      actorRole: auth.role,
      entity: "learner",
      entityId: classRecord.classId,
      result: "success",
      metadata: {
        classId: classRecord.classId,
        createdCount: created.length
      }
    });

    return {
      createdCount: created.length,
      learners: created.map((item) => mapLearnerRecord(item))
    };
  },

  async listLearnersForClass(auth: AuthContext, classId: string): Promise<LearnerRecord[]> {
    const classRecord = await getAuthorizedClass(auth, classId);
    const learners = await LearnerModel.find({
      classId: classRecord.classId,
      schoolId: classRecord.schoolId
    })
      .sort({ name: 1 })
      .exec();

    return learners.map((item) => mapLearnerRecord(item));
  }
};
