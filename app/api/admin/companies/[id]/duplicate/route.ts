import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { normalizeSlug } from "@/lib/admin/content";
import { writeAuditLog } from "@/lib/audit";


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
    const company = await prisma.company.findUnique({ where: { id } });

    if (!company) {
      return NextResponse.json({ ok: false, error: "Empresa nao encontrada." }, { status: 404 });
    }

    const duplicated = await prisma.company.create({
      data: {
        name: `${company.name} (copia)`,
        slug: normalizeSlug(`${company.slug}-copia-${Date.now()}`),
        logoUrl: company.logoUrl,
        websiteUrl: company.websiteUrl,
        summary: company.summary,
        descriptionHtml: company.descriptionHtml,
        socialImageUrl: company.socialImageUrl,
        seoTitle: company.seoTitle,
        seoDescription: company.seoDescription,
        isActive: false,
        featured: false,
        stateId: company.stateId,
        cityId: company.cityId
      }
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.CREATE,
      entityType: "company",
      entityId: duplicated.id,
      entityLabel: duplicated.name,
      summary: "Empresa duplicada",
      after: { id: duplicated.id, slug: duplicated.slug, name: duplicated.name }
    });

    return NextResponse.json({ ok: true, companyId: duplicated.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel duplicar a empresa.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
