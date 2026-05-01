import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { processScheduledPublicationsFromDatabase } from "@/lib/scheduled-publication-db";



export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = env.CRON_SECRET?.trim();

  if (!expectedSecret) {
    return true;
  }

  return authHeader === `Bearer ${expectedSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Nao autorizado para executar a publicacao agendada."
      },
      { status: 401 }
    );
  }

  try {
    const result = await processScheduledPublicationsFromDatabase({
      logDir: env.SCHEDULED_JOBS_LOG_DIR?.trim() || undefined
    });
    return NextResponse.json(result, { status: result.ok ? 200 : 207 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha ao processar a publicacao agendada."
      },
      { status: 500 }
    );
  }
}
