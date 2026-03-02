import { Router } from "express";
import { Role } from "@bridgeed/shared";

import {
  batchCreateLearnersController,
  createLearnerController,
  getLearnerProfileController
} from "../../controllers/learner.controller";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireRoles(Role.Teacher));

router.post("/learners", createLearnerController);
router.post("/learners/batch", batchCreateLearnersController);
router.get("/learners/:learnerId/profile", getLearnerProfileController);

export default router;
