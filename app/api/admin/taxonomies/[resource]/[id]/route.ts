import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { deleteTaxonomyEntry, updateTaxonomyEntry } from "@/lib/admin/taxonomies";
import { taxonomyResourceSchema } from "@/lib/schemas/taxonomy-admin";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function PATCH(
  request: Request,
  context: { params: Promise<{ resource: string; id: string }> }
) {
  try {
    const session = await requireApiRole("EDITOR");
    const { resource, id } = await context.params;
    const parsedResource = taxonomyResourceSchema.parse(resource);
    const payload = await request.json();
    const item = await updateTaxonomyEntry(parsedResource, id, payload);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: parsedResource,
      entityId: item.id,
      entityLabel: item.name,
      summary: `${parsedResource === "states" ? "Estado" : "Cidade"} atualizado`
    });

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel atualizar.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ resource: string; id: string }> }
) {
  try {
    const session = await requireApiRole("ADMIN");
    const { resource, id } = await context.params;
    const parsedResource = taxonomyResourceSchema.parse(resource);
    const item = await deleteTaxonomyEntry(parsedResource, id);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.DELETE,
      entityType: parsedResource,
      entityId: id,
      entityLabel: item.name,
      summary: `${parsedResource === "states" ? "Estado" : "Cidade"} excluido`,
      before: item
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel excluir.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
