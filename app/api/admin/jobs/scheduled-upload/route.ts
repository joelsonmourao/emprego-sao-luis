import { NextResponse } from "next/server";


import { requireApiRole } from "@/lib/authz";
import { scheduledJobUploadPayloadSchema } from "@/lib/schemas/scheduled-job-upload";
import { importScheduledJobsFromUploadRows } from "@/lib/scheduled-publication-db";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const RESPONSE_HEADERS = {
  "Cache-Control": "no-store"
};

export async function POST(request: Request) {
  try {
    const session = await requireApiRole("EDITOR");

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Corpo JSON invalido." }, { status: 400, headers: RESPONSE_HEADERS });
    }

    const payload = scheduledJobUploadPayloadSchema.parse(rawBody);
    const result = await importScheduledJobsFromUploadRows(payload.rows, {
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role
    });

    return NextResponse.json(
      {
        ok: result.ok,
        totalRows: result.totalRows,
        validRows: result.validRows,
        scheduled: result.scheduled,
        publishedImmediately: result.publishedImmediately,
        updated: result.updated,
        ignored: result.ignored,
        errors: result.errors,
        results: result.results
      },
      { status: result.ok ? 200 : 207, headers: RESPONSE_HEADERS }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha no upload agendado.";
    return NextResponse.json({ ok: false, error: message }, { status: 400, headers: RESPONSE_HEADERS });
  }
}
