import type { APIRoute } from "astro";
import { auditLogs, createDatabase, permissions, rolePermissions, roles } from "@es/db";
import { eq } from "drizzle-orm";
import { can } from "../../../../lib/auth";
import { sanitizeAuditPayload } from "../../../../lib/users-admin";

export const POST: APIRoute = async ({ params, request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "users.manage")) return new Response("Proibido", { status: 403 });
  if (!auth.roles.includes("SUPER_ADMIN") && !auth.roles.includes("ADMIN")) return new Response("Proibido", { status: 403 });
  if (!params.roleId || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });

  const form = await request.formData();
  const selected = form.getAll("permission").map(String);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const [role] = await tx.select().from(roles).where(eq(roles.id, params.roleId!)).limit(1);
      if (!role || role.key === "SUPER_ADMIN") throw new Error("Papel protegido.");

      const beforeLinks = await tx
        .select({ permissionKey: permissions.key })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, role.id));
      const before = beforeLinks.map((l) => l.permissionKey);

      const allPermissions = await tx.select().from(permissions);
      const selectedIds = allPermissions.filter((p) => selected.includes(p.key)).map((p) => p.id);
      await tx.delete(rolePermissions).where(eq(rolePermissions.roleId, role.id));
      if (selectedIds.length) {
        await tx.insert(rolePermissions).values(selectedIds.map((permissionId) => ({ roleId: role.id, permissionId })));
      }

      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "ROLE_PERMISSIONS_UPDATED",
        entityType: "ROLE",
        entityId: role.id,
        before: sanitizeAuditPayload({ role: role.key, permissions: before }),
        after: sanitizeAuditPayload({ role: role.key, permissions: selected, ip: clientAddress }),
        origin: "ADMIN"
      });
    });
    return redirect("/admin/permissoes?updated=1", 303);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Falha", { status: 409 });
  } finally {
    await connection.close();
  }
};
