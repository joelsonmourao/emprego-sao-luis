import { companyCredits, createDatabase } from "@es/db";
import { count, desc, sql } from "drizzle-orm";

export { requestRefund, listRefundsAdmin, approveRefund, rejectRefund, getRefundById } from "./refunds-service";

export async function listCreditsAdmin(options: { q?: string; page?: number; pageSize?: number } = {}) {
  if (!process.env.DATABASE_URL) return { items: [], total: 0 };
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, options.pageSize ?? 20);
  const offset = (page - 1) * pageSize;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [totalRow] = await connection.db.select({ value: count() }).from(companyCredits);
    let items = await connection.db.select().from(companyCredits).orderBy(desc(companyCredits.createdAt)).limit(pageSize).offset(offset);
    if (options.q?.trim()) {
      const term = options.q.trim().toLowerCase();
      items = items.filter((c) => c.email.toLowerCase().includes(term));
    }
    return { items, total: totalRow?.value ?? 0, page, pageSize };
  } finally {
    await connection.close();
  }
}

export async function sumCreditsIssued() {
  if (!process.env.DATABASE_URL) return 0;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select({ value: sql<number>`coalesce(sum(${companyCredits.totalCredits}), 0)::int` }).from(companyCredits);
    return row?.value ?? 0;
  } finally {
    await connection.close();
  }
}

export async function sumCreditsUsed() {
  if (!process.env.DATABASE_URL) return 0;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select({ value: sql<number>`coalesce(sum(${companyCredits.usedCredits}), 0)::int` }).from(companyCredits);
    return row?.value ?? 0;
  } finally {
    await connection.close();
  }
}
