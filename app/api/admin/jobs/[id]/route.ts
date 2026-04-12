import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { upsertJobFromForm } from "@/lib/admin/jobs";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireApiRole("EDITOR");
    const { id } = await context.params;
    const payload = await request.json();
    const job = await upsertJobFromForm(payload, id);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "job",
      entityId: job.id,
      entityLabel: job.title,
      summary: "Vaga atualizada",
      after: { id: job.id, slug: job.slug, title: job.title }
    });

    return NextResponse.json({ ok: true, jobId: job.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel atualizar a vaga.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await requireApiRole("ADMIN");
    const { id } = await context.params;
    const job = await prisma.job.findUnique({ where: { id }, select: { id: true, title: true, slug: true } });
    await prisma.job.delete({
      where: { id }
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.DELETE,
      entityType: "job",
      entityId: id,
      entityLabel: job?.title,
      summary: "Vaga excluida",
      before: job ?? { id }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel excluir a vaga.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
