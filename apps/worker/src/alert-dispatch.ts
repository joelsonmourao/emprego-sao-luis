import { and, desc, eq, gt, gte } from "drizzle-orm";
import { Queue, type ConnectionOptions } from "bullmq";
import { alerts, categories, cities, companies, createDatabase, jobs, notificationDeliveries, subscriptions } from "@es/db";

function redisOptions(value: string): ConnectionOptions {
  const url = new URL(value);
  return { host: url.hostname, port: Number(url.port || 6379), ...(url.username ? { username: decodeURIComponent(url.username) } : {}), ...(url.password ? { password: decodeURIComponent(url.password) } : {}), ...(url.protocol === "rediss:" ? { tls: {} } : {}) };
}

type AlertFilters = {
  city?: string | null;
  category?: string | null;
  company?: string | null;
  workplaceType?: string | null;
  title?: string | null;
  lastSentAt?: string | null;
};

function matchesFilters(filters: AlertFilters, job: { normalizedTitle: string; workplaceType: string; cityName: string; categoryName: string | null; companyName: string }) {
  if (filters.city && !job.cityName.toLowerCase().includes(filters.city.toLowerCase())) return false;
  if (filters.category && !(job.categoryName ?? "").toLowerCase().includes(filters.category.toLowerCase())) return false;
  if (filters.company && !job.companyName.toLowerCase().includes(filters.company.toLowerCase())) return false;
  if (filters.workplaceType && job.workplaceType !== filters.workplaceType) return false;
  if (filters.title && !job.normalizedTitle.toLowerCase().includes(filters.title.toLowerCase())) return false;
  return true;
}

function frequencyWindow(frequency: string) {
  const hours = frequency === "INSTANT" ? 1 : frequency === "WEEKLY" ? 24 * 7 : 24;
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

export async function dispatchJobAlerts() {
  if (!process.env.DATABASE_URL || !process.env.REDIS_URL) throw new Error("DATABASE_URL e REDIS_URL são obrigatórias.");
  const connection = createDatabase(process.env.DATABASE_URL);
  const queue = new Queue("notifications", { connection: redisOptions(process.env.REDIS_URL) });
  let sent = 0;
  try {
    const activeAlerts = await connection.db
      .select({ alert: alerts, subscription: subscriptions })
      .from(alerts)
      .innerJoin(subscriptions, eq(alerts.subscriptionId, subscriptions.id))
      .where(and(eq(alerts.active, true), eq(subscriptions.status, "ACTIVE")));

    if (!activeAlerts.length) return { sent: 0, examined: 0 };

    const since = frequencyWindow("DAILY");
    const recentJobs = await connection.db
      .select({
        id: jobs.id,
        slug: jobs.slug,
        normalizedTitle: jobs.normalizedTitle,
        workplaceType: jobs.workplaceType,
        publicCode: jobs.publicCode,
        publishedAt: jobs.publishedAt,
        cityName: cities.name,
        categoryName: categories.name,
        companyName: companies.name
      })
      .from(jobs)
      .innerJoin(cities, eq(jobs.cityId, cities.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .leftJoin(categories, eq(jobs.categoryId, categories.id))
      .where(and(eq(jobs.publicationStatus, "PUBLISHED"), gte(jobs.publishedAt, since), gt(jobs.expiresAt, new Date())))
      .orderBy(desc(jobs.publishedAt))
      .limit(200);

    for (const row of activeAlerts) {
      const filters = row.alert.filters as AlertFilters;
      const windowStart = frequencyWindow(row.alert.frequency);
      if (filters.lastSentAt && new Date(filters.lastSentAt) > windowStart) continue;
      const matched = recentJobs.filter((job) => matchesFilters(filters, job));
      if (!matched.length) continue;
      const siteUrl = process.env.SITE_URL ?? "https://empregossaoluis.com.br";
      const html = `<p>Novas vagas para você:</p><ul>${matched.slice(0, 10).map((job) => `<li><a href="${new URL(`/vagas/${job.slug}`, siteUrl)}">${job.normalizedTitle}</a> — ${job.companyName} (${job.publicCode})</li>`).join("")}</ul><p><a href="${new URL("/alertas", siteUrl)}">Gerenciar alertas</a></p>`;
      const [delivery] = await connection.db.insert(notificationDeliveries).values({ subscriptionId: row.subscription.id, channel: "EMAIL", template: "JOB_ALERT_DIGEST" }).returning();
      await queue.add("email", { deliveryId: delivery!.id, to: row.subscription.email, subject: `${matched.length} nova(s) vaga(s) — Empregos São Luís`, html }, { jobId: delivery!.id, attempts: 5, backoff: { type: "exponential", delay: 5000 } });
      await connection.db.update(alerts).set({ filters: { ...filters, lastSentAt: new Date().toISOString() }, updatedAt: new Date() }).where(eq(alerts.id, row.alert.id));
      sent++;
    }
    return { sent, examined: activeAlerts.length };
  } finally {
    await queue.close();
    await connection.close();
  }
}
