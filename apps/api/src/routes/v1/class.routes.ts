import { Router } from "express";
import { Role } from "@bridgeed/shared";

import {
  createClassController,
  getClassAssessmentHistoryController,
  getClassAssessmentOverviewController,
  getClassByIdController,
  listClassLearnersController,
  listClassesController,
  updateClassController
} from "../../controllers/class.controller";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/classes", requireAuth, requireRoles(Role.Teacher), createClassController);
router.get("/classes", requireAuth, requireRoles(Role.Teacher), listClassesController);
router.get("/classes/:classId", requireAuth, requireRoles(Role.Teacher), getClassByIdController);
router.patch("/classes/:classId", requireAuth, requireRoles(Role.Teacher), updateClassController);
router.get("/classes/:classId/learners", requireAuth, requireRoles(Role.Teacher), listClassLearnersController);
router.get(
  "/classes/:classId/assessment-overview",
  requireAuth,
  requireRoles(Role.Teacher),
  getClassAssessmentOverviewController
);
router.get(
  "/classes/:classId/assessment-history",
  requireAuth,
  requireRoles(Role.Teacher),
  getClassAssessmentHistoryController
);

export default router;
