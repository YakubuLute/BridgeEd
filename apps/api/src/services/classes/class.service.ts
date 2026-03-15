import type {
  AssessmentStatus,
  ClassAssessmentOverviewResponse,
  ClassRecord,
  CreateClassRequest,
  UpdateClassRequest
} from "@bridgeed/shared";

import { AttemptModel } from "../../models/attempt.model";
import { ClassModel } from "../../models/class.model";
import { DiagnosticResultModel } from "../../models/diagnostic-result.model";
import { LearnerModel } from "../../models/learner.model";
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

const literacyTokens = [
  "literacy",
  "phonics",
  "decoding",
  "reading",
  "fluency",
  "vocabulary",
  "comprehension"
];

const numeracyTokens = [
  "numeracy",
  "number",
  "counting",
  "addition",
  "subtraction",
  "multiplication",
  "fractions",
  "geometry",
  "algebra",
  "operations"
];

const includesAnyToken = (source: string, tokens: string[]): boolean =>
  tokens.some((token) => source.includes(token));

const inferDomain = (skillCode: string, skillName: string): "literacy" | "numeracy" | null => {
  const normalized = `${skillCode} ${skillName}`.toLowerCase();

  if (includesAnyToken(normalized, literacyTokens)) {
    return "literacy";
  }

  if (includesAnyToken(normalized, numeracyTokens)) {
    return "numeracy";
  }

  return null;
};

const averageScore = (scores: number[]): number | null => {
  if (scores.length === 0) {
    return null;
  }

  const total = scores.reduce((sum, score) => sum + score, 0);
  return Math.round(total / scores.length);
};

const getStatusFromScores = (literacyScore: number | null, numeracyScore: number | null): AssessmentStatus => {
  const availableScores = [literacyScore, numeracyScore].filter(
    (score): score is number => typeof score === "number"
  );
  if (availableScores.length === 0) {
    return "support";
  }

  const overall = availableScores.reduce((sum, score) => sum + score, 0) / availableScores.length;
  if (overall < 55) {
    return "at_risk";
  }

  if (overall < 70) {
    return "support";
  }

  return "on_track";
};

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
  },

  async getClassAssessmentOverview(
    auth: AuthContext,
    classId: string
  ): Promise<ClassAssessmentOverviewResponse> {
    const schoolId = getTeacherSchoolId(auth);
    const classRecord = await ClassModel.findOne({ classId }).exec();
    if (!classRecord) {
      throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found.");
    }

    if (classRecord.schoolId !== schoolId || classRecord.teacherId !== auth.userId) {
      throw new AppError(403, "FORBIDDEN", "You do not have access to this class.");
    }

    const learners = await LearnerModel.find({
      classId: classRecord.classId,
      schoolId: classRecord.schoolId
    })
      .sort({ name: 1 })
      .exec();

    if (learners.length === 0) {
      return {
        class: {
          classId: classRecord.classId,
          name: classRecord.name,
          subject: classRecord.subject,
          gradeLevel: classRecord.gradeLevel
        },
        summary: {
          atRisk: 0,
          support: 0,
          onTrack: 0,
          totalStudents: 0
        },
        learners: []
      };
    }

    const learnerIds = learners.map((learner) => learner.learnerId);
    const [attempts, diagnostics] = await Promise.all([
      AttemptModel.find({
        classId: classRecord.classId,
        learnerId: { $in: learnerIds }
      })
        .sort({ assessedAt: -1 })
        .exec(),
      DiagnosticResultModel.find({
        learnerId: { $in: learnerIds }
      })
        .sort({ measuredAt: -1 })
        .exec()
    ]);

    const latestAssessedAtByLearner = new Map<string, Date>();
    for (const attempt of attempts) {
      if (!latestAssessedAtByLearner.has(attempt.learnerId)) {
        latestAssessedAtByLearner.set(attempt.learnerId, attempt.assessedAt);
      }
    }

    const scoresByLearner = new Map<
      string,
      {
        literacy: number[];
        numeracy: number[];
      }
    >();

    for (const learner of learners) {
      scoresByLearner.set(learner.learnerId, {
        literacy: [],
        numeracy: []
      });
    }

    for (const diagnostic of diagnostics) {
      const domain = inferDomain(diagnostic.skillCode, diagnostic.skillName);
      if (!domain) {
        continue;
      }

      const learnerScores = scoresByLearner.get(diagnostic.learnerId);
      if (!learnerScores) {
        continue;
      }

      const domainScores = learnerScores[domain];
      if (domainScores.length >= 3) {
        continue;
      }

      domainScores.push(diagnostic.masteryScore);
    }

    const learnerSnapshots: ClassAssessmentOverviewResponse["learners"] = learners.map((learner) => {
      const scores = scoresByLearner.get(learner.learnerId) ?? { literacy: [], numeracy: [] };
      const literacyScore = averageScore(scores.literacy);
      const numeracyScore = averageScore(scores.numeracy);

      return {
        learnerId: learner.learnerId,
        name: learner.name,
        gradeLevel: learner.gradeLevel,
        status: getStatusFromScores(literacyScore, numeracyScore),
        literacyScore,
        numeracyScore,
        lastAssessedAt: latestAssessedAtByLearner.get(learner.learnerId)?.toISOString() ?? null
      };
    });

    const summary = learnerSnapshots.reduce(
      (accumulator, learner) => {
        if (learner.status === "at_risk") {
          accumulator.atRisk += 1;
        } else if (learner.status === "support") {
          accumulator.support += 1;
        } else {
          accumulator.onTrack += 1;
        }

        return accumulator;
      },
      {
        atRisk: 0,
        support: 0,
        onTrack: 0
      }
    );

    return {
      class: {
        classId: classRecord.classId,
        name: classRecord.name,
        subject: classRecord.subject,
        gradeLevel: classRecord.gradeLevel
      },
      summary: {
        ...summary,
        totalStudents: learnerSnapshots.length
      },
      learners: learnerSnapshots
    };
  },

  async getClassAssessmentHistory(auth: AuthContext, classId: string) {
    const schoolId = getTeacherSchoolId(auth);
    const classRecord = await ClassModel.findOne({ classId }).exec();
    if (!classRecord) {
      throw new AppError(404, "CLASS_NOT_FOUND", "Class was not found.");
    }

    if (classRecord.schoolId !== schoolId || classRecord.teacherId !== auth.userId) {
      throw new AppError(403, "FORBIDDEN", "You do not have access to this class.");
    }

    const attempts = await AttemptModel.find({
      classId: classRecord.classId
    })
      .sort({ assessedAt: -1 })
      .limit(50)
      .exec();

    const learnerIds = attempts.map((a) => a.learnerId);
    const learners = await LearnerModel.find({
      learnerId: { $in: learnerIds }
    }).exec();

    const learnerNameMap = new Map(learners.map((l) => [l.learnerId, l.name]));

    return {
      attempts: attempts.map((a) => ({
        attemptId: a.attemptId,
        learnerId: a.learnerId,
        learnerName: learnerNameMap.get(a.learnerId) || "Unknown Learner",
        assessmentName: a.assessmentName,
        score: a.score,
        assessedAt: a.assessedAt.toISOString()
      }))
    };
  }
};
