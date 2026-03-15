import { model, Schema } from "mongoose";

type NotificationDocument = {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  metadata?: Record<string, any>;
};

const NotificationSchema = new Schema<NotificationDocument>(
  {
    notificationId: { type: String, required: true, unique: true, trim: true, index: true },
    userId: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ["info", "success", "warning", "error"], default: "info" },
    isRead: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const NotificationModel = model<NotificationDocument>(
  "Notification",
  NotificationSchema
);
