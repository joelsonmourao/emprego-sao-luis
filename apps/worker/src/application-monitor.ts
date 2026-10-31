import { createDatabase, indexingEvents, jobs } from "@es/db";
import { classifyApplicationResponse, normalizeApplicationUrl } from "@es/shared";
import { and, eq, isNotNull, isNull, lt, or } from "drizzle-orm";

const SITE_URL = process.env.SITE_URL ?? "https://empregossaoluis.com.br";

export async function monitorApplicationUrls() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  const cutoff = new Date(Date.now() - 12 * 60 * 60 * 1000);
  try {
    const candidates = await connection.db.select().from(jobs).where(and(
      eq(jobs.publicationStatus, "PUBLISHED"),
      isNotNull(jobs.applicationUrl),
      or(isNull(jobs.applicationUrlCheckedAt), lt(jobs.applicationUrlCheckedAt, cutoff))
    )).limit(100);
    let available = 0;
    let closed = 0;
    let inconclusive = 0;
    for (const job of candidates) {
      const normalized = normalizeApplicationUrl(job.applicationUrl);
      if (!normalized.valid || !normalized.normalized) {
        await connection.db.update(jobs).set({ applicationUrlStatus: "INVALID", applicationUrlCheckedAt: new Date(), applicationUrlCheckReason: normalized.reason, updatedAt: new Date() }).where(eq(jobs.id, job.id));
        inconclusive++;
        continue;
      }
      let result: ReturnType<typeof classifyApplicationResponse>;
      let httpStatus: number | null = null;
      let finalUrl: string | null = null;
      try {
        const response = await fetch(normalized.normalized, { redirect: "follow", signal: AbortSignal.timeout(12_000), headers: { "user-agent": "EmpregosSaoLuis-LinkMonitor/1.0" } });
        httpStatus = response.status;
        finalUrl = response.url;
        const body = [403, 429].includes(response.status) ? "" : (await response.text()).slice(0, 500_000);
        result = classifyApplicationResponse({ status: response.status, body });
      } catch {
        result = { health: "INCONCLUSIVE", reason: "Timeout, DNS ou bloqueio temporário; a vaga não foi encerrada automaticamente." };
      }
      const now = new Date();
      if (result.health === "CLOSED") {
        closed++;
        await connection.db.transaction(async (tx) => {
          await tx.update(jobs).set({ publicationStatus: "CLOSED", closedAt: now, closureReason: result.reason, applicationUrlStatus: result.health, applicationUrlHttpStatus: httpStatus, applicationUrlFinalUrl: finalUrl, applicationUrlCheckedAt: now, applicationUrlCheckReason: result.reason, updatedAt: now }).where(eq(jobs.id, job.id));
          const publicUrl = new URL(`/vagas/${job.slug}`, SITE_URL).toString();
          await tx.insert(indexingEvents).values([
            { dedupeKey: `application-closed:${job.id}:google`, jobId: job.id, provider: "GOOGLE", url: publicUrl, notificationType: "URL_DELETED" },
            { dedupeKey: `application-closed:${job.id}:indexnow`, jobId: job.id, provider: "INDEXNOW", url: publicUrl, notificationType: "URL_UPDATED" }
          ]).onConflictDoNothing();
        });
      } else {
        if (result.health === "AVAILABLE") available++; else inconclusive++;
        await connection.db.update(jobs).set({ applicationUrlStatus: result.health, applicationUrlHttpStatus: httpStatus, applicationUrlFinalUrl: finalUrl, applicationUrlCheckedAt: now, applicationUrlCheckReason: result.reason, updatedAt: now }).where(eq(jobs.id, job.id));
      }
    }
    return { checked: candidates.length, available, closed, inconclusive };
  } finally { await connection.close(); }
}

