import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { getGoogleIndexingAdminSnapshot } from "@/lib/admin/google-indexing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await requireApiRole("ADMIN");
    const snapshot = await getGoogleIndexingAdminSnapshot();
    return NextResponse.json({ ok: true, snapshot });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao carregar status da Google Indexing API.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
