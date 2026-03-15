import { Router } from "express";

import authRoutes from "./auth.routes";
import activityRoutes from "./activity.routes";
import reportRoutes from "./report.routes";
import userRoutes from "./user.routes";
import classRoutes from "./class.routes";
import learnerRoutes from "./learner.routes";
import schoolRoutes from "./school.routes";
import systemRoutes from "./system.routes";
import assessmentRoutes from "./assessment.routes";

const router = Router();

router.use(authRoutes);
router.use(activityRoutes);
router.use(reportRoutes);
router.use(userRoutes);
router.use(systemRoutes);
router.use(classRoutes);
router.use(learnerRoutes);
router.use(schoolRoutes);
router.use(assessmentRoutes);

export default router;
