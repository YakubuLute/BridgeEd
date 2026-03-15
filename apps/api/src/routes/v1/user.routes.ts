import { Router } from "express";
import { UpdateProfileRequestSchema, UserProfileSchema } from "@bridgeed/shared";
import { requireAuth } from "../../middlewares/auth.middleware";
import { successResponse } from "../../utils/api-response";
import { getAuthContext } from "../../controllers/class.controller";
import { UserModel } from "../../models/user.model";
import { AppError } from "../../utils/app-error";

const router = Router();

router.get("/profile", requireAuth, async (req, res, next) => {
  try {
    const auth = getAuthContext(req.auth);
    const user = await UserModel.findOne({ userId: auth.userId }).exec();
    
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User profile not found.");
    }

    res.status(200).json(successResponse({
      userId: user.userId,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      scope: user.scope
    }));
  } catch (error) {
    next(error);
  }
});

router.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const auth = getAuthContext(req.auth);
    const payload = UpdateProfileRequestSchema.parse(req.body);
    
    const user = await UserModel.findOne({ userId: auth.userId }).exec();
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User profile not found.");
    }

    if (payload.name) user.name = payload.name;
    if (payload.email) user.email = payload.email;
    if (payload.phoneNumber) user.phoneNumber = payload.phoneNumber;

    await user.save();

    res.status(200).json(successResponse({
      userId: user.userId,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      scope: user.scope
    }));
  } catch (error) {
    next(error);
  }
});

export default router;
