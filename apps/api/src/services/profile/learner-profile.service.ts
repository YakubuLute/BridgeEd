import type { LearnerProfileResponse, SkillMasteryTrend } from "@bridgeed/shared";

import { AttemptModel } from "../../models/attempt.model";
import { ClassModel } from "../../models/class.model";
import { DiagnosticResultModel } from "../../models/diagnostic-result.model";
import { LearnerModel } from "../../models/learner.model";
import type { AuthContext } from "../../types/auth";
import { AppError } from "../../utils/app-error";

const getTeacherSchoolId = (auth: AuthContext): string => {
  const schoolId = auth.scope?.schoolId;
  if (!schoolId) {
    throw new AppError(403, "SCOPE_REQUIRED", "Teacher school scope is required for this action.");
  }

  return schoolId;
};

const toLearnerRecord = (value: {
  _id: { toString(): string };
  learnerId: string;
  schoolId: string;
  classId: string;
  name: string;
  gradeLevel: LearnerProfileResponse["learner"]["gradeLevel"];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}): LearnerProfileResponse["learner"] => ({
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

export const learnerProfileService = {
  async getLearnerProfile(auth: AuthContext, learnerId: string): Promise<LearnerProfileResponse> {
    const schoolId = getTeacherSchoolId(auth);

    const learner = await LearnerModel.findOne({ learnerId }).exec();
    if (!learner) {
      throw new AppError(404, "LEARNER_NOT_FOUND", "Learner was not found.");
    }

    if (learner.schoolId !== schoolId) {
      throw new AppError(403, "FORBIDDEN", "You do not have access to this learner.");
    }

    const classRecord = await ClassModel.findOne({ classId: learner.classId }).exec();
    if (!classRecord || classRecord.teacherId !== auth.userId) {
      throw new AppError(403, "FORBIDDEN", "You do not have access to this learner.");
    }

    const [attempts, diagnostics] = await Promise.all([
      AttemptModel.find({ learnerId: learner.learnerId }).sort({ assessedAt: -1 }).exec(),
      DiagnosticResultModel.find({ learnerId: learner.learnerId }).sort({ measuredAt: 1 }).exec()
    ]);

    const masteryTrendBySkill = new Map<string, SkillMasteryTrend>();
    for (const diagnostic of diagnostics) {
      const skillKey = diagnostic.skillCode;
      const trend =
        masteryTrendBySkill.get(skillKey) ??
        ({
          skillCode: diagnostic.skillCode,
          skillName: diagnostic.skillName,
          points: []
        } satisfies SkillMasteryTrend);

      trend.points.push({
        measuredAt: diagnostic.measuredAt.toISOString(),
        masteryScore: diagnostic.masteryScore,
        confidence: diagnostic.confidence ?? null
      });
      masteryTrendBySkill.set(skillKey, trend);
    }

    return {
      learner: toLearnerRecord(learner),
      assessmentTimeline: attempts.map((attempt) => ({
        attemptId: attempt.attemptId,
        assessmentName: attempt.assessmentName,
        domain: attempt.domain,
        score: attempt.score ?? null,
        assessedAt: attempt.assessedAt.toISOString()
      })),
      masteryTrends: Array.from(masteryTrendBySkill.values())
    };
  }
};
