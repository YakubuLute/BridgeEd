import { Router } from "express";

import systemRoutes from "./system.routes";

const router = Router();

router.use(systemRoutes);

export default router;
