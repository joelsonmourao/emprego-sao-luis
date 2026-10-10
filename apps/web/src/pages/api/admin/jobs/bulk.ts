import type { APIRoute } from "astro";
import { auditLogs, categories, cities, companies, createDatabase, indexingEvents, jobs, states } from "@es/db";
import { evaluateJobPublication } from "@es/shared";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../lib/auth";
import { buildPublishIndexingEvents, buildRemoveIndexingEvents, type IndexingNotification } from "../../../../lib/indexing";

const statusSchema = z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "PAUSED", "ARCHIVED", "CLOSED", "EXPIRED"]);
export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "jobs.publish")) return new Response("Proibido", { status: 403 });
  const form = await request.formData();
  const ids = z.array(z.string().uuid()).min(1).max(200).safeParse(form.getAll("jobId"));
  const status = statusSchema.safeParse(form.get("status"));
  if (!ids.success || !status.success || !process.env.DATABASE_URL) return new Response("Selecione vagas e uma ação válida.", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    if (["APPROVED", "SCHEDULED", "PUBLISHED"].includes(status.data)) {
      const candidates = await connection.db
        .select({ job: jobs, companyName: companies.name, cityName: cities.name, stateCode: states.code, categoryName: categories.name })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .innerJoin(cities, eq(jobs.cityId, cities.id))
        .innerJoin(states, eq(jobs.stateId, states.id))
        .leftJoin(categories, eq(jobs.categoryId, categories.id))
        .where(inArray(jobs.id, ids.data));
      const blocked = candidates.flatMap((candidate) => {
        const quality = evaluateJobPublication({
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
          publicationStatus: status.data,
          expiresAt: candidate.job.expiresAt
        });
        return quality.valid ? [] : [`${candidate.job.publicCode}: ${quality.errors.join(" ")}`];
      });
      if (blocked.length) return new Response(`Aprovação em lote bloqueada. ${blocked.join(" | ")}`, { status: 422 });
    }
    await connection.db.transaction(async (tx) => {
      const before = await tx.select().from(jobs).where(inArray(jobs.id, ids.data));
      if (before.length !== ids.data.length) throw new Error("Uma ou mais vagas não foram encontradas.");
      const now = new Date();
      const changed = await tx.update(jobs).set({ publicationStatus: status.data, verificationStatus: ["APPROVED", "SCHEDULED", "PUBLISHED"].includes(status.data) ? "SOURCE_CONFIRMED" : status.data === "PENDING_REVIEW" ? "NEEDS_REVIEW" : undefined, reviewedBy: ["APPROVED", "SCHEDULED", "PUBLISHED"].includes(status.data) ? auth.id : undefined, reviewedAt: ["APPROVED", "SCHEDULED", "PUBLISHED"].includes(status.data) ? now : undefined, publishedAt: status.data === "PUBLISHED" ? now : undefined, closedAt: ["ARCHIVED", "CLOSED", "EXPIRED"].includes(status.data) ? now : null, updatedAt: now }).where(and(inArray(jobs.id, ids.data))).returning({ id: jobs.id, slug: jobs.slug, version: jobs.version });
      const indexingRows: IndexingNotification[] = [];
      for (const item of changed) {
        if (status.data === "PUBLISHED") indexingRows.push(...buildPublishIndexingEvents({ id: item.id, slug: item.slug, version: item.version, prefix: "bulk-publish" }));
        else if (["ARCHIVED", "CLOSED", "EXPIRED"].includes(status.data)) indexingRows.push(...buildRemoveIndexingEvents({ id: item.id, slug: item.slug, prefix: `bulk-${status.data.toLowerCase()}` }));
      }
      if (indexingRows.length) await tx.insert(indexingEvents).values(indexingRows).onConflictDoNothing();
      await tx.insert(auditLogs).values({ actorId: auth.id, action: `BULK_JOB_STATUS_${status.data}`, entityType: "JOB", after: { ids: changed.map((item) => item.id), count: changed.length, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
    });
    return redirect(`/admin/vagas?bulk=${status.data}`, 303);
  } finally {
    await connection.close();
  }
};
