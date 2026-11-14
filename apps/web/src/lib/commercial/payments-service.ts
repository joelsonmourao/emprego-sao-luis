import {
  auditLogs,
  commercialOrders,
  commercialPaymentEvents,
  commercialPayments,
  commercialPlans,
  companyCredits,
  createDatabase
} from "@es/db";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { appendTimeline, type PaymentStatus } from "./constants";

function sanitizePayload(payload: unknown) {
  if (!payload || typeof payload !== "object") return {};
  const clone = { ...(payload as Record<string, unknown>) };
  for (const key of Object.keys(clone)) {
    if (/token|secret|password|authorization/i.test(key)) delete clone[key];
  }
  return clone;
}

export async function grantCreditsOnce(orderId: string, actorId?: string) {
  if (!process.env.DATABASE_URL) return false;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    let granted = false;
    await connection.db.transaction(async (tx) => {
      const [existing] = await tx.select({ value: count() }).from(companyCredits).where(eq(companyCredits.orderId, orderId));
      if ((existing?.value ?? 0) > 0) return;
      const [order] = await tx.select().from(commercialOrders).where(eq(commercialOrders.id, orderId)).limit(1);
      if (!order || order.status !== "PAID") return;
      const [plan] = await tx.select().from(commercialPlans).where(eq(commercialPlans.id, order.planId)).limit(1);
      if (!plan) return;
      const expiresAt = new Date(Date.now() + plan.creditValidityDays * 86400000);
      await tx.insert(companyCredits).values({
        orderId: order.id,
        companyId: order.companyId,
        email: order.email,
        planId: plan.id,
        totalCredits: plan.jobCredits,
        usedCredits: 0,
        expiresAt,
        grantedBy: actorId ?? null
      });
      granted = true;
    });
    return granted;
  } finally {
    await connection.close();
  }
}

export async function markOrderPaid(orderCode: string, actorId?: string, reason?: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const [order] = await tx.select().from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
      if (!order || order.status === "PAID") return;
      const timeline = appendTimeline(order.timeline, { type: "ORDER_PAID", reason: reason ?? null, actorId: actorId ?? null });
      await tx.update(commercialOrders).set({ status: "PAID", paidAt: new Date(), timeline, updatedAt: new Date() }).where(eq(commercialOrders.id, order.id));
    });
    await grantCreditsOnce((await getOrderIdByCode(orderCode))!, actorId);
  } finally {
    await connection.close();
  }
}

async function getOrderIdByCode(orderCode: string) {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [order] = await connection.db.select({ id: commercialOrders.id }).from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
    return order?.id ?? null;
  } finally {
    await connection.close();
  }
}

export async function updatePaymentStatus(paymentId: string, status: PaymentStatus, meta: {
  externalId?: string;
  error?: string;
  actorId?: string;
  reason?: string;
  webhookPayload?: unknown;
} = {}) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const [payment] = await tx.select().from(commercialPayments).where(eq(commercialPayments.id, paymentId)).limit(1);
      if (!payment) return;
      const [order] = await tx.select().from(commercialOrders).where(eq(commercialOrders.id, payment.orderId)).limit(1);
      if (!order) return;
      await tx.update(commercialPayments).set({
        status,
        ...(meta.externalId ? { externalId: meta.externalId } : {}),
        ...(meta.error ? { lastError: meta.error.slice(0, 500) } : {}),
        ...(status === "PAID" ? { approvedAt: new Date(), approvedBy: meta.actorId ?? null } : {}),
        ...(status === "FAILED" ? { refusedAt: new Date() } : {}),
        ...(meta.webhookPayload ? { webhookPayload: sanitizePayload(meta.webhookPayload) } : {}),
        attemptCount: sql`${commercialPayments.attemptCount} + 1`,
        updatedAt: new Date()
      }).where(eq(commercialPayments.id, paymentId));

      if (status === "PAID") {
        const timeline = appendTimeline(order.timeline, { type: "PAYMENT_PAID", paymentId, actorId: meta.actorId ?? null });
        await tx.update(commercialOrders).set({ status: "PAID", paidAt: new Date(), timeline, updatedAt: new Date() }).where(eq(commercialOrders.id, order.id));
      } else if (status === "MANUAL_REVIEW") {
        const timeline = appendTimeline(order.timeline, { type: "MANUAL_REVIEW", paymentId });
        await tx.update(commercialOrders).set({ status: "MANUAL_REVIEW", timeline, updatedAt: new Date() }).where(eq(commercialOrders.id, order.id));
      } else if (status === "FAILED") {
        const timeline = appendTimeline(order.timeline, { type: "PAYMENT_FAILED", paymentId, error: meta.error ?? null });
        await tx.update(commercialOrders).set({ timeline, updatedAt: new Date() }).where(eq(commercialOrders.id, order.id));
      }

      await tx.insert(auditLogs).values({
        actorId: meta.actorId,
        action: `PAYMENT_STATUS_${status}`,
        entityType: "COMMERCIAL_PAYMENT",
        entityId: paymentId,
        after: { status, orderCode: order.orderCode, reason: meta.reason ?? null },
        origin: meta.actorId ? "ADMIN" : "WEBHOOK"
      });
    });
    if (status === "PAID") {
      const [payment] = await connection.db.select().from(commercialPayments).where(eq(commercialPayments.id, paymentId)).limit(1);
      if (payment) await grantCreditsOnce(payment.orderId, meta.actorId);
    }
  } finally {
    await connection.close();
  }
}

