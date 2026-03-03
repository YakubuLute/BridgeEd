import { Router } from "express";

import authRoutes from "./auth.routes";
import classRoutes from "./class.routes";
import learnerRoutes from "./learner.routes";
import schoolRoutes from "./school.routes";
import systemRoutes from "./system.routes";

const router = Router();

router.use(authRoutes);
router.use(systemRoutes);
router.use(classRoutes);
router.use(learnerRoutes);
router.use(schoolRoutes);

export default router;
