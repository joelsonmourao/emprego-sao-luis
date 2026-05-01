import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


import { deleteJob, upsertJobFromForm } from "@/lib/admin/jobs";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { revalidatePublicSurfacesForJob } from "@/lib/public-revalidate";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireApiRole("EDITOR");
    const { id } = await context.params;
    const payload = await request.json();
    const job = await upsertJobFromForm(payload, id);

    revalidatePublicSurfacesForJob({
      slug: job.slug,
      stateSlug: job.state.slug,
      citySlug: job.city.slug,
      companySlug: job.company?.slug ?? null,
      employmentType: job.employmentType
    });

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
    const job = await deleteJob(id);

    revalidatePublicSurfacesForJob({
      slug: job.slug,
      stateSlug: job.state.slug,
      citySlug: job.city.slug,
      companySlug: job.company?.slug ?? null,
      employmentType: job.employmentType
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.DELETE,
      entityType: "job",
      entityId: id,
      entityLabel: job.title,
      summary: "Vaga excluida",
      before: job
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel excluir a vaga.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
