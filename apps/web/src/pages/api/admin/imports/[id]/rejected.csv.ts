import type { APIRoute } from "astro";
import { createDatabase, importBatches, importRows } from "@es/db";
import { and, eq, ne } from "drizzle-orm";
import { can } from "../../../../../lib/auth";
import { adminJsonError } from "../../../../../lib/admin-api-response";

const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.auth || !can(locals.auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Lote não encontrado.", 404);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [batch] = await connection.db
      .select({ status: importBatches.status, rejectedRows: importBatches.rejectedRows })
      .from(importBatches)
      .where(eq(importBatches.id, params.id))
      .limit(1);
    if (!batch) return adminJsonError("Lote não encontrado.", 404);
    if (batch.status !== "COMPLETED" || batch.rejectedRows <= 0) {
      return adminJsonError("Este lote não possui relatório de linhas rejeitadas.", 409, {
        code: "REJECTED_REPORT_UNAVAILABLE"
      });
    }

    const rows = await connection.db
      .select()
      .from(importRows)
      .where(
        and(
          eq(importRows.batchId, params.id),
          ne(importRows.action, "CREATED"),
          ne(importRows.action, "UPDATED"),
          ne(importRows.action, "WOULD_CREATE"),
          ne(importRows.action, "WOULD_UPDATE")
        )
      );
    if (!rows.length) {
      return adminJsonError("O relatório de rejeições não foi gerado.", 409, {
        code: "REJECTED_REPORT_UNAVAILABLE"
      });
    }

    const body = [
      "linha,acao,erros,dados",
      ...rows.map((row) =>
        [row.rowNumber, csv(row.action), csv(JSON.stringify(row.errors)), csv(JSON.stringify(row.raw))].join(
          ","
        )
      )
    ].join("\r\n");
    return new Response(`\uFEFF${body}`, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="rejeitadas-${params.id}.csv"`,
        "cache-control": "private, no-store"
      }
    });
  } finally {
    await connection.close();
  }
};
