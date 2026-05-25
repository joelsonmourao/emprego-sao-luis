import { JobIndexingStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireApiRole } from "@/lib/authz";
import { submitPublishedJobToIndexing } from "@/lib/job-publication";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_PER_EXECUTION = 50;

export async function POST() {
  try {
    await requireApiRole("ADMIN");

    const pendingJobs = await prisma.job.findMany({
      where: {
        status: JobStatus.PUBLISHED,
        indexingStatus: { in: [JobIndexingStatus.NOT_SENT, JobIndexingStatus.ERROR, JobIndexingStatus.SKIPPED] }
      },
      orderBy: [{ updatedAt: "asc" }],
      take: MAX_PER_EXECUTION,
      select: { id: true, slug: true }
    });

    let success = 0;
    let errors = 0;
    let skipped = 0;
    const details: Array<{ slug: string; ok: boolean; skipped: boolean; message: string }> = [];

    for (const job of pendingJobs) {
      const result = await submitPublishedJobToIndexing(job.id);
      if (result.ok) {
        success += 1;
      } else if (result.skipped) {
        skipped += 1;
      } else {
        errors += 1;
      }
      details.push({
        slug: job.slug,
        ok: result.ok,
        skipped: !result.ok && result.skipped,
        message: result.message
      });
    }

    return NextResponse.json({
      ok: true,
      processed: pendingJobs.length,
      success,
      errors,
      skipped,
      details
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao enviar vagas publicadas pendentes.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
