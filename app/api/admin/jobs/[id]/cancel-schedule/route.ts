import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { cancelScheduledPublication } from "@/lib/job-publication";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: Context) {
  try {
    const session = await requireApiRole("EDITOR");
    const { id } = await context.params;
    const job = await cancelScheduledPublication(id);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "job",
      entityId: job.id,
      entityLabel: job.title,
      summary: "Agendamento cancelado",
      after: { status: job.status, scheduledAt: job.scheduledAt }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao cancelar agendamento.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
