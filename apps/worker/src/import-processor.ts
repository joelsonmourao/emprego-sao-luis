import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { categories, cities, companies, createDatabase, importBatches, importRows, indexingEvents, jobs, states } from "@es/db";
import { importJobRowSchema, importModeSchema, normalizeImportRow } from "@es/shared";
import * as XLSX from "xlsx";
import { getPrivateObject } from "./storage.js";

interface ImportPayload { batchId: string; storageKey: string; mode: string }
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 150);
export async function processImport(payload: ImportPayload) {
  const mode = importModeSchema.parse(payload.mode); const databaseUrl = process.env.DATABASE_URL; if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(databaseUrl); await connection.db.update(importBatches).set({ status: "PROCESSING", updatedAt: new Date() }).where(eq(importBatches.id, payload.batchId));
  try {
    const bytes = await getPrivateObject(payload.storageKey); const workbook = XLSX.read(bytes, { type: "array", cellDates: true });
    const rawRows = workbook.SheetNames.flatMap((sheetName) => { const sheet = workbook.Sheets[sheetName]; return sheet ? XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" }).map((row) => ({ ...row, __sheet: sheetName })) : []; });
    await connection.db.delete(importRows).where(eq(importRows.batchId, payload.batchId)); let validRows = 0; let rejectedRows = 0;
    for (const [position, raw] of rawRows.entries()) {
      const normalized = normalizeImportRow(raw); const parsed = importJobRowSchema.safeParse(normalized);
      if (!parsed.success) { rejectedRows++; await connection.db.insert(importRows).values({ batchId: payload.batchId, rowNumber: position + 2, raw, normalized, errors: parsed.error.issues, action: "REJECTED" }); continue; }
      const value = parsed.data;
      const [company] = await connection.db.select().from(companies).where(sql`lower(${companies.name}) = lower(${value.company})`).limit(1);
      const [state] = await connection.db.select().from(states).where(eq(states.code, value.state)).limit(1);
      const [city] = state ? await connection.db.select().from(cities).where(and(eq(cities.stateId, state.id), sql`lower(${cities.name}) = lower(${value.city})`)).limit(1) : [];
      const [category] = value.category ? await connection.db.select().from(categories).where(sql`lower(${categories.name}) = lower(${value.category})`).limit(1) : [];
      const relationErrors = [!company ? "Empresa não cadastrada." : null, !state ? "UF não cadastrada." : null, !city ? "Cidade não cadastrada." : null].filter((item): item is string => item !== null);
      if (relationErrors.length) { rejectedRows++; await connection.db.insert(importRows).values({ batchId: payload.batchId, rowNumber: position + 2, raw, normalized: value, errors: relationErrors, action: "REJECTED" }); continue; }
      const duplicateHash = createHash("sha256").update(`${value.title}|${company!.id}|${city!.id}`).digest("hex");
      const [duplicate] = await connection.db.select({ id: jobs.id }).from(jobs).where(eq(jobs.duplicateHash, duplicateHash)).limit(1);
      const [existing] = value.externalId ? await connection.db.select().from(jobs).where(and(eq(jobs.externalId, value.externalId), eq(jobs.sourceName, value.source))).limit(1) : [];
      if (duplicate && !value.externalId) { rejectedRows++; await connection.db.insert(importRows).values({ batchId: payload.batchId, rowNumber: position + 2, raw, normalized: value, errors: ["Vaga duplicada."], action: "DUPLICATE", jobId: duplicate.id }); continue; }
      if (mode === "DRY_RUN") { validRows++; await connection.db.insert(importRows).values({ batchId: payload.batchId, rowNumber: position + 2, raw, normalized: value, errors: [], action: existing ? "WOULD_UPDATE" : "WOULD_CREATE", jobId: existing?.id }); continue; }
      const beforeSnapshot = existing ? { originalTitle: existing.originalTitle, normalizedTitle: existing.normalizedTitle, summary: existing.summary, description: existing.description, employmentType: existing.employmentType, workplaceType: existing.workplaceType, applicationUrl: existing.applicationUrl, sourceUrl: existing.sourceUrl, expiresAt: existing.expiresAt?.toISOString() ?? null, salaryMin: existing.salaryMin, salaryMax: existing.salaryMax, salaryVisible: existing.salaryVisible, publicationStatus: existing.publicationStatus, publishedAt: existing.publishedAt?.toISOString() ?? null, categoryId: existing.categoryId } : null;
      const job = await connection.db.transaction(async (tx) => {
        const [sequence] = await tx.execute(sql<{ value: string }>`select nextval('es_job_public_code_seq')::text as value`); const publicCode = `ES-${String(sequence?.value ?? "0").padStart(6, "0")}`;
        const slug = `${slugify(`${value.title}-${value.company}-${value.city}`)}-${duplicateHash.slice(0, 8)}`;
        const row = { publicCode, externalId: value.externalId ?? null, slug, originalTitle: value.title, normalizedTitle: value.title, companyId: company!.id, cityId: city!.id, stateId: state!.id, categoryId: category?.id ?? null, employmentType: value.employmentType, workplaceType: value.workplaceType, summary: value.description.slice(0, 500), description: value.description, applicationUrl: value.applyUrl, sourceName: value.source, sourceUrl: value.sourceUrl ?? null, originType: "SPREADSHEET" as const, duplicateHash, verificationStatus: "NEEDS_REVIEW" as const, publicationStatus: mode, publishedAt: mode === "PUBLISHED" ? new Date() : null, expiresAt: value.expiresAt, salaryMin: value.salaryMin?.toString() ?? null, salaryMax: value.salaryMax?.toString() ?? null, salaryVisible: value.salaryMin !== undefined || value.salaryMax !== undefined };
        if (value.externalId) { const [saved] = await tx.insert(jobs).values(row).onConflictDoUpdate({ target: [jobs.externalId, jobs.sourceName], set: { ...row, publicCode: sql`${jobs.publicCode}`, slug: sql`${jobs.slug}`, updatedAt: new Date() } }).returning(); return saved; }
        const [saved] = await tx.insert(jobs).values(row).returning(); return saved;
      });
      validRows++; await connection.db.insert(importRows).values({ batchId: payload.batchId, rowNumber: position + 2, raw, normalized: value, errors: [], action: existing ? "UPDATED" : "CREATED", beforeSnapshot, jobId: job?.id });
      if (mode === "PUBLISHED" && job) { const url = new URL(`/vagas/${job.slug}`, process.env.SITE_URL ?? "https://empregossaoluis.com.br").toString(); await connection.db.insert(indexingEvents).values([{ dedupeKey: `import:${payload.batchId}:${position + 2}:google`, jobId: job.id, provider: "GOOGLE", url, notificationType: "URL_UPDATED" }, { dedupeKey: `import:${payload.batchId}:${position + 2}:indexnow`, jobId: job.id, provider: "INDEXNOW", url, notificationType: "URL_UPDATED" }]).onConflictDoNothing(); }
    }
    await connection.db.update(importBatches).set({ status: "COMPLETED", totalRows: rawRows.length, validRows, rejectedRows, updatedAt: new Date() }).where(eq(importBatches.id, payload.batchId));
    return { totalRows: rawRows.length, validRows, rejectedRows };
  } catch (error) { await connection.db.update(importBatches).set({ status: "FAILED", settings: { storageKey: payload.storageKey, mode, error: error instanceof Error ? error.message : "Erro desconhecido" }, updatedAt: new Date() }).where(eq(importBatches.id, payload.batchId)); throw error; }
  finally { await connection.close(); }
}
