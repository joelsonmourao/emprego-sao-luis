import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { processDueScheduledJobs } from "@/lib/job-publication";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized(request: Request) {
  const expectedSecret = env.CRON_SECRET?.trim();
  if (!expectedSecret) return true;

  const headerSecret = request.headers.get("x-cron-secret")?.trim();
  const querySecret = new URL(request.url).searchParams.get("secret")?.trim();
  const authorization = request.headers.get("authorization")?.trim();
  const bearerSecret = authorization === `Bearer ${expectedSecret}`;
  return headerSecret === expectedSecret || querySecret === expectedSecret || bearerSecret;
}

async function runCron(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const result = await processDueScheduledJobs();
    return NextResponse.json({
      ok: true,
      limit: result.limit,
      published: result.published,
      sentToIndexing: result.sentToIndexing,
      remainingScheduled: result.remainingScheduled,
      indexingErrors: result.indexingErrors,
      publicationErrors: result.publicationErrors
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha ao executar cron de publicacao."
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return runCron(request);
}

export async function POST(request: Request) {
  return runCron(request);
}
