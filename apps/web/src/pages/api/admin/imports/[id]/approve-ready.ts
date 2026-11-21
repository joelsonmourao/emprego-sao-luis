import type { APIRoute } from "astro";
import { auditLogs, categories, cities, companies, createDatabase, importRows, indexingEvents, jobs, states } from "@es/db";
import { evaluateJobPublication } from "@es/shared";
import { and, eq, inArray } from "drizzle-orm";
import { can } from "../../../../../lib/auth";
import { adminJsonError, adminJsonRedirect } from "../../../../../lib/admin-api-response";
import { buildPublishIndexingEvents } from "../../../../../lib/indexing";

export const POST: APIRoute = async ({ params, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "jobs.publish") || !can(auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Lote inválido.", 400);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const readyRows = await connection.db.select().from(importRows).where(and(eq(importRows.batchId, params.id), eq(importRows.reviewStatus, "READY_FOR_REVIEW")));
    const jobIds = readyRows.flatMap((row) => row.jobId ? [row.jobId] : []);
    if (!jobIds.length) return adminJsonError("Nenhuma vaga de alta confiança disponível.", 409);
    const candidates = await connection.db
      .select({ job: jobs, companyName: companies.name, cityName: cities.name, stateCode: states.code, categoryName: categories.name })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .innerJoin(cities, eq(jobs.cityId, cities.id))
      .innerJoin(states, eq(jobs.stateId, states.id))
      .leftJoin(categories, eq(jobs.categoryId, categories.id))
      .where(inArray(jobs.id, jobIds));
    const approved = candidates.filter((candidate) => evaluateJobPublication({
      title: candidate.job.normalizedTitle,
      companyName: candidate.companyName,
      description: candidate.job.descriptionHtml,
      cityName: candidate.cityName,
      stateCode: candidate.stateCode,
      categoryName: candidate.categoryName,
      sourceName: candidate.job.sourceName,
      sourceUrl: candidate.job.sourceUrl,
      applicationUrl: candidate.job.applicationUrl,
      applicationEmail: candidate.job.applicationEmail,
      applicationWhatsapp: candidate.job.applicationWhatsapp,
      applicationUrlStatus: candidate.job.applicationUrlStatus,
      verificationStatus: "SOURCE_CONFIRMED",
      publicationStatus: "PUBLISHED",
      expiresAt: candidate.job.expiresAt
    }).valid);
    if (!approved.length) return adminJsonError("As vagas prontas não passaram pela validação final.", 422);
    const now = new Date();
    await connection.db.transaction(async (tx) => {
      for (const candidate of approved) {
        const [saved] = await tx.update(jobs).set({ publicationStatus: "PUBLISHED", verificationStatus: "SOURCE_CONFIRMED", reviewedBy: auth.id, reviewedAt: now, publishedAt: candidate.job.publishedAt ?? now, updatedAt: now }).where(eq(jobs.id, candidate.job.id)).returning();
        if (!saved) continue;
        await tx.update(importRows).set({ reviewStatus: "APPROVED", approvedBy: auth.id, approvedAt: now, updatedAt: now }).where(and(eq(importRows.batchId, params.id!), eq(importRows.jobId, saved.id)));
        await tx.insert(indexingEvents).values(buildPublishIndexingEvents({ id: saved.id, slug: saved.slug, version: saved.version, prefix: "import-bulk-approve" })).onConflictDoNothing();
      }
      await tx.insert(auditLogs).values({ actorId: auth.id, action: "APPROVE_IMPORT_READY", entityType: "IMPORT_BATCH", entityId: params.id, after: { jobIds: approved.map((item) => item.job.id), count: approved.length }, origin: "ADMIN" });
    });
    return adminJsonRedirect(`/admin/vagas/importar?batch=${params.id}&step=resultado`, { message: `${approved.length} vaga(s) publicadas após aprovação em lote.` });
  } finally {
    await connection.close();
  }
};
