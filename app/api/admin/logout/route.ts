import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AuditAction } from "@prisma/client";


import { getAdminSession } from "@/lib/auth";
import { ADMIN_AUTH_COOKIE } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST() {
  const session = await getAdminSession();
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_AUTH_COOKIE);

  if (session) {
    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.LOGOUT,
      entityType: "admin_session",
      entityId: session.sub,
      entityLabel: session.email,
      summary: "Logout realizado no painel"
    });
  }

  return NextResponse.json({ ok: true });
}
