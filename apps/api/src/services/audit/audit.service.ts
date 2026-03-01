type AuditEvent = {
  action: string;
  actor: string;
  entity: string;
  entityId?: string;
  result: "success" | "failure";
  metadata?: Record<string, unknown>;
};

const maskEmail = (email: string): string => {
  const [localPart = "", domain = ""] = email.split("@");
  if (!localPart || !domain) {
    return "unknown";
  }

  if (localPart.length < 3) {
    return `***@${domain}`;
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
};

const maskPhone = (phoneNumber: string): string => {
  if (phoneNumber.length < 7) {
    return "***";
  }

  return `${phoneNumber.slice(0, 4)}***${phoneNumber.slice(-2)}`;
};

export const toAuditActor = (value: string, type: "email" | "phone"): string =>
  type === "email" ? maskEmail(value) : maskPhone(value);

export const logAuditEvent = (event: AuditEvent): void => {
  console.info("[audit]", {
    ts: new Date().toISOString(),
    action: event.action,
    actor: event.actor,
    entity: event.entity,
    entityId: event.entityId,
    result: event.result,
    metadata: event.metadata
  });
};
