import { auditLogs, commercialPayments, commercialRefunds, companyCredits, createDatabase } from "@es/db";
import { and, desc, eq, gt, sql } from "drizzle-orm";

export async function requestRefund(input: {
  paymentId: string;
  orderId: string;
  amount: string;
  reason: string;
  partial?: boolean;
  actorId?: string;
}) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [payment] = await connection.db.select().from(commercialPayments).where(eq(commercialPayments.id, input.paymentId)).limit(1);
    if (!payment || payment.status !== "PAID") throw new Error("Pagamento não elegível para reembolso.");
    const [credit] = await connection.db
      .select()
      .from(companyCredits)
      .where(and(eq(companyCredits.orderId, input.orderId), sql`${companyCredits.usedCredits} > 0`))
      .limit(1);
    if (credit) throw new Error("Crédito já utilizado. Reembolso bloqueado.");
    const [refund] = await connection.db.insert(commercialRefunds).values({
      paymentId: input.paymentId,
      orderId: input.orderId,
      amount: input.amount,
      reason: input.reason,
      partial: input.partial ?? false,
      status: "REQUESTED"
    }).returning();
    await connection.db.insert(auditLogs).values({
      actorId: input.actorId,
      action: "REFUND_REQUESTED",
      entityType: "COMMERCIAL_REFUND",
      entityId: refund!.id,
      after: { amount: input.amount, reason: input.reason },
      origin: "ADMIN"
    });
    return refund!;
  } finally {
    await connection.close();
  }
}

export async function listRefundsAdmin() {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    return await connection.db.select().from(commercialRefunds).orderBy(desc(commercialRefunds.createdAt)).limit(100);
  } finally {
    await connection.close();
  }
}

export async function approveRefund(refundId: string, actorId: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [refund] = await connection.db.select().from(commercialRefunds).where(eq(commercialRefunds.id, refundId)).limit(1);
    if (!refund || refund.status !== "REQUESTED") throw new Error("Reembolso inválido.");
    await connection.db.update(commercialRefunds).set({ status: "COMPLETED", approvedBy: actorId, processedAt: new Date(), updatedAt: new Date() }).where(eq(commercialRefunds.id, refundId));
    await connection.db.update(commercialPayments).set({ status: refund.partial ? "PARTIALLY_REFUNDED" : "REFUNDED", updatedAt: new Date() }).where(eq(commercialPayments.id, refund.paymentId));
    const credits = await connection.db.select().from(companyCredits).where(and(eq(companyCredits.orderId, refund.orderId), gt(companyCredits.usedCredits, 0)));
    if (!credits.length) {
      await connection.db.update(companyCredits).set({ usedCredits: sql`${companyCredits.totalCredits}`, updatedAt: new Date() }).where(eq(companyCredits.orderId, refund.orderId));
    }
    await connection.db.insert(auditLogs).values({
      actorId,
      action: "REFUND_COMPLETED",
      entityType: "COMMERCIAL_REFUND",
      entityId: refundId,
      origin: "ADMIN"
    });
  } finally {
    await connection.close();
  }
}

export async function rejectRefund(refundId: string, actorId: string, reason: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [refund] = await connection.db.select().from(commercialRefunds).where(eq(commercialRefunds.id, refundId)).limit(1);
    if (!refund || refund.status !== "REQUESTED") throw new Error("Reembolso inválido.");
    await connection.db.update(commercialRefunds).set({ status: "REJECTED", approvedBy: actorId, processedAt: new Date(), updatedAt: new Date() }).where(eq(commercialRefunds.id, refundId));
    await connection.db.insert(auditLogs).values({
      actorId,
      action: "REFUND_REJECTED",
      entityType: "COMMERCIAL_REFUND",
      entityId: refundId,
      after: { reason },
      origin: "ADMIN"
    });
  } finally {
    await connection.close();
  }
}

export async function getRefundById(refundId: string) {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [refund] = await connection.db.select().from(commercialRefunds).where(eq(commercialRefunds.id, refundId)).limit(1);
    return refund ?? null;
  } finally {
    await connection.close();
  }
}
