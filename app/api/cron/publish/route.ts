import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { processDueScheduledJobs } from "@/lib/job-publication";



export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  const xCronHeader = request.headers.get("x-cron-secret");
  const querySecret = new URL(request.url).searchParams.get("secret");
  const expectedSecret = env.CRON_SECRET?.trim();

  if (!expectedSecret) {
    return true;
  }

  return authHeader === `Bearer ${expectedSecret}` || xCronHeader === expectedSecret || querySecret === expectedSecret;
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
    const result = await processDueScheduledJobs();
    return NextResponse.json(
      {
        ok: true,
        limit: result.limit,
        published: result.published,
        sentToIndexing: result.sentToIndexing,
        dueScheduled: result.dueScheduled,
        remainingScheduled: result.remainingScheduled,
        indexingErrors: result.indexingErrors,
        publicationErrors: result.publicationErrors
      },
      { status: 200 }
    );
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
