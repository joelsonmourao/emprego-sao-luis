import type { APIRoute } from "astro";
import { auditLogs, createDatabase, importBatches, importRows } from "@es/db";
import { eq } from "drizzle-orm";
import {
  adminJsonError,
  adminJsonRedirect,
  adminMethodNotAllowed
} from "../../../../../lib/admin-api-response";
import { can } from "../../../../../lib/auth";
import { logServerError } from "../../../../../lib/server-error";

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

/** Remove o lote do histórico (não desfaz vagas já importadas). */
export const POST: APIRoute = async ({ params, locals, clientAddress }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Lote não encontrado.", 404);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [batch] = await connection.db
      .select()
      .from(importBatches)
      .where(eq(importBatches.id, params.id))
      .limit(1);
    if (!batch) return adminJsonError("Lote não encontrado.", 404);
    if (batch.status === "PROCESSING" || batch.status === "PENDING") {
      return adminJsonError("Aguarde o processamento terminar antes de excluir.", 409, {
        code: "IMPORT_BUSY"
      });
    }

    await connection.db.transaction(async (tx) => {
      await tx.delete(importRows).where(eq(importRows.batchId, batch.id));
      await tx.delete(importBatches).where(eq(importBatches.id, batch.id));
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "DELETE_IMPORT_BATCH",
        entityType: "IMPORT_BATCH",
        entityId: batch.id,
        before: {
          fileName: batch.fileName,
          status: batch.status,
          validRows: batch.validRows,
          rejectedRows: batch.rejectedRows
        },
        after: { ip: clientAddress, requestId: locals.requestId },
        origin: "ADMIN"
      });
    });

    return adminJsonRedirect("/admin/vagas/importar?deleted=1", { batchId: batch.id });
  } catch (error) {
    logServerError("route:/api/admin/imports/delete", error);
    return adminJsonError("Não foi possível excluir o lote.", 500);
  } finally {
    await connection.close();
  }
};
