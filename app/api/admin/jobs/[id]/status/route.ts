import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";

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
      data: { isActive: body.isActive }
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
