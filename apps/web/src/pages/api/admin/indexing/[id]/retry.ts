import type { APIRoute } from "astro";
import { auditLogs, createDatabase, indexingEvents } from "@es/db";
import { eq } from "drizzle-orm";
import { can } from "../../../../../lib/auth";

export const POST: APIRoute = async ({ params, locals, redirect, clientAddress, request }) => {
  const auth = locals.auth!;
  if (!can(auth, "seo.manage")) return new Response("Proibido", { status: 403 });
  if (!params.id || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [event] = await connection.db.select().from(indexingEvents).where(eq(indexingEvents.id, params.id)).limit(1);
    if (!event) return new Response("Evento não encontrado", { status: 404 });
    const [updated] = await connection.db.update(indexingEvents).set({ status: "PENDING", error: null, updatedAt: new Date() }).where(eq(indexingEvents.id, event.id)).returning();
    await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "INDEXING_RETRY", entityType: "INDEXING_EVENT", entityId: event.id, before: event, after: { record: updated, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
    return redirect("/admin/seo?retry=1", 303);
  } finally {
    await connection.close();
  }
};
