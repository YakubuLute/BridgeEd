import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { successResponse, errorResponse } from "../../utils/api-response";
import { NotificationModel } from "../../models/notification.model";
import { getAuthContext } from "../../controllers/class.controller";

const router = Router();

router.get(
  "/notifications",
  requireAuth,
  async (req, res, next) => {
    try {
      const auth = getAuthContext(req.auth);
      const notifications = await NotificationModel.find({ userId: auth.userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();
      
      res.status(200).json(successResponse(notifications.map(n => n.toJSON())));
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/notifications/:notificationId/read",
  requireAuth,
  async (req, res, next) => {
    try {
      const auth = getAuthContext(req.auth);
      const notification = await NotificationModel.findOneAndUpdate(
        { notificationId: req.params.notificationId, userId: auth.userId },
        { isRead: true },
        { new: true }
      ).exec();

      if (!notification) {
        return res.status(404).json(errorResponse("Notification not found", "NOT_FOUND"));
      }

      res.status(200).json(successResponse(notification.toJSON()));
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/notifications/read-all",
  requireAuth,
  async (req, res, next) => {
    try {
      const auth = getAuthContext(req.auth);
      await NotificationModel.updateMany(
        { userId: auth.userId, isRead: false },
        { isRead: true }
      ).exec();

      res.status(200).json(successResponse({ success: true }));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
