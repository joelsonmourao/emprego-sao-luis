import { getBrazilNow, getEffectiveJobDeadlineUtc, isExpiredBrazil } from "@/lib/date-utils";
import { prisma } from "@/lib/db";

type DeadlineFields = {
  publishedAt: Date | string | null | undefined;
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
    console.warn(`[job-expiry] Desativadas ${rows.length} vaga(s) por validade (agora BR ${brazilNow}): ${rows.map((r) => r.slug).join(", ")}`);
  }

  return rows;
}
