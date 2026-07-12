import type { APIRoute } from "astro";
import { auditLogs, createDatabase, users } from "@es/db";
import { and, desc, eq, gte, ilike, lte } from "drizzle-orm";
import { can } from "../../../../lib/auth";
import { sanitizeAuditPayload } from "../../../../lib/users-admin";

const csv = (value: string) => `"${value.replaceAll('"', '""')}"`;

export const GET: APIRoute = async ({ locals, url }) => {
  const auth = locals.auth!;
  if (!can(auth, "audit.read")) return new Response("Proibido", { status: 403 });
  if (!process.env.DATABASE_URL) return new Response("Banco indisponível", { status: 503 });

  const action = url.searchParams.get("action")?.trim() ?? "";
  const entity = url.searchParams.get("entity")?.trim() ?? "";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const conditions = [];
  if (action) conditions.push(ilike(auditLogs.action, `%${action}%`));
  if (entity) conditions.push(ilike(auditLogs.entityType, `%${entity}%`));
  if (from) conditions.push(gte(auditLogs.createdAt, new Date(from)));
  if (to) conditions.push(lte(auditLogs.createdAt, new Date(`${to}T23:59:59`)));
  const where = conditions.length ? and(...conditions) : undefined;

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const rows = await connection.db
      .select({
        createdAt: auditLogs.createdAt,
        actorEmail: users.email,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        origin: auditLogs.origin,
        after: auditLogs.after
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.actorId, users.id))
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(5000);

    const body = [
      "data,administrador,acao,entidade,origem,detalhes",
      ...rows.map((row) =>
        [
          row.createdAt.toISOString(),
          csv(row.actorEmail ?? "sistema"),
          csv(row.action),
          csv(`${row.entityType}${row.entityId ? `:${row.entityId}` : ""}`),
          csv(row.origin),
          csv(JSON.stringify(sanitizeAuditPayload(row.after)))
        ].join(",")
      )
    ].join("\r\n");

    return new Response(`\uFEFF${body}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="auditoria.csv"' } });
  } finally {
    await connection.close();
  }
};
