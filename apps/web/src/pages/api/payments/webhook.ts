import type { APIRoute } from "astro";
import { createDatabase, commercialOrders, commercialPayments } from "@es/db";
import { eq } from "drizzle-orm";
import { getConfiguredGateway } from "../../../lib/payments/gateway";
import { recordWebhookEvent, updatePaymentStatus } from "../../../lib/commercial/payments-service";

export const POST: APIRoute = async ({ request }) => {
  const gateway = getConfiguredGateway();
  if (!gateway) return new Response("Gateway não configurado", { status: 503 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    payload = Object.fromEntries(await request.formData());
  }

  const paymentId = String((payload as { data?: { id?: string } }).data?.id ?? "");
  const idempotencyKey = `webhook-${gateway.provider}-${paymentId || JSON.stringify(payload).slice(0, 40)}`;
  const event = await recordWebhookEvent({
    idempotencyKey,
    eventType: String((payload as { type?: string }).type ?? "webhook"),
    payload
  });
  if (event.duplicate) return new Response("Duplicate", { status: 200 });

  const result = await gateway.handleWebhook(payload);
  if (result.status === "ignored" || result.status === "error") return new Response("Ignored", { status: 200 });
  if (!result.orderCode) return new Response("No order", { status: 200 });

  if (!process.env.DATABASE_URL) return new Response("No DB", { status: 503 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [order] = await connection.db.select().from(commercialOrders).where(eq(commercialOrders.orderCode, result.orderCode)).limit(1);
    if (!order) return new Response("Order not found", { status: 200 });
    const [payment] = await connection.db.select().from(commercialPayments).where(eq(commercialPayments.orderId, order.id)).orderBy(commercialPayments.createdAt).limit(1);
    if (!payment) return new Response("Payment not found", { status: 200 });

    if (result.status === "approved") {
      await updatePaymentStatus(payment.id, "PAID", { externalId: result.externalId, webhookPayload: payload });
    } else if (result.status === "refused") {
      await updatePaymentStatus(payment.id, "FAILED", { externalId: result.externalId, webhookPayload: payload, error: "Pagamento recusado" });
    } else {
      await updatePaymentStatus(payment.id, "PROCESSING", { externalId: result.externalId, webhookPayload: payload });
    }
  } finally {
    await connection.close();
  }

  return new Response("OK", { status: 200 });
};
