import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { notifyGoogleIndexing } from "@/lib/google-indexing";
import { revalidatePublicSurfacesForJob } from "@/lib/public-revalidate";
import { getSiteUrl } from "@/lib/site-url";

const schema = z.object({
  isActive: z.boolean()
});

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireApiRole("EDITOR");
    const { id } = await context.params;
    const body = schema.parse(await request.json());

    const updated = await prisma.job.update({
      where: { id },
      data: { isActive: body.isActive },
      select: {
        id: true,
        title: true,
        slug: true,
        employmentType: true,
        state: { select: { slug: true } },
        city: { select: { slug: true } },
        company: { select: { slug: true } }
      }
    });

    const publicUrl = getSiteUrl(`/vagas/${updated.slug}`);
    const indexingResult = await notifyGoogleIndexing(publicUrl, body.isActive ? "URL_UPDATED" : "URL_DELETED");

    await prisma.job.update({
      where: { id: updated.id },
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
      slug: updated.slug,
      stateSlug: updated.state.slug,
      citySlug: updated.city.slug,
      companySlug: updated.company?.slug ?? null,
      employmentType: updated.employmentType
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "job",
      entityId: updated.id,
      entityLabel: updated.title,
      summary: body.isActive ? "Vaga ativada" : "Vaga desativada",
      after: { isActive: body.isActive }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel alterar o status.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
