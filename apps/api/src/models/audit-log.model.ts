import { model, Schema } from "mongoose";
import { Role } from "@bridgeed/shared";

type AuditLogDocument = {
  action: string;
  actorId: string;
  actorRole: Role;
  entity: string;
  entityId?: string;
  result: "success" | "failure";
  metadata?: Record<string, unknown>;
  occurredAt: Date;
};

const AuditLogSchema = new Schema<AuditLogDocument>(
  {
    action: { type: String, required: true, trim: true, index: true },
    actorId: { type: String, required: true, trim: true, index: true },
    actorRole: { type: String, required: true, enum: Object.values(Role), index: true },
    entity: { type: String, required: true, trim: true },
    entityId: { type: String, trim: true },
    result: { type: String, required: true, enum: ["success", "failure"], index: true },
    metadata: { type: Schema.Types.Mixed, default: undefined },
    occurredAt: { type: Date, required: true, index: true }
  },
  {
    timestamps: true
  }
);

AuditLogSchema.index({ actorId: 1, occurredAt: -1 });

export const AuditLogModel = model<AuditLogDocument>("AuditLog", AuditLogSchema);
