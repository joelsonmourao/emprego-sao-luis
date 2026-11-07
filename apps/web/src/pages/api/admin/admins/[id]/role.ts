import type { APIRoute } from "astro";
import { auditLogs, createDatabase, roles, userRoles } from "@es/db";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../../lib/auth";
import { canAssignRole, canManageAdmin, canRemoveSuperAdmin, MANAGEABLE_ROLES } from "../../../../../lib/users-admin";

const schema = z.object({ roleKey: z.enum(MANAGEABLE_ROLES) });

export const POST: APIRoute = async ({ params, request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "users.manage")) return new Response("Proibido", { status: 403 });
  if (!params.id || params.id === auth.id || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });

  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return new Response("Papel inválido", { status: 400 });
  if (!canAssignRole(auth.roles, parsed.data.roleKey)) return new Response("Escalada de privilégio bloqueada", { status: 403 });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const targetRoles = await tx.select({ key: roles.key }).from(userRoles).innerJoin(roles, eq(userRoles.roleId, roles.id)).where(eq(userRoles.userId, params.id!));
      const targetRoleKeys = targetRoles.map((r) => r.key);
      if (!canManageAdmin(auth.roles, targetRoleKeys)) throw new Error("Sem permissão para alterar este administrador.");

      if (parsed.data.roleKey !== "SUPER_ADMIN" && targetRoleKeys.includes("SUPER_ADMIN")) {
        const [countRow] = await tx.select({ value: sql<number>`count(distinct ${userRoles.userId})::int` }).from(userRoles).innerJoin(roles, eq(userRoles.roleId, roles.id)).where(eq(roles.key, "SUPER_ADMIN"));
        if (!canRemoveSuperAdmin(auth.roles, countRow?.value ?? 0)) throw new Error("Não é permitido remover o último SUPER_ADMIN.");
      }

      const [newRole] = await tx.select().from(roles).where(eq(roles.key, parsed.data.roleKey)).limit(1);
      if (!newRole) throw new Error("Papel não encontrado.");

      await tx.delete(userRoles).where(eq(userRoles.userId, params.id!));
      await tx.insert(userRoles).values({ userId: params.id!, roleId: newRole.id });

      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "ADMIN_ROLE_CHANGED",
        entityType: "USER",
        entityId: params.id,
        before: { roles: targetRoleKeys },
        after: { role: parsed.data.roleKey, ip: clientAddress },
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
