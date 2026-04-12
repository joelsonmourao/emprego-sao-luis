import { AuditAction, Prisma, type AdminRole } from "@prisma/client";

import { prisma } from "@/lib/db";

function toAuditJson(value: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

export async function writeAuditLog(input: {
  actorId?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  actorRole?: AdminRole | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  entityLabel?: string | null;
  summary?: string | null;
  before?: unknown;
  after?: unknown;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? null,
      actorEmail: input.actorEmail ?? null,
      actorRole: input.actorRole ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      entityLabel: input.entityLabel ?? null,
      summary: input.summary ?? null,
      before: toAuditJson(input.before),
      after: toAuditJson(input.after)
    }
  });
}
