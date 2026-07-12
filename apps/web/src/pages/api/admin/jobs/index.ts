import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import { jobDraftSchema } from "@es/shared";
import { auditLogs, createDatabase, indexingEvents, jobs } from "@es/db";
import { sql } from "drizzle-orm";
import { can } from "../../../../lib/auth";

const optional = (value: FormDataEntryValue | null) => typeof value === "string" && value.trim() ? value.trim() : undefined;
export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const auth = locals.auth!; if (!can(auth, "jobs.create")) return Response.json({ ok: false, error: "Proibido." }, { status: 403 });
  const form = await request.formData();
  const parsed = jobDraftSchema.safeParse({ ...Object.fromEntries(form), categoryId: optional(form.get("categoryId")), sourceUrl: optional(form.get("sourceUrl")), salaryMin: optional(form.get("salaryMin")), salaryMax: optional(form.get("salaryMax")) });
  if (!parsed.success) return Response.json({ ok: false, errors: parsed.error.issues }, { status: 400 });
  if (!process.env.DATABASE_URL) return Response.json({ ok: false, error: "Banco indisponível." }, { status: 503 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const created = await connection.db.transaction(async (tx) => {
      const [sequence] = await tx.execute(sql<{ value: string }>`select nextval('es_job_public_code_seq')::text as value`);
      const publicCode = `ES-${String(sequence?.value ?? "0").padStart(6, "0")}`;
      const duplicateHash = createHash("sha256").update(`${parsed.data.normalizedTitle}|${parsed.data.companyId}|${parsed.data.cityId}`).digest("hex");
      const [job] = await tx.insert(jobs).values({ ...parsed.data, publicCode, categoryId: parsed.data.categoryId ?? null, salaryMin: parsed.data.salaryMin?.toString(), salaryMax: parsed.data.salaryMax?.toString(), salaryVisible: parsed.data.salaryMin !== undefined || parsed.data.salaryMax !== undefined, sourceUrl: parsed.data.sourceUrl ?? null, sourceEvidence: null, originType: "MANUAL", duplicateHash, publishedAt: parsed.data.publicationStatus === "PUBLISHED" ? new Date() : null }).returning();
      if (!job) throw new Error("Falha ao criar vaga.");
      await tx.insert(auditLogs).values({ actorId: auth.id, action: "CREATE", entityType: "JOB", entityId: job.id, after: job, origin: "ADMIN" });
      if (job.publicationStatus === "PUBLISHED") { const url = new URL(`/vagas/${job.slug}`, process.env.SITE_URL ?? "https://empregossaoluis.com.br").toString(); await tx.insert(indexingEvents).values([{ dedupeKey: `manual-create:${job.id}:google`, jobId: job.id, provider: "GOOGLE", url, notificationType: "URL_UPDATED" }, { dedupeKey: `manual-create:${job.id}:indexnow`, jobId: job.id, provider: "INDEXNOW", url, notificationType: "URL_UPDATED" }]).onConflictDoNothing(); }
      return job;
    });
    return redirect(`/admin/vagas?created=${created.id}`, 303);
  } finally { await connection.close(); }
};
