import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { testGoogleIndexingConnection } from "@/lib/google-indexing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  try {
    await requireApiRole("ADMIN");
    const result = await testGoogleIndexingConnection();
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao testar conexao da Google Indexing API.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
