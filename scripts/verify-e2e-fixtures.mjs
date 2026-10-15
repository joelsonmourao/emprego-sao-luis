#!/usr/bin/env node
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL obrigatória");
  process.exit(1);
}
const u = new URL(databaseUrl);
if (!["127.0.0.1", "localhost"].includes(u.hostname) || u.port !== "55432" || !/staging|e2e/i.test(u.pathname)) {
  console.error("Recusa: somente 127.0.0.1|localhost:55432/*staging*|*e2e*");
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });
const mark = "E2E-ADMIN-FIXTURE";
const slug = "e2e-admin-fixture";

try {
  const row = async (q) => (await q)[0].c;
  const counts = {
    host: u.hostname,
    port: u.port,
    database: u.pathname.slice(1),
    user: u.username,
    url: await row(sql`select count(*)::int as c from es_jobs where slug = ${`${slug}-url`}`),
    whatsapp: await row(sql`select count(*)::int as c from es_jobs where slug = ${`${slug}-wa`}`),
    email: await row(sql`select count(*)::int as c from es_jobs where slug = ${`${slug}-mail`}`),
    multichannel: await row(sql`select count(*)::int as c from es_jobs where slug = ${`${slug}-all`}`),
    featured: await row(sql`select count(*)::int as c from es_jobs where slug = ${`${slug}-featured`} and featured = true`),
    pillars: await row(sql`select count(*)::int as c from es_content_pillars where slug like ${`${slug}%`}`),
    clusters: await row(sql`select count(*)::int as c from es_content_clusters where slug like ${`${slug}%`}`),
    magnetic: await row(sql`select count(*)::int as c from es_articles where slug = ${`${slug}-post-magnetico`}`),
    storyDraft: await row(sql`select count(*)::int as c from es_web_stories where slug = ${`${slug}-story-draft`} and status = 'DRAFT'`),
    storyPublished: await row(sql`select count(*)::int as c from es_web_stories where slug = ${`${slug}-story-pub`} and status = 'PUBLISHED'`),
    classificationRules: await row(sql`select count(*)::int as c from es_classification_rules where category_slug = ${`${slug}-analista`}`),
    importBatches: await row(sql`select count(*)::int as c from es_import_batches where file_name like ${`${mark}%`}`),
    plans: await row(sql`select count(*)::int as c from es_commercial_plans where slug = ${`${slug}-plano`}`),
    campaigns: await row(sql`select count(*)::int as c from es_campaigns where name like ${`${mark}%`}`),
    adsenseHistory: await row(sql`select count(*)::int as c from es_adsense_readiness_history where stage_snapshot::text like ${`%${mark}%`}`)
  };
  const required = [
    "url",
    "whatsapp",
    "email",
    "multichannel",
    "featured",
    "pillars",
    "clusters",
    "magnetic",
    "storyDraft",
    "storyPublished",
    "classificationRules",
    "importBatches",
    "plans",
    "campaigns",
    "adsenseHistory"
  ];
  const missing = required.filter((key) => !counts[key]);
  console.log(JSON.stringify({ ok: missing.length === 0, missing, counts }, null, 2));
  process.exit(missing.length ? 1 : 0);
} finally {
  await sql.end({ timeout: 5 });
}
