import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import {
  consolidateJobContent,
  evaluateJobPublication,
  jobDraftSchema,
  normalizeNeighborhood,
  UNIDENTIFIED_COMPANY_ID,
  validateApplicationChannels
} from "@es/shared";
import {
  auditLogs,
  categories,
  cities,
  companies,
  createDatabase,
  indexingEvents,
  jobs,
  states
} from "@es/db";
import { eq, sql } from "drizzle-orm";
import { can } from "../../../../lib/auth";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../../lib/admin-api-response";
import { logServerError } from "../../../../lib/server-error";
import { resolveRequestedJobSlug } from "../../../../lib/job-slug";

const optional = (value: FormDataEntryValue | null) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "jobs.create")) return adminJsonError("Sem permissão.", 403);

  const form = await request.formData();
  const raw = Object.fromEntries(form);
  const parsed = jobDraftSchema.safeParse({
    ...raw,
    categoryId: optional(form.get("categoryId")),
    sourceUrl: optional(form.get("sourceUrl")),
    salaryMin: optional(form.get("salaryMin")),
    salaryMax: optional(form.get("salaryMax")),
    salaryVisible: optional(form.get("salaryVisible")) === "on" ? "true" : undefined
  });

  if (!parsed.success) {
    return adminJsonError("Revise os campos do formulário.", 400, { details: parsed.error.issues });
  }
  if (!process.env.DATABASE_URL) return adminJsonError("Banco indisponível.", 503);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const content = consolidateJobContent({ descriptionHtml: parsed.data.descriptionHtml });
    const unidentifiedCompany = parsed.data.companyId === UNIDENTIFIED_COMPANY_ID;
    const [[city], [state], [company], categoryRows] = await Promise.all([
      connection.db
        .select({ name: cities.name, stateId: cities.stateId })
        .from(cities)
        .where(eq(cities.id, parsed.data.cityId))
        .limit(1),
      connection.db
        .select({ code: states.code })
        .from(states)
        .where(eq(states.id, parsed.data.stateId))
        .limit(1),
      connection.db
        .select({ id: companies.id, name: companies.name })
        .from(companies)
        .where(eq(companies.id, parsed.data.companyId))
        .limit(1),
      parsed.data.categoryId
        ? connection.db
            .select({ id: categories.id, name: categories.name })
            .from(categories)
            .where(eq(categories.id, parsed.data.categoryId))
            .limit(1)
        : Promise.resolve([])
    ]);
    if (!city || !state || city.stateId !== parsed.data.stateId)
      return adminJsonError("Cidade e estado não correspondem.", 422, { code: "LOCATION_MISMATCH" });
    if (!company) return adminJsonError("Empresa não encontrada.", 422, { code: "COMPANY_NOT_FOUND" });
    if (parsed.data.categoryId && !categoryRows[0])
      return adminJsonError("Categoria não encontrada.", 422, { code: "CATEGORY_NOT_FOUND" });

    const channels = validateApplicationChannels(parsed.data);
    const requiresReview = ["SCHEDULED", "PUBLISHED"].includes(parsed.data.publicationStatus);
    const reviewConfirmed = form.get("reviewConfirmed") === "on";
    const quality = evaluateJobPublication({
      title: parsed.data.normalizedTitle,
      companyName: company.name,
      description: content.descriptionHtml,
      cityName: city.name,
      stateCode: state.code,
      categoryName: categoryRows[0]?.name ?? null,
      sourceName: parsed.data.sourceName,
      sourceUrl: parsed.data.sourceUrl ?? null,
      applicationUrl: channels.url.normalized,
      applicationEmail: channels.email.normalized,
      applicationWhatsapp: channels.whatsapp.normalized,
      verificationStatus: requiresReview ? "SOURCE_CONFIRMED" : "NEEDS_REVIEW",
      publicationStatus: parsed.data.publicationStatus,
      expiresAt: parsed.data.expiresAt
    });
    if (requiresReview && (!reviewConfirmed || !quality.valid))
      return adminJsonError("A vaga não passou pela revisão obrigatória.", 422, {
        code: "JOB_PUBLICATION_BLOCKED",
        details: [...(!reviewConfirmed ? ["Confirme a revisão editorial antes de publicar ou agendar."] : []), ...quality.errors]
      });

    const slug = await resolveRequestedJobSlug(
      connection.db,
      parsed.data.slug === "1" ? "" : parsed.data.slug,
      parsed.data.normalizedTitle || parsed.data.originalTitle,
      city.name,
      state.code
    );

    const created = await connection.db.transaction(async (tx) => {
      const [sequence] = await tx.execute(
        sql<{ value: string }>`select nextval('es_job_public_code_seq')::text as value`
      );
      const publicCode = `ES-${String(sequence?.value ?? "0").padStart(6, "0")}`;
      const duplicateHash = createHash("sha256")
        .update(`${parsed.data.normalizedTitle}|${parsed.data.companyId}|${parsed.data.cityId}`)
        .digest("hex");

      const [job] = await tx
        .insert(jobs)
        .values({
          ...parsed.data,
          descriptionHtml: content.descriptionHtml,
          description: content.plainText,
          summary: content.summary,
          activities: [],
          requirements: [],
          benefits: [],
          additionalInfo: null,
          confidentialCompany: unidentifiedCompany || parsed.data.confidentialCompany,
          unidentifiedCompany,
          slug,
          publicCode,
          categoryId: parsed.data.categoryId ?? null,
          neighborhood: normalizeNeighborhood(parsed.data.neighborhood),
          salaryMin: parsed.data.salaryMin?.toString(),
          salaryMax: parsed.data.salaryMax?.toString(),
          salaryVisible:
            optional(form.get("salaryVisible")) === "on" ||
            parsed.data.salaryMin !== undefined ||
            parsed.data.salaryMax !== undefined,
          sourceUrl: parsed.data.sourceUrl ?? null,
          sourceEvidence: parsed.data.sourceEvidence ?? null,
          applicationUrl: channels.url.normalized,
          applicationEmail: channels.email.normalized,
          applicationWhatsapp: channels.whatsapp.normalized,
          applicationWhatsappOriginal: channels.whatsapp.original,
          applicationWhatsappMessage: parsed.data.applicationWhatsappMessage ?? null,
          applicationWhatsappValid: channels.whatsapp.valid,
          applicationWhatsappValidatedAt: channels.whatsapp.original ? new Date() : null,
          applicationWhatsappSource: channels.whatsapp.original ? "MANUAL" : null,
          applicationEmailSubject: parsed.data.applicationEmailSubject ?? null,
          applicationEmailInstructions: parsed.data.applicationInstructions ?? null,
          applicationEmailValid: channels.email.valid,
          applicationEmailValidatedAt: channels.email.original ? new Date() : null,
          applicationEmailSource: channels.email.original ? "MANUAL" : null,
          applicationInstructions: parsed.data.applicationInstructions ?? null,
          applicationType: channels.validTypes.length > 1 ? "MULTIPLE" : channels.validTypes[0] ?? "NONE",
          applicationUrlStatus: channels.url.valid ? "UNCHECKED" : "NOT_APPLICABLE",
          originType: "MANUAL",
          duplicateHash,
          verificationStatus: requiresReview ? "SOURCE_CONFIRMED" : parsed.data.publicationStatus === "PENDING_REVIEW" ? "NEEDS_REVIEW" : "UNVERIFIED",
          reviewedBy: requiresReview ? auth.id : null,
          reviewedAt: requiresReview ? new Date() : null,
          publishedAt: parsed.data.publicationStatus === "PUBLISHED" ? new Date() : null,
          scheduledAt: parsed.data.publicationStatus === "SCHEDULED" ? parsed.data.scheduledAt : null
        })
        .returning();

      if (!job) throw new Error("Falha ao criar vaga.");

      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "CREATE",
        entityType: "JOB",
        entityId: job.id,
        after: job,
        origin: "ADMIN"
      });

      if (job.publicationStatus === "PUBLISHED") {
        const url = new URL(
          `/vagas/${job.slug}`,
          process.env.SITE_URL ?? "https://empregossaoluis.com.br"
        ).toString();
        await tx
          .insert(indexingEvents)
          .values([
            {
              dedupeKey: `manual-create:${job.id}:google`,
              jobId: job.id,
              provider: "GOOGLE",
              url,
              notificationType: "URL_UPDATED"
            },
            {
              dedupeKey: `manual-create:${job.id}:indexnow`,
              jobId: job.id,
              provider: "INDEXNOW",
              url,
              notificationType: "URL_UPDATED"
            }
          ])
          .onConflictDoNothing();
      }

      return job;
    });

    return adminJsonRedirect(`/admin/vagas?created=${created.id}`);
  } catch (error) {
    logServerError("route:/api/admin/jobs", error);
    return adminJsonError("Não foi possível salvar a vaga.", 500);
  } finally {
    await connection.close();
  }
};
