import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { deleteCompany, upsertCompanyFromForm } from "@/lib/admin/companies";
import { writeAuditLog } from "@/lib/audit";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireApiRole("EDITOR");
    const { id } = await context.params;
    const before = await prisma.company.findUnique({ where: { id } });
    const payload = await request.json();
    const company = await upsertCompanyFromForm(payload, id);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "company",
      entityId: company.id,
      entityLabel: company.name,
      summary: "Empresa atualizada",
      before,
      after: { id: company.id, slug: company.slug, name: company.name }
    });

    return NextResponse.json({ ok: true, companyId: company.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel atualizar a empresa.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await requireApiRole("ADMIN");
    const { id } = await context.params;
    const before = await prisma.company.findUnique({ where: { id } });
    await deleteCompany(id);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.DELETE,
      entityType: "company",
      entityId: before?.id,
      entityLabel: before?.name,
      summary: "Empresa excluida",
      before
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel excluir a empresa.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
