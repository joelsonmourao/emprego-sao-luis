import { createHash, randomBytes } from "node:crypto";
import type { APIRoute } from "astro";
import { auditLogs, createDatabase, notificationDeliveries, passwordResetTokens, roles, userRoles, users } from "@es/db";
import { zEmail } from "@es/shared";
import { and, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { ADMIN_PASSWORD_RESET_NEUTRAL_MESSAGE } from "../../../../lib/admin-password-reset";
import { parseJsonBody } from "../../../../lib/json-api";
import { createNotificationQueue } from "../../../../lib/notification-queue";
import { ADMIN_PANEL_ROLES } from "../../../../lib/users-admin";
import { logServerError } from "../../../../lib/server-error";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

const schema = z.object({
  email: zEmail()
});

async function parseBody(request: Request) {
  return parseJsonBody(request, schema);
}

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, error: "Method Not Allowed" }), {
    status: 405,
    headers: { Allow: "POST", "Content-Type": "application/json" }
  });

export const POST: APIRoute = async ({ request, url, clientAddress }) => {
  const parsed = await parseBody(request);
  if (!parsed.ok) {
    return Response.json({ ok: false, error: parsed.error }, { status: parsed.status });
  }

  if (!process.env.DATABASE_URL) {
    logServerError("route:/api/auth/admin-password/request", new Error("DATABASE_URL não configurada."));
    return Response.json({ ok: true, message: ADMIN_PASSWORD_RESET_NEUTRAL_MESSAGE });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const emailHash = hash(email);
  const ipHash = hash(clientAddress || "unknown");
  const connection = createDatabase(process.env.DATABASE_URL);

  try {
    const since = new Date(Date.now() - 15 * 60 * 1000);
    const [ipRate] = await connection.db
      .select({ count: sql<number>`count(*)::int` })
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.action, "ADMIN_PASSWORD_RESET_REQUESTED"),
          sql`${auditLogs.after} @> ${JSON.stringify({ ipHash })}::jsonb`,
          gt(auditLogs.createdAt, since)
        )
      );
    if ((ipRate?.count ?? 0) >= 10) {
      return Response.json({ ok: true, message: ADMIN_PASSWORD_RESET_NEUTRAL_MESSAGE });
    }

    const [user] = await connection.db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(and(eq(users.email, email), eq(users.active, true)))
      .limit(1);

    if (user) {
      const roleRows = await connection.db
        .select({ key: roles.key })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(userRoles.userId, user.id));
      const isAdmin = roleRows.some((row) => (ADMIN_PANEL_ROLES as readonly string[]).includes(row.key));
      if (!isAdmin) {
        return Response.json({ ok: true, message: ADMIN_PASSWORD_RESET_NEUTRAL_MESSAGE });
      }

      const token = randomBytes(32).toString("base64url");
      await connection.db.insert(passwordResetTokens).values({
        userId: user.id,
        tokenHash: hash(token),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      });

      let emailQueued = false;
      if (process.env.REDIS_URL) {
        try {
          const [delivery] = await connection.db
            .insert(notificationDeliveries)
            .values({ channel: "EMAIL", template: "ADMIN_PASSWORD_RESET" })
            .returning();
          const queue = createNotificationQueue();
          try {
            await queue.add(
              "email",
              {
                deliveryId: delivery!.id,
                to: user.email,
                subject: "Redefinição de senha administrativa",
                html: `<p>Use este link em até 15 minutos:</p><p><a href="${new URL(`/admin/redefinir-senha?token=${token}`, url.origin)}">Definir nova senha</a></p><p>Se não solicitou, ignore.</p>`
              },
              { jobId: delivery!.id, attempts: 5 }
            );
            emailQueued = true;
          } finally {
            await queue.close();
          }
        } catch (error) {
          logServerError("route:/api/auth/admin-password/request:email", error);
        }
      } else {
        logServerError("route:/api/auth/admin-password/request", new Error("REDIS_URL não configurada."));
      }

      await connection.db.insert(auditLogs).values({
        actorId: user.id,
        action: "ADMIN_PASSWORD_RESET_REQUESTED",
        entityType: "AUTH",
        entityId: user.id,
        after: {
          emailHash,
          ipHash,
          emailQueued
        },
        origin: "PASSWORD_RESET"
      });

      if (!emailQueued) {
        await connection.db.insert(auditLogs).values({
          actorId: user.id,
          action: "ADMIN_PASSWORD_RESET_EMAIL_UNAVAILABLE",
          entityType: "AUTH",
          entityId: user.id,
          after: { emailHash, ipHash },
          origin: "PASSWORD_RESET"
        });
      }
    }
  } catch (error) {
    logServerError("route:/api/auth/admin-password/request", error);
  } finally {
    await connection.close();
  }

  return Response.json({ ok: true, message: ADMIN_PASSWORD_RESET_NEUTRAL_MESSAGE });
};
