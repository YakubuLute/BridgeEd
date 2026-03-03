import { Router } from "express";
import { Role } from "@bridgeed/shared";

import {
  createClassController,
  getClassAssessmentOverviewController,
  listClassLearnersController,
  listClassesController,
  updateClassController
} from "../../controllers/class.controller";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/classes", requireAuth, requireRoles(Role.Teacher), createClassController);
router.get("/classes", requireAuth, requireRoles(Role.Teacher), listClassesController);
router.patch("/classes/:classId", requireAuth, requireRoles(Role.Teacher), updateClassController);
router.get("/classes/:classId/learners", requireAuth, requireRoles(Role.Teacher), listClassLearnersController);
router.get(
  "/classes/:classId/assessment-overview",
  requireAuth,
  requireRoles(Role.Teacher),
  getClassAssessmentOverviewController
);

export default router;
