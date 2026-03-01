import { Router } from "express";

import authRoutes from "./auth.routes";
import systemRoutes from "./system.routes";

const router = Router();

router.use(authRoutes);
router.use(systemRoutes);

export default router;
