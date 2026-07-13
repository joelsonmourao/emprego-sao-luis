import { randomBytes } from "node:crypto";
import type { APIRoute } from "astro";
import { zEmail } from "@es/shared";
import { z } from "zod";
import { createDatabase, magicLinkTokens, notificationDeliveries, userRoles, users } from "@es/db";
import { eq } from "drizzle-orm";
import { candidateTokenHash } from "../../../lib/candidate-auth";
import { createNotificationQueue } from "../../../lib/notification-queue";

const schema = z.object({ email: zEmail(), name: z.string().trim().min(2).max(120).optional().or(z.literal("")) });

export const POST: APIRoute = async ({ request, url, redirect }) => {
  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  const email = parsed.data.email.toLowerCase();
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(users).values({ email, name: parsed.data.name || email.split("@")[0]!, active: true }).onConflictDoNothing();
    const [user] = await connection.db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) throw new Error("Usuário não encontrado.");
    const [administrativeRole] = await connection.db.select({ roleId: userRoles.roleId }).from(userRoles).where(eq(userRoles.userId, user.id)).limit(1);
    if (administrativeRole) return redirect("/entrar?status=verifique-email", 303);
    const token = randomBytes(32).toString("base64url");
    await connection.db.insert(magicLinkTokens).values({ userId: user.id, tokenHash: candidateTokenHash(token), expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
    const [delivery] = await connection.db.insert(notificationDeliveries).values({ channel: "EMAIL", template: "MAGIC_LINK" }).returning();
    const queue = createNotificationQueue();
    try {
      await queue.add("email", { deliveryId: delivery!.id, to: email, subject: "Seu acesso — Empregos São Luís", html: `<p>Use o link abaixo em até 15 minutos:</p><p><a href="${new URL(`/acesso?token=${token}`, url.origin)}">Entrar na minha conta</a></p><p>Se não solicitou, ignore.</p>` }, { jobId: delivery!.id, attempts: 5, backoff: { type: "exponential", delay: 5000 } });
    } finally { await queue.close(); }
    return redirect("/entrar?status=verifique-email", 303);
  } finally { await connection.close(); }
};
