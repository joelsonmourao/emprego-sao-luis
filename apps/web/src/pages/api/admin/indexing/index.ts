import type { APIRoute } from "astro";
import { createDatabase, indexingEvents } from "@es/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../lib/auth";

const querySchema = z.object({ status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"]).optional(), provider: z.enum(["GOOGLE", "INDEXNOW"]).optional(), page: z.coerce.number().int().min(1).default(1) });

export const GET: APIRoute = async ({ request, locals }) => {
  if (!can(locals.auth!, "seo.manage")) return new Response("Proibido", { status: 403 });
  if (!process.env.DATABASE_URL) return Response.json({ items: [], total: 0, page: 1 });
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return new Response("Filtros inválidos", { status: 400 });
  const limit = 25;
  const offset = (parsed.data.page - 1) * limit;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const filters = [parsed.data.status ? eq(indexingEvents.status, parsed.data.status) : undefined, parsed.data.provider ? eq(indexingEvents.provider, parsed.data.provider) : undefined].filter(Boolean);
    const where = filters.length ? and(...filters) : undefined;
    const [items, [countRow]] = await Promise.all([
      connection.db.select().from(indexingEvents).where(where).orderBy(desc(indexingEvents.createdAt)).limit(limit).offset(offset),
      connection.db.select({ value: sql<number>`count(*)::int` }).from(indexingEvents).where(where)
    ]);
    return Response.json({ items, total: countRow?.value ?? 0, page: parsed.data.page, pageSize: limit });
  } finally {
    await connection.close();
  }
};