export async function recordWebhookEvent(input: {
  idempotencyKey: string;
  eventType: string;
  paymentId?: string;
  orderId?: string;
  payload: unknown;
}) {
  if (!process.env.DATABASE_URL) return { duplicate: false, processed: false };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [existing] = await connection.db
      .select()
      .from(commercialPaymentEvents)
      .where(eq(commercialPaymentEvents.idempotencyKey, input.idempotencyKey))
      .limit(1);
    if (existing) return { duplicate: true, processed: existing.processed };

    const [event] = await connection.db
      .insert(commercialPaymentEvents)
      .values({
        idempotencyKey: input.idempotencyKey,
        eventType: input.eventType,
        paymentId: input.paymentId ?? null,
        orderId: input.orderId ?? null,
        payload: sanitizePayload(input.payload)
      })
      .returning();
    return { duplicate: false, processed: false, eventId: event!.id };
  } finally {
    await connection.close();
  }
}

export async function approvePaymentManual(paymentId: string, input: {
  actorId: string;
  reason: string;
  confirmedAmount: string;
  method: string;
}) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [payment] = await connection.db.select().from(commercialPayments).where(eq(commercialPayments.id, paymentId)).limit(1);
    if (!payment) throw new Error("Pagamento não encontrado.");
    if (payment.status === "PAID") throw new Error("Pagamento já aprovado.");
    if (Number(payment.amount) !== Number(input.confirmedAmount)) throw new Error("Valor confirmado não confere com o pedido.");
    await connection.db.update(commercialPayments).set({
      manualReason: input.reason,
      method: input.method,
      manualProofUrl: payment.manualProofUrl
    }).where(eq(commercialPayments.id, paymentId));
  } finally {
    await connection.close();
  }
  await updatePaymentStatus(paymentId, "PAID", { actorId: input.actorId, reason: input.reason });
  return true;
}

export async function rejectPaymentManual(paymentId: string, input: { actorId: string; reason: string }) {
  await updatePaymentStatus(paymentId, "FAILED", { actorId: input.actorId, reason: input.reason, error: input.reason });
}

export async function listPaymentsAdmin(options: { q?: string; status?: string; page?: number; pageSize?: number } = {}) {
  if (!process.env.DATABASE_URL) return { items: [], total: 0 };
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, options.pageSize ?? 20);
  const offset = (page - 1) * pageSize;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const filters = [];
    if (options.status) filters.push(eq(commercialPayments.status, options.status));
    const where = filters.length ? and(...filters) : undefined;
    const [totalRow] = await connection.db.select({ value: count() }).from(commercialPayments).where(where);
    const payments = await connection.db.select().from(commercialPayments).where(where).orderBy(desc(commercialPayments.createdAt)).limit(pageSize).offset(offset);
    const items = [];
    for (const payment of payments) {
      const [order] = await connection.db.select().from(commercialOrders).where(eq(commercialOrders.id, payment.orderId)).limit(1);
      if (options.q?.trim()) {
        const term = options.q.trim().toLowerCase();
        const match = order?.orderCode.toLowerCase().includes(term) || order?.companyName.toLowerCase().includes(term);
        if (!match) continue;
      }
      items.push({ payment, order: order ?? null });
    }
    return { items, total: totalRow?.value ?? 0, page, pageSize };
  } finally {
    await connection.close();
  }
}

export async function submitManualProof(orderCode: string, proofUrl: string) {
  if (!process.env.DATABASE_URL) throw new Error("Serviço indisponível.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [order] = await connection.db.select().from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
    if (!order) throw new Error("Pedido não encontrado.");
    const idempotencyKey = `manual-${order.id}-${Date.now()}`;
    const [payment] = await connection.db.insert(commercialPayments).values({
      orderId: order.id,
      idempotencyKey,
      amount: order.amount,
      method: "pix_manual",
      provider: "manual",
      status: "MANUAL_REVIEW",
      manualProofUrl: proofUrl,
      expiresAt: order.expiresAt
    }).returning();
    const timeline = appendTimeline(order.timeline, { type: "MANUAL_PROOF_SUBMITTED", paymentId: payment!.id });
    await connection.db.update(commercialOrders).set({ status: "MANUAL_REVIEW", timeline, updatedAt: new Date() }).where(eq(commercialOrders.id, order.id));
    return payment!;
  } finally {
    await connection.close();
  }
}

export async function countPaymentsByStatus(status: PaymentStatus) {
  if (!process.env.DATABASE_URL) return 0;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select({ value: count() }).from(commercialPayments).where(eq(commercialPayments.status, status));
    return row?.value ?? 0;
  } finally {
    await connection.close();
  }
}
