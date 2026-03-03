import { Router } from "express";
import { Role } from "@bridgeed/shared";

import {
  createClassController,
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

export default router;
