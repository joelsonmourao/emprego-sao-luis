import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import { jobDraftSchema } from "@es/shared";
import { auditLogs, cities, createDatabase, indexingEvents, jobs, states } from "@es/db";
import { eq, sql } from "drizzle-orm";
import { can } from "../../../../lib/auth";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../../lib/admin-api-response";
import { logServerError } from "../../../../lib/server-error";
import { resolveUniqueJobSlug } from "../../../../lib/job-slug";

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
    const [city] = await connection.db
      .select({ name: cities.name })
      .from(cities)
      .where(eq(cities.id, parsed.data.cityId))
      .limit(1);
    const [state] = await connection.db
      .select({ code: states.code })
      .from(states)
      .where(eq(states.id, parsed.data.stateId))
      .limit(1);

    const slug =
      parsed.data.slug && parsed.data.slug !== "1"
        ? parsed.data.slug
        : await resolveUniqueJobSlug(
            connection.db,
            parsed.data.normalizedTitle || parsed.data.originalTitle,
            city?.name,
            state?.code
          );

    const created = await connection.db.transaction(async (tx) => {
      const [sequence] = await tx.execute(sql<{ value: string }>`select nextval('es_job_public_code_seq')::text as value`);
      const publicCode = `ES-${String(sequence?.value ?? "0").padStart(6, "0")}`;
      const duplicateHash = createHash("sha256")
        .update(`${parsed.data.normalizedTitle}|${parsed.data.companyId}|${parsed.data.cityId}`)
        .digest("hex");

      const [job] = await tx
        .insert(jobs)
        .values({
          ...parsed.data,
          slug,
          publicCode,
          categoryId: parsed.data.categoryId ?? null,
          salaryMin: parsed.data.salaryMin?.toString(),
          salaryMax: parsed.data.salaryMax?.toString(),
          salaryVisible:
            optional(form.get("salaryVisible")) === "on" ||
            parsed.data.salaryMin !== undefined ||
            parsed.data.salaryMax !== undefined,
          sourceUrl: parsed.data.sourceUrl ?? null,
          sourceEvidence: null,
          originType: "MANUAL",
          duplicateHash,
          publishedAt: parsed.data.publicationStatus === "PUBLISHED" ? new Date() : null
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
        const url = new URL(`/vagas/${job.slug}`, process.env.SITE_URL ?? "https://empregossaoluis.com.br").toString();
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
