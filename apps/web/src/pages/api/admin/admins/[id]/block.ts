import type { APIRoute } from "astro";
import { auditLogs, createDatabase, roles, userRoles, users } from "@es/db";
import { eq, sql } from "drizzle-orm";
import { can } from "../../../../../lib/auth";
import { canManageAdmin, canRemoveSuperAdmin } from "../../../../../lib/users-admin";

export const POST: APIRoute = async ({ params, locals, redirect, request }) => {
  const auth = locals.auth!;
  if (!can(auth, "users.manage")) return new Response("Proibido", { status: 403 });
  if (!params.id || params.id === auth.id || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  const form = await request.formData();
  if (form.get("confirm") !== "1") return new Response("Confirmação obrigatória", { status: 400 });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const targetRoles = await tx.select({ key: roles.key }).from(userRoles).innerJoin(roles, eq(userRoles.roleId, roles.id)).where(eq(userRoles.userId, params.id!));
      if (!canManageAdmin(auth.roles, targetRoles.map((r) => r.key))) throw new Error("Sem permissão.");

      if (targetRoles.some((r) => r.key === "SUPER_ADMIN")) {
        const [countRow] = await tx.select({ value: sql<number>`count(distinct ${userRoles.userId})::int` }).from(userRoles).innerJoin(roles, eq(userRoles.roleId, roles.id)).where(eq(roles.key, "SUPER_ADMIN"));
        if (!canRemoveSuperAdmin(auth.roles, countRow?.value ?? 0)) throw new Error("Não é permitido bloquear o último SUPER_ADMIN.");
      }

      const [before] = await tx.select().from(users).where(eq(users.id, params.id!)).limit(1);
      const [after] = await tx.update(users).set({ active: false, updatedAt: new Date() }).where(eq(users.id, params.id!)).returning();
      await tx.insert(auditLogs).values({ actorId: auth.id, action: "ADMIN_BLOCKED", entityType: "USER", entityId: params.id, before, after, origin: "ADMIN" });
    });
    return redirect("/admin/administradores?updated=1", 303);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Falha", { status: 409 });
  } finally {
    await connection.close();
  }
};
