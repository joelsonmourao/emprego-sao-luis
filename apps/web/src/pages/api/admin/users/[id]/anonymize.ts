import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import { auditLogs, candidateSessions, createDatabase, savedJobs, sessions, userJobPreferences, users } from "@es/db";
import { eq } from "drizzle-orm";
import { can } from "../../../../../lib/auth";
import { isPortalUser } from "../../../../../lib/users-admin";
import { roles, userRoles } from "@es/db";

export const POST: APIRoute = async ({ params, locals, redirect, request }) => {
  const auth = locals.auth!;
  if (!can(auth, "users.manage")) return new Response("Proibido", { status: 403 });
  if (!params.id || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  const form = await request.formData();
  if (form.get("confirm") !== "lgpd") return new Response("Confirmação LGPD obrigatória", { status: 400 });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const [before] = await tx.select().from(users).where(eq(users.id, params.id!)).limit(1);
      if (!before) throw new Error("Usuário não encontrado.");

      const roleRows = await tx.select({ key: roles.key }).from(userRoles).innerJoin(roles, eq(userRoles.roleId, roles.id)).where(eq(userRoles.userId, params.id!));
      if (!isPortalUser(roleRows.map((r) => r.key))) throw new Error("Somente usuários do portal podem ser anonimizados por esta ação.");

      const anonEmail = `anon-${createHash("sha256").update(params.id!).digest("hex").slice(0, 16)}@redacted.local`;
      const [after] = await tx
        .update(users)
        .set({ email: anonEmail, name: "Usuário anonimizado", passwordHash: null, active: false, mfaEnabled: false, mfaSecretEncrypted: null, recoveryCodeHashes: [], updatedAt: new Date() })
        .where(eq(users.id, params.id!))
        .returning();

      await tx.update(candidateSessions).set({ revokedAt: new Date(), updatedAt: new Date() }).where(eq(candidateSessions.userId, params.id!));
      await tx.update(sessions).set({ revokedAt: new Date(), updatedAt: new Date() }).where(eq(sessions.userId, params.id!));
      await tx.delete(savedJobs).where(eq(savedJobs.userId, params.id!));
      await tx.delete(userJobPreferences).where(eq(userJobPreferences.userId, params.id!));

      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "USER_ANONYMIZED",
        entityType: "USER",
        entityId: params.id,
        before: { id: before.id, emailHash: createHash("sha256").update(before.email).digest("hex").slice(0, 16) },
        after: { id: after?.id, email: anonEmail },
        origin: "ADMIN"
      });
    });
    return redirect("/admin/usuarios?updated=1", 303);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Falha", { status: 409 });
  } finally {
    await connection.close();
  }
};
