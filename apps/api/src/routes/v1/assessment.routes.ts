import { Router } from "express";
import { 
  Role, 
  GenerateScreenerRequestSchema, 
  CreateAssessmentRequestSchema,
  SubmitAssessmentResultsRequestSchema 
} from "@bridgeed/shared";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import { successResponse, errorResponse } from "../../utils/api-response";
import { GeminiService } from "../../services/gemini/gemini.service";
import { AssessmentModel } from "../../models/assessment.model";
import { AttemptModel } from "../../models/attempt.model";
import { DiagnosticResultModel } from "../../models/diagnostic-result.model";
import { createUuidV7 } from "../../utils/uuid";
import { getAuthContext } from "../../controllers/class.controller";

const router = Router();
const geminiService = new GeminiService();

router.post(
  "/assessments/generate",
  requireAuth,
  requireRoles(Role.Teacher, Role.SchoolAdmin, Role.NationalAdmin),
  async (req, res, next) => {
    try {
      const { subject, gradeLevel } = GenerateScreenerRequestSchema.parse(req.body);
      const generatedScreener = await geminiService.generateScreener(subject, gradeLevel);
      res.status(200).json(successResponse(generatedScreener));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/assessments",
  requireAuth,
  requireRoles(Role.Teacher, Role.SchoolAdmin),
  async (req, res, next) => {
    try {
      const auth = getAuthContext(req.auth);
      const data = CreateAssessmentRequestSchema.parse(req.body);

      const assessment = await AssessmentModel.create({
        ...data,
        assessmentId: createUuidV7(),
        teacherId: auth.userId
      });

      res.status(201).json(successResponse(assessment.toJSON()));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/assessments/:assessmentId",
  requireAuth,
  async (req, res, next) => {
    try {
      const assessment = await AssessmentModel.findOne({ assessmentId: req.params.assessmentId }).exec();
      if (!assessment) {
        return res.status(404).json(errorResponse("Assessment not found", "NOT_FOUND"));
      }
      res.status(200).json(successResponse(assessment.toJSON()));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/assessments/:assessmentId/results",
  requireAuth,
  requireRoles(Role.Teacher, Role.SchoolAdmin),
  async (req, res, next) => {
    try {
      const { results, classId } = SubmitAssessmentResultsRequestSchema.parse(req.body);
      const assessment = await AssessmentModel.findOne({ assessmentId: req.params.assessmentId }).exec();
      
      if (!assessment) {
        return res.status(404).json(errorResponse("Assessment not found", "NOT_FOUND"));
      }

      const assessedAt = new Date();
      const savedAttempts = [];

      for (const learnerResult of results) {
        const attemptId = createUuidV7();
        const correctCount = learnerResult.scores.filter(s => s.isCorrect).length;
        const totalCount = learnerResult.scores.length;
        const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

        // 1. Create Attempt
        const attempt = await AttemptModel.create({
          attemptId,
          learnerId: learnerResult.learnerId,
          classId,
          assessmentName: assessment.title,
          domain: assessment.subject,
          score,
          assessedAt
        });

        // 2. Create Diagnostic Results per skill tag
        const skillScores = new Map<string, { total: number, count: number }>();
        learnerResult.scores.forEach(s => {
          const tag = s.skillTag || "General";
          const current = skillScores.get(tag) || { total: 0, count: 0 };
          skillScores.set(tag, { 
            total: current.total + (s.isCorrect ? 100 : 0), 
            count: current.count + 1 
          });
        });

        for (const [skillName, data] of skillScores.entries()) {
          await DiagnosticResultModel.create({
            diagnosticResultId: createUuidV7(),
            learnerId: learnerResult.learnerId,
            attemptId,
            skillCode: skillName.toLowerCase().replace(/\s+/g, "_"),
            skillName,
            masteryScore: Math.round(data.total / data.count),
            measuredAt: assessedAt
          });
        }

        savedAttempts.push(attempt.toJSON());
      }

      res.status(201).json(successResponse({ attempts: savedAttempts }));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
