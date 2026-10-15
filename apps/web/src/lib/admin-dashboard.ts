import {
  commercialOrders,
  commercialPayments,
  commercialPlans,
  companyCredits,
  contactSubmissions,
  createDatabase,
  jobs
} from "@es/db";
import { and, count, eq, gt, sql } from "drizzle-orm";
import { countPaymentsByStatus } from "./commercial/payments-service";
import { countOrdersByStatus } from "./commercial/orders-service";
import { sumCreditsIssued, sumCreditsUsed } from "./commercial/credits-service";
import { countOpenSeoIssues } from "./seo-audit";

export async function getAdminDashboardMetrics() {
  const empty = {
    published: 0,
    review: 0,
    scheduled: 0,
    expired: 0,
    companies: 0,
    pendingOrders: 0,
    manualReviewPayments: 0,
    paidRevenue: 0,
    creditsIssued: 0,
    creditsUsed: 0,
    activePlans: 0,
    companiesWithCredit: 0,
    openContacts: 0,
    webhookFailures: 0,
    seoIssues: 0
  };
  if (!process.env.DATABASE_URL) return empty;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [
      published,
      review,
      scheduled,
      expired,
      pendingOrders,
      manualReview,
      paidRevenue,
      activePlans,
      companiesWithCredit,
      openContacts,
      webhookFailures,
      seoIssues
    ] = await Promise.all([
      connection.db.select({ value: count() }).from(jobs).where(eq(jobs.publicationStatus, "PUBLISHED")),
      connection.db.select({ value: count() }).from(jobs).where(eq(jobs.publicationStatus, "PENDING_REVIEW")),
      connection.db.select({ value: count() }).from(jobs).where(eq(jobs.publicationStatus, "SCHEDULED")),
      connection.db.select({ value: count() }).from(jobs).where(eq(jobs.publicationStatus, "EXPIRED")),
      countOrdersByStatus("PENDING_PAYMENT"),
      countPaymentsByStatus("MANUAL_REVIEW"),
      connection.db.select({ value: sql<number>`coalesce(sum(${commercialOrders.amount}), 0)::float` }).from(commercialOrders).where(eq(commercialOrders.status, "PAID")),
      connection.db.select({ value: count() }).from(commercialPlans).where(and(eq(commercialPlans.active, true), eq(commercialPlans.archived, false))),
      connection.db.select({ value: sql<number>`count(distinct ${companyCredits.email})::int` }).from(companyCredits).where(gt(companyCredits.expiresAt, new Date())),
      connection.db.select({ value: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "OPEN")),
      connection.db.select({ value: count() }).from(commercialPayments).where(eq(commercialPayments.status, "FAILED")),
      countOpenSeoIssues()
    ]);
    const creditsIssued = await sumCreditsIssued();
    const creditsUsed = await sumCreditsUsed();
    return {
      published: published[0]?.value ?? 0,
      review: review[0]?.value ?? 0,
      scheduled: scheduled[0]?.value ?? 0,
      expired: expired[0]?.value ?? 0,
      companies: 0,
      pendingOrders: pendingOrders,
      manualReviewPayments: manualReview,
      paidRevenue: paidRevenue[0]?.value ?? 0,
      creditsIssued,
      creditsUsed,
      activePlans: activePlans[0]?.value ?? 0,
      companiesWithCredit: companiesWithCredit[0]?.value ?? 0,
      openContacts: openContacts[0]?.value ?? 0,
      webhookFailures: webhookFailures[0]?.value ?? 0,
      seoIssues
    };
  } finally {
    await connection.close();
  }
}
