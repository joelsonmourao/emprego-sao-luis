import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { upsertCompanyFromForm } from "@/lib/admin/companies";
import { writeAuditLog } from "@/lib/audit";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST(request: Request) {
  try {
    const session = await requireApiRole("EDITOR");
    const payload = await request.json();
    const company = await upsertCompanyFromForm(payload);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.CREATE,
      entityType: "company",
      entityId: company.id,
      entityLabel: company.name,
      summary: "Empresa criada",
      after: { id: company.id, slug: company.slug, name: company.name }
    });

    return NextResponse.json({ ok: true, companyId: company.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar a empresa.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function GET() {
  await requireApiRole("EDITOR");
  const companies = await prisma.company.findMany({
    include: { city: true, state: true },
    orderBy: [{ updatedAt: "desc" }]
  });

  return NextResponse.json({ ok: true, companies });
}
