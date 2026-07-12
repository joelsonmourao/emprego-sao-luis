import { and, asc, eq, gt, sql } from "drizzle-orm";
import { commercialOrders, commercialPayments, commercialPlans, companyCredits, createDatabase } from "@es/db";
import { getConfiguredGateway, isPaymentAvailable } from "./payments/gateway";
import { getPaymentSettings } from "./commercial/payment-settings";
import { listPublicPlans, getPlanById } from "./commercial/plans-service";
import { createOrder, getOrderDetail } from "./commercial/orders-service";
import { submitManualProof } from "./commercial/payments-service";

export { listPublicPlans as listActivePlans };

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
  const plan = await getPlanBySlug(input.planSlug);
  if (!plan) throw new Error("Plano inválido.");
  const { order, plan: p } = await createOrder({
    planId: plan.id,
    companyName: input.companyName,
    contactName: input.contactName,
    email: input.email,
    city: input.city,
    ...(input.whatsapp ? { whatsapp: input.whatsapp } : {}),
    ...(input.cnpj ? { cnpj: input.cnpj } : {})
  });
  return { order, plan: p, paymentAvailable: await isPaymentAvailable() };
}

export async function initiateOrderPayment(orderCode: string, siteUrl: string) {
  if (!process.env.DATABASE_URL) throw new Error("Serviço indisponível.");
  const gateway = getConfiguredGateway();
  if (!gateway) return { status: "unavailable" as const };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [order] = await connection.db.select().from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
    if (!order || order.status !== "PENDING_PAYMENT") throw new Error("Pedido inválido.");
    const plan = await getPlanById(order.planId);
    const idempotencyKey = `pay-${order.id}-${Date.now()}`;
    const result = await gateway.initiate({
      orderCode: order.orderCode,
      amount: Number(order.amount),
      description: `Plano ${plan?.name ?? ""} — ${order.companyName}`,
      returnUrl: `${siteUrl}/publicar-vaga/confirmacao/${order.orderCode}`,
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

export async function getOrderByCode(orderCode: string) {
  const detail = await getOrderDetail(orderCode);
  if (!detail) return null;
  const { order, plan } = detail;
  if (!process.env.DATABASE_URL) return { order, plan, credits: [], remaining: 0 };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
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
      .orderBy(asc(companyCredits.createdAt));
  } finally {
    await connection.close();
  }
}

export { submitManualProof, isPaymentAvailable, getPaymentSettings };
