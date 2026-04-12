import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { getEditableSiteContent, saveSiteContent } from "@/lib/admin/site";

export async function GET() {
  await requireApiRole("EDITOR");
  const content = await getEditableSiteContent();
  return NextResponse.json({ ok: true, content });
}

export async function PATCH(request: Request) {
  try {
    const session = await requireApiRole("ADMIN");
    const payload = await request.json();
    await saveSiteContent(payload);
    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "site_content",
      entityLabel: "Conteudo do site",
      summary: "Conteudo principal do site atualizado"
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar o conteudo do site.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
