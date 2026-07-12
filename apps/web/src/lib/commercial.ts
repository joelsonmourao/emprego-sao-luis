import { commercialOrders, commercialPayments, commercialPlans, companyCredits, createDatabase } from "@es/db";
import { and, asc, desc, eq, gt, sql } from "drizzle-orm";
import { getConfiguredGateway, isPaymentAvailable } from "./payments/gateway";

export async function listActivePlans() {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    return connection.db
      .select()
      .from(commercialPlans)
      .where(eq(commercialPlans.active, true))
      .orderBy(asc(commercialPlans.sortOrder), asc(commercialPlans.name));
  } finally {
    await connection.close();
  }
}

export async function getPlanBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [plan] = await connection.db.select().from(commercialPlans).where(eq(commercialPlans.slug, slug)).limit(1);
    return plan ?? null;
  } finally {
    await connection.close();
  }
}

function orderCode() {
  return `PED-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function createCommercialOrder(input: {
  planSlug: string;
  companyName: string;
  contactName: string;
  email: string;
  whatsapp?: string;
  cnpj?: string;
  city: string;
  termsAccepted: boolean;
}) {
  if (!input.termsAccepted) throw new Error("Aceite os termos para continuar.");
  if (!process.env.DATABASE_URL) throw new Error("Serviço indisponível.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const plan = await getPlanBySlug(input.planSlug);
    if (!plan || !plan.active) throw new Error("Plano inválido ou inativo.");
    const amount = plan.promoPrice ?? plan.price;
    const code = orderCode();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const [order] = await connection.db
      .insert(commercialOrders)
      .values({
        orderCode: code,
        planId: plan.id,
        companyName: input.companyName,
        contactName: input.contactName,
        email: input.email.toLowerCase(),
        whatsapp: input.whatsapp ?? null,
        cnpj: input.cnpj ?? null,
        city: input.city,
        amount,
        status: "PENDING_PAYMENT",
        expiresAt
      })
      .returning();
    return { order, plan, paymentAvailable: isPaymentAvailable() };
  } finally {
    await connection.close();
  }
}

export async function initiateOrderPayment(orderCode: string, siteUrl: string) {
  if (!process.env.DATABASE_URL) throw new Error("Serviço indisponível.");
  const gateway = getConfiguredGateway();
  if (!gateway) return { status: "unavailable" as const };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [order] = await connection.db.select().from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
    if (!order || order.status !== "PENDING_PAYMENT") throw new Error("Pedido inválido.");
    const [plan] = await connection.db.select().from(commercialPlans).where(eq(commercialPlans.id, order.planId)).limit(1);
    const amount = Number(order.amount);
    const idempotencyKey = `pay-${order.id}-${Date.now()}`;
    const result = await gateway.initiate({
      orderCode: order.orderCode,
      amount,
      description: `Plano ${plan?.name ?? ""} — ${order.companyName}`,
      returnUrl: `${siteUrl}/publicar-vaga/pedido/${order.orderCode}`,
      webhookUrl: `${siteUrl}/api/payments/webhook`
    });
    if (result.status === "redirect") {
      await connection.db.insert(commercialPayments).values({
        orderId: order.id,
        externalId: result.externalId,
        idempotencyKey,
        amount: order.amount,
        method: "checkout",
        provider: gateway.provider,
        status: "PENDING",
        expiresAt: order.expiresAt
      });
    }
    return result;
  } finally {
    await connection.close();
  }
}

export async function approveOrderAndGrantCredits(orderCode: string, externalId?: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const [order] = await tx.select().from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
      if (!order || order.status === "PAID") return;
      const [plan] = await tx.select().from(commercialPlans).where(eq(commercialPlans.id, order.planId)).limit(1);
      if (!plan) return;
      await tx.update(commercialOrders).set({ status: "PAID", paidAt: new Date(), updatedAt: new Date() }).where(eq(commercialOrders.id, order.id));
      if (externalId) {
        await tx.update(commercialPayments).set({ status: "APPROVED", approvedAt: new Date(), externalId, updatedAt: new Date() }).where(eq(commercialPayments.orderId, order.id));
      }
      const expiresAt = new Date(Date.now() + plan.creditValidityDays * 24 * 60 * 60 * 1000);
      await tx.insert(companyCredits).values({
        orderId: order.id,
        email: order.email,
        planId: plan.id,
        totalCredits: plan.jobCredits,
        usedCredits: 0,
        expiresAt
      });
    });
  } finally {
    await connection.close();
  }
}

export async function getOrderByCode(orderCode: string) {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [order] = await connection.db.select().from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
    if (!order) return null;
    const [plan] = await connection.db.select().from(commercialPlans).where(eq(commercialPlans.id, order.planId)).limit(1);
    const credits = await connection.db
      .select()
      .from(companyCredits)
      .where(and(eq(companyCredits.orderId, order.id), gt(companyCredits.expiresAt, new Date())));
    return { order, plan, credits, remaining: credits.reduce((sum, c) => sum + (c.totalCredits - c.usedCredits), 0) };
  } finally {
    await connection.close();
  }
}

export async function getCreditsForEmail(email: string) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    return connection.db
      .select()
      .from(companyCredits)
      .where(and(eq(companyCredits.email, email.toLowerCase()), gt(companyCredits.expiresAt, new Date()), sql`${companyCredits.usedCredits} < ${companyCredits.totalCredits}`))
      .orderBy(desc(companyCredits.createdAt));
  } finally {
    await connection.close();
  }
}
