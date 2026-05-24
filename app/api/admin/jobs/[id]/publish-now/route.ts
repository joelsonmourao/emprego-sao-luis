import { AuditAction, JobScheduleSource } from "@prisma/client";
import { NextResponse } from "next/server";

import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { publishJobNow } from "@/lib/job-publication";

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
    const result = await publishJobNow(id, JobScheduleSource.MANUAL);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "job",
      entityId: result.job.id,
      entityLabel: result.job.title,
      summary: "Vaga publicada manualmente",
      after: {
        status: result.job.status,
        publishedAt: result.job.publishedAt,
        indexing: result.indexing
      }
    });

    return NextResponse.json({
      ok: true,
      published: true,
      indexing: result.indexing
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao publicar vaga agora.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
