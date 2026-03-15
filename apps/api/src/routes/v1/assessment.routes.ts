import { Router } from "express";
import { Role, GenerateScreenerRequestSchema } from "@bridgeed/shared";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";
import { successResponse } from "../../utils/api-response";
import { GeminiService } from "../../services/gemini/gemini.service";

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

export default router;
