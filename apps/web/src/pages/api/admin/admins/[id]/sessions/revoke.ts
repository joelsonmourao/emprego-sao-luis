import type { APIRoute } from "astro";
import { auditLogs, createDatabase, sessions } from "@es/db";
import { eq } from "drizzle-orm";
import { can } from "../../../../../../lib/auth";
import { canManageAdmin } from "../../../../../../lib/users-admin";
import { roles, userRoles } from "@es/db";

export const POST: APIRoute = async ({ params, locals, redirect, clientAddress, request }) => {
  const auth = locals.auth!;
  if (!can(auth, "users.manage")) return new Response("Proibido", { status: 403 });
  if (!params.id || params.id === auth.id || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const targetRoles = await tx.select({ key: roles.key }).from(userRoles).innerJoin(roles, eq(userRoles.roleId, roles.id)).where(eq(userRoles.userId, params.id!));
      if (!canManageAdmin(auth.roles, targetRoles.map((r) => r.key))) throw new Error("Sem permissão.");

      const revoked = await tx.update(sessions).set({ revokedAt: new Date(), updatedAt: new Date() }).where(eq(sessions.userId, params.id!)).returning({ id: sessions.id });
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "ADMIN_SESSIONS_REVOKED",
        entityType: "USER",
        entityId: params.id,
        after: { count: revoked.length, ip: clientAddress, userAgent: request.headers.get("user-agent") },
        origin: "ADMIN"
      });
    });
    return redirect("/admin/administradores?updated=1", 303);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Falha", { status: 409 });
  } finally {
    await connection.close();
  }
};
