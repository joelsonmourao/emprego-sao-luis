import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";


import { AuditAction } from "@prisma/client";

import { normalizeSlug } from "@/lib/admin/content";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { SITEMAP_MANIFEST_CACHE_TAG } from "@/lib/public-revalidate";


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
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return NextResponse.json({ ok: false, error: "Vaga nao encontrada." }, { status: 404 });
    }

    const duplicated = await prisma.job.create({
      data: {
        title: `${job.title} (copia)`,
        slug: normalizeSlug(`${job.slug}-copia-${Date.now()}`),
        companyId: job.companyId,
        companyName: job.companyName,
        companyLogoUrl: job.companyLogoUrl,
        companyWebsiteUrl: job.companyWebsiteUrl,
        heroImageUrl: job.heroImageUrl,
        summary: job.summary,
        descriptionHtml: job.descriptionHtml,
        responsibilities: job.responsibilities ?? undefined,
        requirements: job.requirements ?? undefined,
        benefits: job.benefits ?? undefined,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        employmentType: job.employmentType,
        workHours: job.workHours,
        publishedAt: new Date(),
        expiresAt: job.expiresAt,
        applyUrl: job.applyUrl,
        isActive: false,
        sourceName: job.sourceName,
        sourceUrl: job.sourceUrl,
        locationType: job.locationType,
        seoTitle: job.seoTitle,
        seoDescription: job.seoDescription,
        featured: false,
        stateId: job.stateId,
        cityId: job.cityId
      }
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.CREATE,
      entityType: "job",
      entityId: duplicated.id,
      entityLabel: duplicated.title,
      summary: `Duplicou a vaga ${job.title}.`,
      after: {
        sourceId: job.id,
        duplicatedId: duplicated.id,
        slug: duplicated.slug
      }
    });

    revalidateTag(SITEMAP_MANIFEST_CACHE_TAG);

    return NextResponse.json({ ok: true, jobId: duplicated.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel duplicar a vaga.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
