import { auditLogs, commercialOrders, commercialPlans, createDatabase } from "@es/db";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { appendTimeline } from "./constants";

function orderCode() {
  return `PED-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function listOrdersAdmin(options: { q?: string; status?: string; page?: number; pageSize?: number } = {}) {
  if (!process.env.DATABASE_URL) return { items: [], total: 0 };
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, options.pageSize ?? 20);
  const offset = (page - 1) * pageSize;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const filters = [];
    if (options.status) filters.push(eq(commercialOrders.status, options.status as typeof commercialOrders.$inferSelect.status));
    if (options.q?.trim()) {
      const term = `%${options.q.trim()}%`;
      filters.push(or(ilike(commercialOrders.orderCode, term), ilike(commercialOrders.companyName, term), ilike(commercialOrders.email, term)));
    }
    const where = filters.length ? and(...filters) : undefined;
    const [totalRow] = await connection.db.select({ value: count() }).from(commercialOrders).where(where);
    const orders = await connection.db.select().from(commercialOrders).where(where).orderBy(desc(commercialOrders.createdAt)).limit(pageSize).offset(offset);
    const items = [];
    for (const order of orders) {
      const [plan] = await connection.db.select().from(commercialPlans).where(eq(commercialPlans.id, order.planId)).limit(1);
      items.push({ order, plan: plan ?? null });
    }
    return { items, total: totalRow?.value ?? 0, page, pageSize };
  } finally {
    await connection.close();
  }
}

export async function getOrderDetail(orderCode: string) {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [order] = await connection.db.select().from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
    if (!order) return null;
    const [plan] = await connection.db.select().from(commercialPlans).where(eq(commercialPlans.id, order.planId)).limit(1);
    return { order, plan: plan ?? null };
  } finally {
    await connection.close();
  }
}

export async function createOrder(input: {
  planId: string;
  companyName: string;
  contactName: string;
  email: string;
  whatsapp?: string;
  cnpj?: string;
  city: string;
}) {
  if (!process.env.DATABASE_URL) throw new Error("Serviço indisponível.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [plan] = await connection.db.select().from(commercialPlans).where(eq(commercialPlans.id, input.planId)).limit(1);
    if (!plan || !plan.active || plan.archived || plan.setupRequired) throw new Error("Plano indisponível.");
    const amount = plan.promoPrice ?? plan.price;
    const code = orderCode();
    const expiresAt = new Date(Date.now() + 48 * 3600000);
    const timeline = appendTimeline([], { type: "ORDER_CREATED", planSlug: plan.slug });
    const [order] = await connection.db.insert(commercialOrders).values({
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
      expiresAt,
      timeline
    }).returning();
    return { order: order!, plan };
  } finally {
    await connection.close();
  }
}

export async function cancelOrder(orderCode: string, reason: string, actorId?: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [order] = await connection.db.select().from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
    if (!order || order.status === "PAID") throw new Error("Pedido não pode ser cancelado.");
    const timeline = appendTimeline(order.timeline, { type: "ORDER_CANCELLED", reason, actorId: actorId ?? null });
    await connection.db.update(commercialOrders).set({
      status: "CANCELLED",
      cancelReason: reason,
      cancelledAt: new Date(),
      timeline,
      updatedAt: new Date()
    }).where(eq(commercialOrders.id, order.id));
    await connection.db.insert(auditLogs).values({
      actorId,
      action: "COMMERCIAL_ORDER_CANCELLED",
      entityType: "COMMERCIAL_ORDER",
      entityId: order.id,
      after: { reason },
      origin: actorId ? "ADMIN" : "PUBLIC"
    });
  } finally {
    await connection.close();
  }
}

export async function countOrdersByStatus(status: string) {
  if (!process.env.DATABASE_URL) return 0;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select({ value: count() }).from(commercialOrders).where(eq(commercialOrders.status, status as typeof commercialOrders.$inferSelect.status));
    return row?.value ?? 0;
  } finally {
    await connection.close();
  }
}

export async function addOrderNote(orderCode: string, note: string, actorId: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [order] = await connection.db.select().from(commercialOrders).where(eq(commercialOrders.orderCode, orderCode)).limit(1);
    if (!order) throw new Error("Pedido não encontrado.");
    const notes = order.internalNotes ? `${order.internalNotes}\n` : "";
    const timeline = appendTimeline(order.timeline, { type: "NOTE", note, actorId });
    await connection.db.update(commercialOrders).set({
      internalNotes: `${notes}[${new Date().toISOString()}] ${note}`,
      timeline,
      updatedAt: new Date()
    }).where(eq(commercialOrders.id, order.id));
  } finally {
    await connection.close();
  }
}
