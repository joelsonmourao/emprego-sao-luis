import type { APIRoute } from "astro";
import { auditLogs, categories, cities, companies, createDatabase, indexingEvents, jobRevisions, jobs, states } from "@es/db";
import { evaluateJobPublication } from "@es/shared";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../../lib/auth";
import { buildPublishIndexingEvents, buildRemoveIndexingEvents } from "../../../../../lib/indexing";

const schema = z.enum([
  "DRAFT",
  "PENDING_REVIEW",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
  "PAUSED",
  "EXPIRED",
  "CLOSED",
  "ARCHIVED"
]);
export const POST: APIRoute = async ({ params, request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "jobs.publish")) return new Response("Proibido", { status: 403 });
  const status = schema.safeParse((await request.formData()).get("status"));
  if (!params.id || !status.success || !process.env.DATABASE_URL)
    return new Response("Dados inválidos", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    if (["APPROVED", "SCHEDULED", "PUBLISHED"].includes(status.data)) {
      const [candidate] = await connection.db
        .select({ job: jobs, companyName: companies.name, cityName: cities.name, stateCode: states.code, categoryName: categories.name })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .innerJoin(cities, eq(jobs.cityId, cities.id))
        .innerJoin(states, eq(jobs.stateId, states.id))
        .leftJoin(categories, eq(jobs.categoryId, categories.id))
        .where(eq(jobs.id, params.id))
        .limit(1);
      if (!candidate) return new Response("Vaga não encontrada.", { status: 404 });
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
      if (!quality.valid)
        return new Response(`Publicação bloqueada: ${quality.errors.join(" ")}`, { status: 422 });
    }
    await connection.db.transaction(async (tx) => {
      const [before] = await tx.select().from(jobs).where(eq(jobs.id, params.id!)).limit(1);
      if (!before) throw new Error("Vaga não encontrada.");
      const now = new Date();
      const [after] = await tx
        .update(jobs)
        .set({
          publicationStatus: status.data,
          verificationStatus: ["APPROVED", "SCHEDULED", "PUBLISHED"].includes(status.data) ? "SOURCE_CONFIRMED" : status.data === "PENDING_REVIEW" ? "NEEDS_REVIEW" : before.verificationStatus,
          reviewedBy: ["APPROVED", "SCHEDULED", "PUBLISHED"].includes(status.data) ? auth.id : before.reviewedBy,
          reviewedAt: ["APPROVED", "SCHEDULED", "PUBLISHED"].includes(status.data) ? now : before.reviewedAt,
          publishedAt: status.data === "PUBLISHED" ? (before.publishedAt ?? now) : before.publishedAt,
          scheduledAt: status.data === "SCHEDULED" ? before.scheduledAt : null,
          closedAt: ["CLOSED", "ARCHIVED", "EXPIRED"].includes(status.data) ? now : null,
          version: before.version + 1,
          updatedAt: now
        })
        .where(and(eq(jobs.id, before.id), eq(jobs.version, before.version)))
        .returning();
      if (!after) throw new Error("A vaga foi alterada por outra sessão. Recarregue a página.");
      await tx
        .insert(jobRevisions)
        .values({ jobId: before.id, version: before.version, snapshot: before, actorId: auth.id })
        .onConflictDoNothing();
      await tx
        .insert(auditLogs)
        .values({
          actorId: auth.id,
          action: `JOB_STATUS_${status.data}`,
          entityType: "JOB",
          entityId: before.id,
          before,
          after: { record: after, ip: clientAddress, userAgent: request.headers.get("user-agent") },
          origin: "ADMIN"
        });
      if (status.data === "PUBLISHED")
        await tx
          .insert(indexingEvents)
          .values(
            buildPublishIndexingEvents({
              id: after.id,
              slug: after.slug,
              version: after.version,
              prefix: "status"
            })
          )
          .onConflictDoNothing();
      if (before.publicationStatus === "PUBLISHED" && status.data !== "PUBLISHED")
        await tx
          .insert(indexingEvents)
          .values(
            buildRemoveIndexingEvents({
              id: after.id,
              slug: after.slug,
              prefix: `status-${status.data.toLowerCase()}`
            })
          )
          .onConflictDoNothing();
    });
    return redirect("/admin/vagas?updated=1", 303);
  } finally {
    await connection.close();
  }
};
