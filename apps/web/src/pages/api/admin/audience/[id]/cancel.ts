import type { APIRoute } from "astro";
import { auditLogs, consentLogs, createDatabase, subscriptions } from "@es/db";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { can } from "../../../../../lib/auth";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export const POST: APIRoute = async ({ params, locals, redirect, clientAddress, request }) => {
  const auth = locals.auth!;
  if (!can(auth, "audience.manage")) return new Response("Proibido", { status: 403 });
  if (!params.id || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [before] = await connection.db.select().from(subscriptions).where(eq(subscriptions.id, params.id)).limit(1);
    if (!before) return new Response("Inscrição não encontrada", { status: 404 });
    const [after] = await connection.db.update(subscriptions).set({ status: "UNSUBSCRIBED", unsubscribedAt: new Date(), updatedAt: new Date() }).where(eq(subscriptions.id, before.id)).returning();
    await connection.db.insert(consentLogs).values({ subjectHash: hash(before.email), purpose: "JOB_ALERTS_EMAIL", action: "REVOKED", policyVersion: "2026-07-11", source: "ADMIN_CANCEL", ipHash: hash(clientAddress || "unknown") });
    await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "SUBSCRIPTION_CANCEL", entityType: "SUBSCRIPTION", entityId: before.id, before, after: { record: after, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
    return redirect("/admin/audiencia?cancelled=1", 303);
  } finally {
    await connection.close();
  }
};
