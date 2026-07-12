import {
  commercialOrders,
  commercialPayments,
  commercialPlans,
  companyCredits,
  companyJobDrafts,
  companyTickets,
  createDatabase
} from "@es/db";
import { and, count, desc, eq, gt, sql } from "drizzle-orm";
import type { CompanyIdentity } from "./company-auth";

export async function getCompanyDashboardMetrics(companyIdentity: CompanyIdentity) {
  const email = companyIdentity.email.toLowerCase();
  const empty = {
    creditsBalance: 0,
    totalCredits: 0,
    usedCredits: 0,
    ordersCount: 0,
    paidOrders: 0,
    paymentsCount: 0,
    jobDraftsCount: 0,
    openTickets: 0
  };
  if (!process.env.DATABASE_URL) return empty;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [creditStats, ordersCount, paidOrders, paymentsCount, jobDraftsCount, openTickets] = await Promise.all([
      connection.db
        .select({
          available: sql<number>`coalesce(sum(${companyCredits.totalCredits} - ${companyCredits.usedCredits}), 0)::int`,
          total: sql<number>`coalesce(sum(${companyCredits.totalCredits}), 0)::int`,
          used: sql<number>`coalesce(sum(${companyCredits.usedCredits}), 0)::int`
        })
        .from(companyCredits)
        .where(and(eq(companyCredits.email, email), gt(companyCredits.expiresAt, new Date()))),
      connection.db.select({ value: count() }).from(commercialOrders).where(eq(commercialOrders.email, email)),
      connection.db.select({ value: count() }).from(commercialOrders).where(and(eq(commercialOrders.email, email), eq(commercialOrders.status, "PAID"))),
      connection.db
        .select({ value: count() })
        .from(commercialPayments)
        .innerJoin(commercialOrders, eq(commercialPayments.orderId, commercialOrders.id))
        .where(eq(commercialOrders.email, email)),
      connection.db.select({ value: count() }).from(companyJobDrafts).where(eq(companyJobDrafts.accountId, companyIdentity.id)),
      connection.db.select({ value: count() }).from(companyTickets).where(and(eq(companyTickets.accountId, companyIdentity.id), eq(companyTickets.status, "OPEN")))
    ]);
    const stats = creditStats[0];
    return {
      creditsBalance: stats?.available ?? 0,
      totalCredits: stats?.total ?? 0,
      usedCredits: stats?.used ?? 0,
      ordersCount: ordersCount[0]?.value ?? 0,
      paidOrders: paidOrders[0]?.value ?? 0,
      paymentsCount: paymentsCount[0]?.value ?? 0,
      jobDraftsCount: jobDraftsCount[0]?.value ?? 0,
      openTickets: openTickets[0]?.value ?? 0
    };
  } finally {
    await connection.close();
  }
}

export async function listCompanyOrders(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const orders = await connection.db
      .select()
      .from(commercialOrders)
      .where(eq(commercialOrders.email, normalized))
      .orderBy(desc(commercialOrders.createdAt))
      .limit(50);
    const rows: Array<{ order: typeof commercialOrders.$inferSelect; planName: string | null }> = [];
    for (const order of orders) {
      const [plan] = await connection.db
        .select({ name: commercialPlans.name })
        .from(commercialPlans)
        .where(eq(commercialPlans.id, order.planId))
        .limit(1);
      rows.push({ order, planName: plan?.name ?? null });
    }
    return rows;
  } finally {
    await connection.close();
  }
}

export async function listCompanyPayments(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const payments = await connection.db
      .select({ payment: commercialPayments, orderCode: commercialOrders.orderCode })
      .from(commercialPayments)
      .innerJoin(commercialOrders, eq(commercialPayments.orderId, commercialOrders.id))
      .where(eq(commercialOrders.email, normalized))
      .orderBy(desc(commercialPayments.createdAt))
      .limit(50);
    return payments.map((row) => ({ payment: row.payment, orderCode: row.orderCode }));
  } finally {
    await connection.close();
  }
}

export async function listCompanyCredits(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!process.env.DATABASE_URL) return { balance: 0, items: [] as Array<typeof companyCredits.$inferSelect> };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const items = await connection.db
      .select()
      .from(companyCredits)
      .where(eq(companyCredits.email, normalized))
      .orderBy(desc(companyCredits.createdAt))
      .limit(50);
    const [balanceRow] = await connection.db
      .select({
        value: sql<number>`coalesce(sum(${companyCredits.totalCredits} - ${companyCredits.usedCredits}), 0)::int`
      })
      .from(companyCredits)
      .where(and(eq(companyCredits.email, normalized), gt(companyCredits.expiresAt, new Date())));
    return { balance: balanceRow?.value ?? 0, items };
  } finally {
    await connection.close();
  }
}

export async function listCompanyJobDrafts(accountId: string) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    return connection.db
      .select()
      .from(companyJobDrafts)
      .where(eq(companyJobDrafts.accountId, accountId))
      .orderBy(desc(companyJobDrafts.createdAt))
      .limit(50);
  } finally {
    await connection.close();
  }
}

export async function listCompanyTickets(accountId: string) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    return connection.db
      .select()
      .from(companyTickets)
      .where(eq(companyTickets.accountId, accountId))
      .orderBy(desc(companyTickets.createdAt))
      .limit(50);
  } finally {
    await connection.close();
  }
}

export async function createCompanyTicket(input: {
  accountId: string;
  companyId: string | null;
  subject: string;
  message: string;
  orderId?: string | null;
  paymentId?: string | null;
}) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  const protocol = `ES-${Date.now().toString(36).toUpperCase().slice(-8)}`;
  try {
    const [ticket] = await connection.db
      .insert(companyTickets)
      .values({
        accountId: input.accountId,
        companyId: input.companyId,
        subject: input.subject.trim(),
        message: input.message.trim(),
        orderId: input.orderId ?? null,
        paymentId: input.paymentId ?? null,
        protocol
      })
      .returning();
    return ticket!;
  } finally {
    await connection.close();
  }
}
