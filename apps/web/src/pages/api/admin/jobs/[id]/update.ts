import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import { jobDraftSchema } from "@es/shared";
import { auditLogs, categories, cities, companies, createDatabase, indexingEvents, jobRevisions, jobs, states } from "@es/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { adminJsonError, adminJsonRedirect } from "../../../../../lib/admin-api-response";
import { can } from "../../../../../lib/auth";
import { buildPublishIndexingEvents } from "../../../../../lib/indexing";
import { resolveRequestedJobSlug } from "../../../../../lib/job-slug";
import { logServerError } from "../../../../../lib/server-error";

const optional = (value: FormDataEntryValue | null) => typeof value === "string" && value.trim() ? value.trim() : undefined;

export const POST: APIRoute = async ({ params, request, locals, clientAddress }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "jobs.create")) return adminJsonError("Sem permissão para editar vagas.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Vaga ou banco inválido.", 400);

  const form = await request.formData();
  const version = z.coerce.number().int().positive().safeParse(form.get("version"));
  const parsed = jobDraftSchema.safeParse({
    ...Object.fromEntries(form),
    categoryId: optional(form.get("categoryId")), sourceUrl: optional(form.get("sourceUrl")),
    salaryMin: optional(form.get("salaryMin")), salaryMax: optional(form.get("salaryMax"))
  });
  if (!version.success || !parsed.success) {
    return adminJsonError("Revise os campos da vaga.", 422, { details: parsed.success ? [] : parsed.error.issues });
  }

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [[city], [state], [company], categoryRows] = await Promise.all([
      connection.db.select({ name: cities.name, stateId: cities.stateId }).from(cities).where(eq(cities.id, parsed.data.cityId)).limit(1),
      connection.db.select({ code: states.code }).from(states).where(eq(states.id, parsed.data.stateId)).limit(1),
      connection.db.select({ id: companies.id }).from(companies).where(eq(companies.id, parsed.data.companyId)).limit(1),
      parsed.data.categoryId ? connection.db.select({ id: categories.id }).from(categories).where(eq(categories.id, parsed.data.categoryId)).limit(1) : Promise.resolve([])
    ]);
    if (!city || !state || city.stateId !== parsed.data.stateId) return adminJsonError("Cidade e estado não correspondem.", 422, { code: "LOCATION_MISMATCH" });
    if (!company) return adminJsonError("Empresa não encontrada.", 422, { code: "COMPANY_NOT_FOUND" });
    if (parsed.data.categoryId && !categoryRows[0]) return adminJsonError("Categoria não encontrada.", 422, { code: "CATEGORY_NOT_FOUND" });

    const slug = await resolveRequestedJobSlug(connection.db, parsed.data.slug, parsed.data.normalizedTitle, city.name, state.code, params.id);
    let saved: typeof jobs.$inferSelect | undefined;
    await connection.db.transaction(async (tx) => {
      const [before] = await tx.select().from(jobs).where(eq(jobs.id, params.id!)).limit(1);
      if (!before) throw new Error("Vaga não encontrada.");
      [saved] = await tx.update(jobs).set({
        ...parsed.data,
        slug,
        categoryId: parsed.data.categoryId ?? null,
        sourceUrl: parsed.data.sourceUrl ?? null,
        sourceEvidence: parsed.data.sourceEvidence ?? null,
        salaryMin: parsed.data.salaryMin?.toString(), salaryMax: parsed.data.salaryMax?.toString(),
        salaryVisible: form.get("salaryVisible") === "on" || parsed.data.salaryMin !== undefined || parsed.data.salaryMax !== undefined,
        scheduledAt: parsed.data.publicationStatus === "SCHEDULED" ? parsed.data.scheduledAt : null,
        publishedAt: parsed.data.publicationStatus === "PUBLISHED" ? before.publishedAt ?? new Date() : before.publishedAt,
        duplicateHash: createHash("sha256").update(`${parsed.data.normalizedTitle}|${parsed.data.companyId}|${parsed.data.cityId}`).digest("hex"),
        version: before.version + 1,
        updatedAt: new Date()
      }).where(and(eq(jobs.id, before.id), eq(jobs.version, version.data))).returning();
      if (!saved) throw new Error("Conflito de edição. Recarregue a página.");
      await tx.insert(jobRevisions).values({ jobId: before.id, version: before.version, snapshot: before, actorId: auth.id });
      await tx.insert(auditLogs).values({ actorId: auth.id, action: "UPDATE", entityType: "JOB", entityId: before.id, before, after: { record: saved, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
      if (before.publicationStatus !== "PUBLISHED" && saved.publicationStatus === "PUBLISHED") {
        await tx.insert(indexingEvents).values(buildPublishIndexingEvents({ id: saved.id, slug: saved.slug, version: saved.version, prefix: "edit" })).onConflictDoNothing();
      }
    });
    return adminJsonRedirect(`/admin/vagas/${params.id}/editar?saved=1`, { job: saved });
  } catch (error) {
    logServerError("route:/api/admin/jobs/:id/update", error, { userId: auth.id, entity: "JOB", route: `/api/admin/jobs/${params.id}/update` });
    const message = error instanceof Error && error.message.includes("Conflito") ? error.message : "Não foi possível atualizar a vaga.";
    return adminJsonError(message, message.includes("Conflito") ? 409 : 500);
  } finally { await connection.close(); }
};
