import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const bodySchema = z.object({
  ids: z.array(z.string()).optional(),
  status: z.enum(["ERROR", "SKIPPED"]).optional(),
  olderThanDays: z.number().int().positive().optional(),
  dryRun: z.boolean().optional()
});

export async function POST(request: Request) {
  try {
    await requireApiRole("ADMIN");
    const body = bodySchema.parse(await request.json());
    const where: {
      id?: { in: string[] };
      status?: string;
      createdAt?: { lt: Date };
    } = {};

    if (body.ids?.length) where.id = { in: body.ids };
    if (body.status) where.status = body.status;
    if (body.olderThanDays) {
      const cutoff = new Date(Date.now() - body.olderThanDays * 24 * 60 * 60 * 1000);
      where.createdAt = { lt: cutoff };
    }

    if (!where.id && !where.status && !where.createdAt) {
      return NextResponse.json({ ok: false, error: "Nenhum criterio informado para exclusao em massa." }, { status: 400 });
    }

    if (body.dryRun) {
      const matchedCount = await prisma.indexingLog.count({ where });
      return NextResponse.json({ ok: true, matchedCount, dryRun: true });
    }

    const result = await prisma.indexingLog.deleteMany({ where });
    return NextResponse.json({ ok: true, deletedCount: result.count, dryRun: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao apagar logs de indexacao.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
