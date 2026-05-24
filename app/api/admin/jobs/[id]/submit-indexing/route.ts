import { AuditAction, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { submitPublishedJobToIndexing } from "@/lib/job-publication";

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
    const job = await prisma.job.findUnique({
      where: { id },
      select: { id: true, status: true, title: true }
    });

    if (!job) {
      return NextResponse.json({ ok: false, error: "Vaga nao encontrada." }, { status: 404 });
    }

    if (job.status !== JobStatus.PUBLISHED) {
      return NextResponse.json(
        { ok: false, error: "Somente vagas publicadas podem ser enviadas para indexacao." },
        { status: 400 }
      );
    }

    const result = await submitPublishedJobToIndexing(id);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "job",
      entityId: id,
      entityLabel: job.title,
      summary: "Reenvio para Google Indexing API",
      after: result
    });

    return NextResponse.json(result, { status: result.ok ? 200 : 207 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao enviar URL para indexacao.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
