import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { fixScheduledImportPublication } from "@/lib/job-publication";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  try {
    const session = await requireApiRole("ADMIN");
    const summary = await fixScheduledImportPublication();

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "job",
      summary: "Correcao de importacao agendada executada",
      after: summary
    });

    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao corrigir importacao agendada.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
