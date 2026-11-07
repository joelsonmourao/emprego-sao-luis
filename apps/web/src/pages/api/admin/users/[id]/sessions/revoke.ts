import type { APIRoute } from "astro";
import { auditLogs, candidateSessions, createDatabase } from "@es/db";
import { eq } from "drizzle-orm";
import { can } from "../../../../../../lib/auth";

export const POST: APIRoute = async ({ params, locals, redirect, clientAddress, request }) => {
  const auth = locals.auth!;
  if (!can(auth, "users.manage")) return new Response("Proibido", { status: 403 });
  if (!params.id || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const revoked = await tx.update(candidateSessions).set({ revokedAt: new Date(), updatedAt: new Date() }).where(eq(candidateSessions.userId, params.id!)).returning({ id: candidateSessions.id });
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "USER_SESSIONS_REVOKED",
        entityType: "USER",
        entityId: params.id,
        after: { count: revoked.length, ip: clientAddress, userAgent: request.headers.get("user-agent") },
        origin: "ADMIN"
      });
    });
    return redirect("/admin/usuarios?updated=1", 303);
  } finally {
    await connection.close();
  }
};
