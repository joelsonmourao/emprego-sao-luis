import type { APIRoute } from "astro";
import { auditLogs, createDatabase, users } from "@es/db";
import { eq } from "drizzle-orm";
import { can } from "../../../../../lib/auth";

export const POST: APIRoute = async ({ params, locals, redirect, request }) => {
  const auth = locals.auth!;
  if (!can(auth, "users.manage")) return new Response("Proibido", { status: 403 });
  if (!params.id || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  const form = await request.formData();
  if (form.get("confirm") !== "1") return new Response("Confirmação obrigatória", { status: 400 });

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const [before] = await tx.select().from(users).where(eq(users.id, params.id!)).limit(1);
      if (!before) throw new Error("Usuário não encontrado.");
      const [after] = await tx.update(users).set({ active: false, updatedAt: new Date() }).where(eq(users.id, params.id!)).returning();
      await tx.insert(auditLogs).values({ actorId: auth.id, action: "USER_BLOCKED", entityType: "USER", entityId: params.id, before, after, origin: "ADMIN" });
    });
    return redirect("/admin/usuarios?updated=1", 303);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Falha", { status: 409 });
  } finally {
    await connection.close();
  }
};
