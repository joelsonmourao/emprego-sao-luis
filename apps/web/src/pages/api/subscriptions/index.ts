import { createHash, randomBytes } from "node:crypto";
import type { APIRoute } from "astro";
import { zEmail } from "@es/shared";
import { z } from "zod";
import { alerts, consentLogs, createDatabase, notificationDeliveries, subscriptions } from "@es/db";
import { eq } from "drizzle-orm";
import { createNotificationQueue } from "../../../lib/notification-queue";

const schema = z.object({
  email: zEmail(),
  title: z.string().trim().max(120).optional(),
  city: z.string().trim().max(120).optional(),
  category: z.string().trim().max(120).optional(),
  company: z.string().trim().max(120).optional(),
  workplaceType: z.string().trim().max(40).optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "INSTANT"]).default("DAILY"),
  webPush: z.literal("yes").optional(),
  consent: z.literal("yes")
});

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export const POST: APIRoute = async ({ request, clientAddress, url, redirect }) => {
  const { getEditorialPortalMode } = await import("../../../lib/portal-modes");
  const portal = await getEditorialPortalMode();
  if (portal.enabled) {
    return Response.json(
      { ok: false, error: "Cadastro de alertas de vagas temporariamente pausado." },
      { status: 503 }
    );
  }
  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return Response.json({ ok: false, error: "Dados inválidos." }, { status: 400 });
  if (!process.env.DATABASE_URL) return Response.json({ ok: false, error: "Serviço indisponível." }, { status: 503 });
  const email = parsed.data.email.toLowerCase();
  const confirmationToken = randomBytes(32).toString("base64url");
  const unsubscribeToken = randomBytes(32).toString("base64url");
  const filters = {
    title: parsed.data.title || null,
    city: parsed.data.city || null,
    category: parsed.data.category || null,
    company: parsed.data.company || null,
    workplaceType: parsed.data.workplaceType || null,
    webPush: parsed.data.webPush === "yes"
  };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [subscription] = await connection.db.insert(subscriptions).values({
      email,
      status: "PENDING",
      preferences: filters,
      confirmationTokenHash: hash(confirmationToken),
      unsubscribeTokenHash: hash(unsubscribeToken)
    }).onConflictDoUpdate({
      target: subscriptions.email,
      set: { status: "PENDING", preferences: filters, confirmationTokenHash: hash(confirmationToken), unsubscribeTokenHash: hash(unsubscribeToken), unsubscribedAt: null, updatedAt: new Date() }
    }).returning();
    if (!subscription) throw new Error("Falha ao salvar inscrição.");
    await connection.db.delete(alerts).where(eq(alerts.subscriptionId, subscription.id));
    await connection.db.insert(alerts).values({ subscriptionId: subscription.id, name: "Alerta principal", filters, frequency: parsed.data.frequency });
    await connection.db.insert(consentLogs).values({ subjectHash: hash(email), purpose: "JOB_ALERTS_EMAIL", action: "GRANTED", policyVersion: "2026-07-11", source: "PUBLIC_FORM", ipHash: hash(clientAddress || "unknown"), userAgentHash: hash(request.headers.get("user-agent") ?? "unknown") });
    const [delivery] = await connection.db.insert(notificationDeliveries).values({ subscriptionId: subscription.id, channel: "EMAIL", template: "CONFIRM_SUBSCRIPTION" }).returning();
    const queue = createNotificationQueue();
    try {
      await queue.add("email", {
        deliveryId: delivery!.id,
        to: email,
        subject: "Confirme seus alertas — Empregos São Luís",
        html: `<p>Confirme seus alertas:</p><p><a href="${new URL(`/confirmar-alerta?token=${confirmationToken}`, url.origin)}">Confirmar inscrição</a></p><p>Para descadastrar: <a href="${new URL(`/descadastrar?token=${unsubscribeToken}`, url.origin)}">cancelar alertas</a></p>`
      }, { jobId: delivery!.id, attempts: 5, backoff: { type: "exponential", delay: 5000 } });
    } finally {
      await queue.close();
    }
    return redirect("/alertas?status=verifique-email", 303);
  } finally {
    await connection.close();
  }
};
