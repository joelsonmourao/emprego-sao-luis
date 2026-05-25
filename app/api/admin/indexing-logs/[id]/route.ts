import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: Context) {
  try {
    await requireApiRole("ADMIN");
    const { id } = await context.params;
    await prisma.indexingLog.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao apagar log de indexacao.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
