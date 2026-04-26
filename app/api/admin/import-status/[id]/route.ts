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
  // #region agent log
  fetch('http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dd62ba'},body:JSON.stringify({sessionId:'dd62ba',runId:'pre-fix',hypothesisId:'H4',location:'app/api/admin/import-status/[id]/route.ts:GET',message:'Status de fila consultado no backend',data:{queueId:id,status:queue.status,processedRows:queue.processedRows,totalRows:queue.totalRows,progress},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return NextResponse.json({
    ok: true,
    queue: {
      ...queue,
      progress
    }
  });
}
