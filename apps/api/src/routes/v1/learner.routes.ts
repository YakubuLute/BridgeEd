import { Router } from "express";
import { Role } from "@bridgeed/shared";

import {
  batchCreateLearnersController,
  createLearnerController,
  getLearnerProfileController
} from "../../controllers/learner.controller";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/learners", requireAuth, requireRoles(Role.Teacher), createLearnerController);
router.post("/learners/batch", requireAuth, requireRoles(Role.Teacher), batchCreateLearnersController);
router.get("/learners/:learnerId/profile", requireAuth, requireRoles(Role.Teacher), getLearnerProfileController);

export default router;
