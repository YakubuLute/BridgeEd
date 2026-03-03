import { Router } from "express";
import { Role } from "@bridgeed/shared";

import { getSchoolByIdController } from "../../controllers/school.controller";
import { requireAuth, requireRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/schools/:schoolId",
  requireAuth,
  requireRoles(Role.SchoolAdmin, Role.NationalAdmin),
  getSchoolByIdController
);

export default router;
