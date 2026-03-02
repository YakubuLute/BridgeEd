import { Role } from "@bridgeed/shared";

import { AuditLogModel } from "../../models/audit-log.model";

export const recordAuditLog = async ({
  action,
  actorId,
  actorRole,
  entity,
  entityId,
  result,
  metadata
}: {
  action: string;
  actorId: string;
  actorRole: Role;
  entity: string;
  entityId?: string;
  result: "success" | "failure";
  metadata?: Record<string, unknown>;
}): Promise<void> => {
  await AuditLogModel.create({
    action,
    actorId,
    actorRole,
    entity,
    entityId,
    result,
    metadata,
    occurredAt: new Date()
  });
};
