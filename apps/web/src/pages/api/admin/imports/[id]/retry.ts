import type { APIRoute } from "astro";
import { auditLogs, createDatabase, importBatches } from "@es/db";
import { eq } from "drizzle-orm";
import {
  adminJsonError,
  adminJsonRedirect,
  adminMethodNotAllowed
} from "../../../../../lib/admin-api-response";
import { can } from "../../../../../lib/auth";

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ params, locals, clientAddress }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Lote não encontrado.", 404);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [failed] = await connection.db
      .select()
      .from(importBatches)
      .where(eq(importBatches.id, params.id))
      .limit(1);
    if (!failed || failed.status !== "FAILED") {
      return adminJsonError("Somente lotes falhos podem ser reprocessados.", 409, {
        code: "IMPORT_NOT_RETRYABLE"
      });
    }
    const previousSettings = typeof failed.settings === "object" && failed.settings ? failed.settings : {};
    const storageKey =
      typeof (previousSettings as Record<string, unknown>).storageKey === "string"
        ? String((previousSettings as Record<string, unknown>).storageKey)
        : "";
    if (!storageKey)
      return adminJsonError("Arquivo original indisponível para nova tentativa.", 409, {
        code: "IMPORT_FILE_UNAVAILABLE"
      });

    const next = await connection.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(importBatches)
        .values({
          fileHash: failed.fileHash,
          fileName: failed.fileName,
          createdBy: auth.id,
          settings: {
            ...previousSettings,
            stage: "CONFIGURE",
            analysisValid: false,
            retryOf: failed.id,
            error: null,
            failureRequestId: null,
            failedAt: null
          }
        })
        .returning();
      if (!created) throw new Error("Falha ao criar nova tentativa.");
      await tx
        .update(importBatches)
        .set({
          status: "CANCELLED",
          settings: {
            ...previousSettings,
            stage: "ARCHIVED_FAILED",
            archivedAt: new Date().toISOString(),
            archivedReason: "Reprocessamento solicitado.",
            supersededBy: created.id
          },
          updatedAt: new Date()
        })
        .where(eq(importBatches.id, failed.id));
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "RETRY_IMPORT",
        entityType: "IMPORT_BATCH",
        entityId: created.id,
        before: { failedBatchId: failed.id },
        after: { newBatchId: created.id, ip: clientAddress, requestId: locals.requestId },
        origin: "ADMIN"
      });
      return created;
    });
    return adminJsonRedirect(`/admin/vagas/importar?batch=${next.id}&step=mapear&retry=1`, {
      batchId: next.id,
      retryOf: failed.id
    });
  } finally {
    await connection.close();
  }
};
