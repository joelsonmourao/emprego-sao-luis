#!/usr/bin/env node
/**
 * Despublica o pacote template adsense-editorial-* (DRAFT).
 * Conteúdo de volume fake não deve ficar no ar para pedido AdSense.
 *
 *   node scripts/unpublish-adsense-editorial-seed.mjs
 *   node scripts/unpublish-adsense-editorial-seed.mjs --write
 *
 * Produção: ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 e --i-understand-production
 * Remoto/staging: ADSENSE_EDITORIAL_ALLOW_REMOTE=1
 */
import postgres from "postgres";

const write = process.argv.includes("--write");
const understandProduction = process.argv.includes("--i-understand-production");
const allowRemote = process.env.ADSENSE_EDITORIAL_ALLOW_REMOTE === "1";
const allowProduction = process.env.ADSENSE_EDITORIAL_ALLOW_PRODUCTION === "1";
const databaseUrl = process.env.DATABASE_URL;
const slugBase = "adsense-editorial";

if (!databaseUrl) {
  console.error("DATABASE_URL é obrigatória.");
  process.exit(1);
}

function describeDbUrl(url) {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port || "(default)",
      database: parsed.pathname.replace(/^\//, ""),
      user: parsed.username || "(none)"
    };
  } catch {
    return { error: "URL inválida" };
  }
}

const target = describeDbUrl(databaseUrl);
if (target.error) {
  console.error("Recusa: DATABASE_URL inválida.");
  process.exit(1);
}

console.log(
  JSON.stringify({ ok: true, target: { host: target.host, port: target.port, database: target.database, user: target.user } }, null, 2)
);

const hostIsLocal = target.host === "127.0.0.1" || target.host === "localhost";
const hostLooksDockerInternal =
  !hostIsLocal && !String(target.host).includes(".") && /^[a-z0-9]{8,}$/i.test(String(target.host));
const looksProduction =
  /empregossaoluis\.com\.br|production/i.test(databaseUrl) ||
  /prod/i.test(String(target.database)) ||
  process.env.APP_ENV === "production" ||
  hostLooksDockerInternal;
const localOk = hostIsLocal && String(target.port) === "55432" && /staging|e2e/i.test(String(target.database));
const productionWriteOk = allowProduction && understandProduction;
const remoteWriteOk = allowRemote === true;

if (looksProduction && !productionWriteOk) {
  console.error(
    "Recusa fail-closed: alvo parece produção/Coolify. Defina ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 e --i-understand-production."
  );
  process.exit(1);
}

if (!write) {
  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  try {
    const articles = await sql`
      select status, count(*)::int as n from es_articles
      where slug like ${`${slugBase}%`} group by status
    `;
    const stories = await sql`
      select status, count(*)::int as n from es_web_stories
      where slug like ${`${slugBase}%`} group by status
    `;
    console.log(
      JSON.stringify(
        {
          ok: true,
          dryRun: true,
          plan: { articlesToDraft: articles, storiesToDraft: stories },
          checks: { localOk, allowRemote, allowProduction, looksProduction }
        },
        null,
        2
      )
    );
    console.log("Dry-run concluído. Nenhuma gravação.");
  } finally {
    await sql.end({ timeout: 5 });
  }
  process.exit(0);
}

if (!localOk && !remoteWriteOk && !productionWriteOk) {
  console.error(
    "Recusa fail-closed: local E2E, ADSENSE_EDITORIAL_ALLOW_REMOTE=1, ou ALLOW_PRODUCTION + --i-understand-production."
  );
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });
try {
  const articles = await sql`
    update es_articles
    set status = 'DRAFT',
        published_at = null,
        scheduled_at = null,
        updated_at = now()
    where slug like ${`${slugBase}%`}
      and status in ('PUBLISHED', 'SCHEDULED')
    returning id, slug, status
  `;
  const stories = await sql`
    update es_web_stories
    set status = 'DRAFT',
        published_at = null,
        scheduled_at = null,
        updated_at = now()
    where slug like ${`${slugBase}%`}
      and status in ('PUBLISHED', 'SCHEDULED')
    returning id, slug, status
  `;
  console.log(
    JSON.stringify(
      {
        ok: true,
        written: true,
        unpublishedArticles: articles.length,
        unpublishedStories: stories.length,
        note: "Template adsense-editorial-* em DRAFT. Produza conteúdo real no admin antes de pedir AdSense."
      },
      null,
      2
    )
  );
} finally {
  await sql.end({ timeout: 5 });
}
