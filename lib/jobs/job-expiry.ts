import { getBrazilNow, getEffectiveJobDeadlineUtc, isExpiredBrazil } from "@/lib/date-utils";
import { prisma } from "@/lib/db";

type DeadlineFields = {
  publishedAt: Date | string;
  validThrough: Date | string | null | undefined;
  expiresAt: Date | string | null | undefined;
};

export function getEffectiveJobDeadline(job: DeadlineFields): Date {
  return getEffectiveJobDeadlineUtc(job);
}

export function isJobPastPublicDeadline(job: DeadlineFields) {
  return isExpiredBrazil(job);
}

/**
 * Desativa vagas cuja validade efetiva já passou. Idempotente.
 * Retorna slugs afetados para log.
 */
export async function markExpiredJobsInactive(): Promise<{ id: string; slug: string }[]> {
  const rows = await prisma.$queryRaw<{ id: string; slug: string }[]>`
    UPDATE "Job"
    SET "isActive" = false, "updatedAt" = NOW()
    WHERE "isActive" = true
      AND COALESCE("validThrough", "expiresAt", "publishedAt" + INTERVAL '90 days') < NOW()
    RETURNING "id", "slug"
  `;

  if (rows.length) {
    const brazilNow = getBrazilNow().format("YYYY-MM-DD HH:mm:ss Z");
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "expiry",
        hypothesisId: "H_EXPIRE",
        location: "lib/jobs/job-expiry.ts",
        message: "Vagas desativadas por vencimento (SQL)",
        data: { count: rows.length, brazilNow, slugs: rows.map((r) => r.slug).slice(0, 40) },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    console.warn(`[job-expiry] Desativadas ${rows.length} vaga(s) por validade (agora BR ${brazilNow}): ${rows.map((r) => r.slug).join(", ")}`);
  }

  return rows;
}
