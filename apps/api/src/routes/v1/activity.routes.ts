import { Router } from "express";
import { Role } from "@bridgeed/shared";
import { AuditLogModel } from "../../models/audit-log.model";
import { requireAuth } from "../../middlewares/auth.middleware";
import { successResponse } from "../../utils/api-response";
import { getAuthContext } from "../../controllers/class.controller";

const router = Router();

router.get("/activity", requireAuth, async (req, res, next) => {
  try {
    const auth = getAuthContext(req.auth);
    
    // Fetch recent audit logs for this user
    const logs = await AuditLogModel.find({ actorId: auth.userId })
      .sort({ occurredAt: -1 })
      .limit(30)
      .exec();

    res.status(200).json(successResponse({
      activities: logs.map(log => ({
        id: log._id.toString(),
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        result: log.result,
        metadata: log.metadata,
        occurredAt: log.occurredAt.toISOString()
      }))
    }));
  } catch (error) {
    next(error);
  }
});

export default router;
