import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  await requireApiRole("EDITOR");
  const { id } = await context.params;

  const queue = await prisma.importQueue.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      totalRows: true,
      processedRows: true,
      importedCount: true,
      updatedCount: true,
      errorCount: true,
      errorMessage: true,
      startedAt: true,
      finishedAt: true,
      createdAt: true,
      result: true
    }
  });

  if (!queue) {
    return NextResponse.json({ ok: false, error: "Fila de importacao nao encontrada." }, { status: 404 });
  }

  const progress = queue.totalRows > 0 ? Math.min(100, Math.round((queue.processedRows / queue.totalRows) * 100)) : 0;
  return NextResponse.json({
    ok: true,
    queue: {
      ...queue,
      progress
    }
  });
}
