import type { APIRoute } from "astro";
import bcrypt from "bcryptjs";
import { auditLogs, createDatabase, roles, userRoles, users } from "@es/db";
import { adminPasswordSchema } from "@es/shared";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../lib/auth";
import { canAssignRole, MANAGEABLE_ROLES } from "../../../../lib/users-admin";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  password: adminPasswordSchema(),
  roleKey: z.enum(MANAGEABLE_ROLES)
});

export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "users.manage")) return new Response("Proibido", { status: 403 });
  if (!process.env.DATABASE_URL) return new Response("Banco indisponível", { status: 503 });

  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) {
    const passwordIssue = parsed.error.issues.find((issue) => issue.path[0] === "password");
    return new Response(passwordIssue?.message ?? "Dados inválidos", { status: 400 });
  }
  if (!canAssignRole(auth.roles, parsed.data.roleKey)) return new Response("Escalada de privilégio bloqueada", { status: 403 });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const [role] = await tx.select().from(roles).where(eq(roles.key, parsed.data.roleKey)).limit(1);
      if (!role) throw new Error("Papel inválido.");

      const passwordHash = await bcrypt.hash(parsed.data.password, 12);
      const [created] = await tx
        .insert(users)
        .values({ email: parsed.data.email.trim().toLowerCase(), name: parsed.data.name, passwordHash, emailVerifiedAt: new Date() })
        .onConflictDoNothing()
        .returning();

      const [user] = created ? [created] : await tx.select().from(users).where(eq(users.email, parsed.data.email.trim().toLowerCase())).limit(1);
      if (!user) throw new Error("Falha ao criar administrador.");

      await tx.insert(userRoles).values({ userId: user.id, roleId: role.id }).onConflictDoNothing();
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "ADMIN_CREATED",
        entityType: "USER",
        entityId: user.id,
        after: { email: user.email, role: parsed.data.roleKey, ip: clientAddress },
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
