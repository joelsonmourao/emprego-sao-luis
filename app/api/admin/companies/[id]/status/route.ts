import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireApiRole("EDITOR");
    const { id } = await context.params;
    const body = (await request.json()) as { isActive?: boolean };
    const before = await prisma.company.findUnique({ where: { id } });

    const company = await prisma.company.update({
      where: { id },
      data: { isActive: Boolean(body.isActive) }
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "company",
      entityId: company.id,
      entityLabel: company.name,
      summary: body.isActive ? "Empresa ativada" : "Empresa desativada",
      before,
      after: { isActive: company.isActive }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel atualizar o status da empresa.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
