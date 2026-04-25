import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { upsertJobFromForm } from "@/lib/admin/jobs";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { notifyGoogleIndexing } from "@/lib/google-indexing";
import { revalidatePublicSurfacesForJob } from "@/lib/public-revalidate";
import { getSiteUrl } from "@/lib/site-url";

export async function POST(request: Request) {
  try {
    const session = await requireApiRole("EDITOR");
    const payload = await request.json();
    const job = await upsertJobFromForm(payload);
    const publicUrl = getSiteUrl(`/vagas/${job.slug}`);
    const indexingResult = await notifyGoogleIndexing(publicUrl, "URL_UPDATED");

    await prisma.job.update({
      where: { id: job.id },
      data: indexingResult.ok
        ? {
            googleIndexingStatus: "OK",
            googleIndexingMessage: indexingResult.message,
            googleIndexedAt: new Date(),
            publishedPublicUrl: publicUrl
          }
        : {
            googleIndexingStatus: "ERRO",
            googleIndexingMessage: indexingResult.message,
            publishedPublicUrl: publicUrl
          }
    });

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
      action: AuditAction.CREATE,
      entityType: "job",
      entityId: job.id,
      entityLabel: job.title,
      summary: "Vaga criada",
      after: { id: job.id, slug: job.slug, title: job.title }
    });

    return NextResponse.json({ ok: true, jobId: job.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar a vaga.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function GET() {
  await requireApiRole("EDITOR");
  const jobs = await prisma.job.findMany({
    include: { city: true, state: true, company: true },
    orderBy: [{ updatedAt: "desc" }]
  });

  return NextResponse.json({ ok: true, jobs });
}
