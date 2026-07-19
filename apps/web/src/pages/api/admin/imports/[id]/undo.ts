import type { APIRoute } from "astro";
import { z } from "zod";
import { auditLogs, createDatabase, importBatches, importRows, jobs } from "@es/db";
import { and, eq, sql } from "drizzle-orm";
import { can } from "../../../../../lib/auth";
import {
  adminJsonError,
  adminJsonRedirect,
  adminMethodNotAllowed
} from "../../../../../lib/admin-api-response";
import { logServerError } from "../../../../../lib/server-error";

const snapshotSchema = z.object({
  originalTitle: z.string(),
  normalizedTitle: z.string(),
  summary: z.string(),
  description: z.string(),
  descriptionHtml: z.string(),
  employmentType: z.string(),
  workplaceType: z.string(),
  applicationUrl: z.string().nullable(),
  applicationEmail: z.string().nullable().optional(),
  applicationWhatsapp: z.string().nullable().optional(),
  applicationWhatsappOriginal: z.string().nullable().optional(),
  applicationWhatsappMessage: z.string().nullable().optional(),
  applicationEmailSubject: z.string().nullable().optional(),
  applicationInstructions: z.string().nullable().optional(),
  sourceUrl: z.string().nullable(),
  expiresAt: z.string().nullable(),
  salaryMin: z.string().nullable(),
  salaryMax: z.string().nullable(),
  salaryVisible: z.boolean(),
  publicationStatus: z.enum([
    "DRAFT",
    "PENDING_REVIEW",
    "APPROVED",
    "SCHEDULED",
    "PUBLISHED",
    "PAUSED",
    "EXPIRED",
    "CLOSED",
    "REJECTED",
    "DUPLICATE",
    "ARCHIVED"
  ]),
  publishedAt: z.string().nullable(),
  categoryId: z.string().uuid().nullable()
});

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ params, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Não encontrado.", 404);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [batch] = await connection.db
      .select()
      .from(importBatches)
      .where(eq(importBatches.id, params.id))
      .limit(1);
    if (!batch || batch.undoneAt || batch.status !== "COMPLETED") {
      return adminJsonError("Lote não pode ser desfeito.", 409);
    }

    const rows = await connection.db.select().from(importRows).where(eq(importRows.batchId, batch.id));
    await connection.db.transaction(async (tx) => {
      const [locked] = await tx.execute<{ status: string; undone_at: Date | null }>(
        sql`select status, undone_at from es_import_batches where id = ${batch.id} for update`
      );
      if (!locked || locked.status !== "COMPLETED" || locked.undone_at) {
        throw new Error("Lote já foi desfeito ou alterado.");
      }
      for (const row of rows) {
        if (!row.jobId) continue;
        if (row.action === "CREATED") {
          await tx
            .update(jobs)
            .set({
              publicationStatus: "ARCHIVED",
              closedAt: new Date(),
              closureReason: `Lote ${batch.id} desfeito`,
              updatedAt: new Date()
            })
            .where(eq(jobs.id, row.jobId));
        }
        if (row.action === "UPDATED") {
          const snapshot = snapshotSchema.safeParse(row.beforeSnapshot);
          if (!snapshot.success) throw new Error(`Snapshot inválido na linha ${row.rowNumber}`);
          const value = snapshot.data;
          await tx
            .update(jobs)
            .set({
              ...value,
              expiresAt: value.expiresAt ? new Date(value.expiresAt) : null,
              publishedAt: value.publishedAt ? new Date(value.publishedAt) : null,
              updatedAt: new Date()
            })
            .where(eq(jobs.id, row.jobId));
        }
      }
      await tx
        .update(importBatches)
        .set({ undoneAt: new Date(), undoneBy: auth.id, status: "CANCELLED", updatedAt: new Date() })
        .where(and(eq(importBatches.id, batch.id), eq(importBatches.status, "COMPLETED")));
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "UNDO_IMPORT",
        entityType: "IMPORT_BATCH",
        entityId: batch.id,
        after: { rows: rows.length },
        origin: "ADMIN"
      });
    });

    return adminJsonRedirect(`/admin/vagas/importar?batch=${batch.id}&step=resultado`);
  } catch (error) {
    logServerError("route:/api/admin/imports/undo", error);
    return adminJsonError("Não foi possível desfazer o lote.", 500);
  } finally {
    await connection.close();
  }
};
