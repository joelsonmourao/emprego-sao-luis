import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { createTaxonomyEntry } from "@/lib/admin/taxonomies";
import { taxonomyResourceSchema } from "@/lib/schemas/taxonomy-admin";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST(
  request: Request,
  context: { params: Promise<{ resource: string }> }
) {
  try {
    const session = await requireApiRole("EDITOR");
    const { resource } = await context.params;
    const parsedResource = taxonomyResourceSchema.parse(resource);
    const payload = await request.json();
    const item = await createTaxonomyEntry(parsedResource, payload);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.CREATE,
      entityType: parsedResource,
      entityId: item.id,
      entityLabel: item.name,
      summary: `${parsedResource === "states" ? "Estado" : "Cidade"} criado`
    });

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
