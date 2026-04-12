import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { getEditableSiteSettings, patchSiteSettings } from "@/lib/admin/site";

export async function GET() {
  await requireApiRole("EDITOR");
  const settings = await getEditableSiteSettings();
  return NextResponse.json({
    ok: true,
    google: settings.google,
    consentBanner: settings.consentBanner
  });
}

export async function PATCH(request: Request) {
  try {
    const session = await requireApiRole("ADMIN");
    const payload = await request.json();
    await patchSiteSettings(payload);
    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "site_integrations",
      entityLabel: "Integracoes Google",
      summary: "Integracoes de analytics, cookies e ads atualizadas"
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar as integracoes.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

