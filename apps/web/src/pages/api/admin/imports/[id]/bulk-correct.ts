import type { APIRoute } from "astro";
import { z } from "zod";
import { auditLogs, categories, cities, companies, createDatabase, importRows, jobs, states } from "@es/db";
import {
  evaluateJobPublication,
  normalizeApplicationEmail,
  normalizeApplicationUrl,
  normalizeApplicationWhatsapp
} from "@es/shared";
import { and, eq, inArray } from "drizzle-orm";
import { can } from "../../../../../lib/auth";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../../../lib/admin-api-response";

const schema = z.object({
  rowId: z.array(z.string().uuid()).min(1).max(200),
  field: z.enum([
    "applicationUrl",
    "applicationEmail",
    "applicationWhatsapp",
    "whatsappMessage",
    "applicationInstructions",
    "expiresAt",
    "sourceName",
    "workplaceType"
  ]),
  value: z.string().trim().max(2_000)
});

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ params, request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Lote inválido.", 400);
  const form = await request.formData();
  const parsed = schema.safeParse({
    rowId: form.getAll("rowId").map(String),
    field: form.get("field"),
    value: form.get("value")
  });
  if (!parsed.success) return adminJsonError("Selecione as linhas, o campo e um valor válido.", 422);

  const { field, value } = parsed.data;
  const now = new Date();
  const commonUpdate: Partial<typeof jobs.$inferInsert> = { updatedAt: now, verificationStatus: "NEEDS_REVIEW" };
  if (field === "applicationUrl") {
    const channel = normalizeApplicationUrl(value);
    if (!channel.valid || !channel.normalized) return adminJsonError(channel.reason ?? "URL inválida.", 422);
    Object.assign(commonUpdate, {
      applicationUrl: channel.normalized,
      applicationUrlStatus: "UNCHECKED",
      applicationUrlHttpStatus: null,
      applicationUrlCheckedAt: null,
      applicationUrlHealthReason: null
    });
  } else if (field === "applicationEmail") {
    const channel = normalizeApplicationEmail(value);
    if (!channel.valid || !channel.normalized) return adminJsonError(channel.reason ?? "E-mail inválido.", 422);
    Object.assign(commonUpdate, {
      applicationEmail: channel.normalized,
      applicationEmailValid: true,
      applicationEmailValidatedAt: now,
      applicationEmailSource: "IMPORT_BULK_CORRECTION"
    });
  } else if (field === "applicationWhatsapp") {
    const channel = normalizeApplicationWhatsapp(value);
    if (!channel.valid || !channel.normalized) return adminJsonError(channel.reason ?? "WhatsApp inválido.", 422);
    Object.assign(commonUpdate, {
      applicationWhatsappOriginal: channel.original,
      applicationWhatsapp: channel.normalized,
      applicationWhatsappValid: true,
      applicationWhatsappValidatedAt: now,
      applicationWhatsappSource: "IMPORT_BULK_CORRECTION"
    });
  } else if (field === "whatsappMessage") {
    if (!value) return adminJsonError("A mensagem não pode ficar vazia.", 422);
    Object.assign(commonUpdate, { applicationWhatsappMessage: value });
  } else if (field === "applicationInstructions") {
    if (!value) return adminJsonError("A instrução não pode ficar vazia.", 422);
    Object.assign(commonUpdate, { applicationInstructions: value });
  } else if (field === "expiresAt") {
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date <= now) return adminJsonError("Informe uma data futura válida.", 422);
    Object.assign(commonUpdate, { expiresAt: date });
  } else if (field === "sourceName") {
    if (value.length < 2) return adminJsonError("Informe a fonte real da vaga.", 422);
    Object.assign(commonUpdate, { sourceName: value });
  } else {
    if (!(["presencial", "hibrido", "remoto"] as const).includes(value as "presencial" | "hibrido" | "remoto"))
      return adminJsonError("Modalidade inválida.", 422);
    Object.assign(commonUpdate, { workplaceType: value });
  }

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const selectedRows = await connection.db
      .select()
      .from(importRows)
      .where(and(eq(importRows.batchId, params.id), inArray(importRows.id, parsed.data.rowId)));
    if (selectedRows.length !== parsed.data.rowId.length || selectedRows.some((row) => !row.jobId))
      return adminJsonError("As linhas selecionadas não pertencem a este lote ou ainda não criaram rascunhos.", 409);
    const jobIds = selectedRows.map((row) => row.jobId!);

    await connection.db.transaction(async (tx) => {
      await tx.update(jobs).set(commonUpdate).where(inArray(jobs.id, jobIds));
      const candidates = await tx
        .select({ job: jobs, companyName: companies.name, cityName: cities.name, stateCode: states.code, categoryName: categories.name })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .innerJoin(cities, eq(jobs.cityId, cities.id))
        .innerJoin(states, eq(jobs.stateId, states.id))
        .leftJoin(categories, eq(jobs.categoryId, categories.id))
        .where(inArray(jobs.id, jobIds));

      for (const candidate of candidates) {
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
          publicationStatus: "PUBLISHED",
          expiresAt: candidate.job.expiresAt
        });
        const row = selectedRows.find((item) => item.jobId === candidate.job.id)!;
        const previous = row.changedFields && typeof row.changedFields === "object" ? row.changedFields as Record<string, unknown> : {};
        await tx.update(importRows).set({
          changedFields: { ...previous, [field]: { value, changedBy: auth.id, changedAt: now.toISOString() } },
          reviewStatus: quality.valid ? "READY_FOR_REVIEW" : "NEEDS_REVIEW",
          warnings: quality.warnings,
          errors: quality.errors,
          updatedAt: now
        }).where(eq(importRows.id, row.id));
      }
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "BULK_CORRECT_IMPORT_ROWS",
        entityType: "IMPORT_BATCH",
        entityId: params.id,
        after: { rowIds: parsed.data.rowId, field, count: selectedRows.length },
        origin: "ADMIN"
      });
    });
    return adminJsonRedirect(`/admin/vagas/importar?batch=${params.id}&step=resultado`, {
      message: `${selectedRows.length} linha(s) corrigida(s). Revise a nova validação antes de aprovar.`
    });
  } finally {
    await connection.close();
  }
};
