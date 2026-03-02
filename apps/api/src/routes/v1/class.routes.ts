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

router.use(requireAuth);
router.use(requireRoles(Role.Teacher));

router.post("/classes", createClassController);
router.get("/classes", listClassesController);
router.patch("/classes/:classId", updateClassController);
router.get("/classes/:classId/learners", listClassLearnersController);

export default router;
