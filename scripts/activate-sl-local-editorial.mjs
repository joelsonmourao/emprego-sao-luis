#!/usr/bin/env node
/**
 * Ativa o pacote sl-local-* já existente no banco:
 *  - publica os primeiros N agora (default 3)
 *  - reagenda o restante ~3/dia a partir de amanhã
 *  - atualiza capa/crédito a partir de credits.json (fotos reais)
 *
 *   node scripts/activate-sl-local-editorial.mjs
 *   node scripts/activate-sl-local-editorial.mjs --write --i-understand-production
 *
 * Não usa migrate. Rode uma vez no Terminal Coolify (com DATABASE_URL + SITE_URL).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { SLUG_BASE, catalog, slugFor } from "./data/sl-local-editorial-catalog.mjs";
import { buildArticleHtml } from "./data/sl-local-article-html.mjs";

const write = process.argv.includes("--write");
const rewriteBodies = process.argv.includes("--rewrite-bodies");
const understandProduction = process.argv.includes("--i-understand-production");
const allowRemote = process.env.ADSENSE_EDITORIAL_ALLOW_REMOTE === "1";
const allowProduction = process.env.ADSENSE_EDITORIAL_ALLOW_PRODUCTION === "1";
const databaseUrl = process.env.DATABASE_URL;
const publishNowCount = Math.max(0, Number(process.env.SL_LOCAL_PUBLISH_NOW || 3) || 3);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const creditsPath = resolve(root, "apps/web/public/covers/sl-local/credits.json");

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
  console.error("DATABASE_URL inválida.");
  process.exit(1);
}

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
const siteUrl = (process.env.SITE_URL || "https://empregossaoluis.com.br").replace(/\/$/, "");

console.log(JSON.stringify({ ok: true, target: { host: target.host, database: target.database }, publishNowCount }, null, 2));

if (looksProduction && !productionWriteOk) {
  console.error("Recusa fail-closed: produção exige ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 e --i-understand-production.");
  process.exit(1);
}

function buildRemainingSlots(count, from = new Date()) {
  const hoursBrt = [9, 13, 17];
  const slots = [];
  const cursor = new Date(from);
  cursor.setUTCHours(12, 0, 0, 0);
  cursor.setUTCDate(cursor.getUTCDate() + 1);
  while (slots.length < count) {
    const y = cursor.getUTCFullYear();
    const m = cursor.getUTCMonth();
    const d = cursor.getUTCDate();
    for (const hour of hoursBrt) {
      if (slots.length >= count) break;
      slots.push(new Date(Date.UTC(y, m, d, hour + 3, 0, 0)));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return slots;
}

function seoTitleFor(title) {
  const suffix = " | Empregos São Luís";
  const max = 70;
  if (`${title}${suffix}`.length <= max) return `${title}${suffix}`;
  const room = max - suffix.length;
  const trimmed = title.slice(0, Math.max(12, room)).replace(/\s+\S*$/, "").replace(/[:\-–—]\s*$/, "").trim();
  return `${trimmed || title.slice(0, room)}${suffix}`.slice(0, max);
}

const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, "utf8")) : [];
const creditBySlug = new Map(credits.map((row) => [row.slug, row]));

const order = catalog.map((item) => slugFor(item));

/** Publica misturando GUIDE/DATA_REPORT e NEWS (senão /noticias fica vazio). */
function pickGoLiveIndices(count) {
  const guides = [];
  const news = [];
  catalog.forEach((item, index) => {
    if (item.type === "NEWS") news.push(index);
    else guides.push(index);
  });
  const chosen = [];
  let g = 0;
  let n = 0;
  while (chosen.length < count && (g < guides.length || n < news.length)) {
    if (g < guides.length) chosen.push(guides[g++]);
    if (chosen.length >= count) break;
    if (n < news.length) chosen.push(news[n++]);
  }
  return new Set(chosen);
}

const goLiveSet = pickGoLiveIndices(publishNowCount);
const remainingCount = Math.max(0, order.length - goLiveSet.size);
const remainingSlots = buildRemainingSlots(remainingCount);

if (!write) {
  const preview = [...goLiveSet].sort((a, b) => a - b).map((i) => ({
    slug: order[i],
    type: catalog[i].type,
    title: catalog[i].title
  }));
  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: true,
        plan: {
          publishNow: preview,
          scheduleRest: remainingCount,
          firstScheduled: remainingSlots[0]?.toISOString() ?? null,
          lastScheduled: remainingSlots.at(-1)?.toISOString() ?? null,
          creditsLoaded: credits.length
        },
        checks: { localOk, allowRemote, allowProduction, looksProduction }
      },
      null,
      2
    )
  );
  console.log("Dry-run. Para gravar: --write (+ flags de produção se necessário).");
  process.exit(0);
}

if (!localOk && !remoteWriteOk && !productionWriteOk) {
  console.error("Recusa fail-closed: local E2E, ALLOW_REMOTE, ou ALLOW_PRODUCTION + --i-understand-production.");
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });
try {
  const rows = await sql`
    select id, slug, status, scheduled_at
    from es_articles
    where slug like ${`${SLUG_BASE}%`}
  `;
  if (!rows.length) {
    console.error("Nenhum artigo sl-local-* no banco. Rode o seed antes.");
    process.exit(1);
  }

  /** Casa sl-local-01-... com catalog[0], mesmo se o sufixo do slug mudou no código. */
  function rowForIndex(index) {
    const n = String(index + 1).padStart(2, "0");
    return rows.find((r) => r.slug.startsWith(`${SLUG_BASE}-${n}-`)) || null;
  }

  let published = 0;
  let scheduled = 0;
  let covers = 0;
  let missing = 0;
  const now = new Date();
  let scheduleIdx = 0;
  const publishedSlugs = [];

  for (let i = 0; i < catalog.length; i += 1) {
    const item = catalog[i];
    const row = rowForIndex(i);
    if (!row) {
      missing += 1;
      continue;
    }
    // Mantém slug/arquivo de capa já publicados; atualiza título e corpo.
    const slug = row.slug;
    const credit = creditBySlug.get(slug) || creditBySlug.get(slugFor(item));
    const coverUrl = `${siteUrl}/covers/sl-local/${slug}.webp`;
    const coverAlt = credit?.alt || `Capa: ${item.title}`;
    const coverCaption = credit?.caption || `Imagem para “${item.title}”.`;
    const coverCredit = credit?.credit || "Empregos São Luís — capa editorial";
    const goLive = goLiveSet.has(i);
    const scheduledAt = goLive ? null : remainingSlots[scheduleIdx++];
    const status = goLive ? "PUBLISHED" : "SCHEDULED";
    const publishedAt = goLive ? now : null;
    const excerpt = `${item.title}. Orientação prática para candidatos em São Luís e região.`;

    if (rewriteBodies) {
      const contentHtml = buildArticleHtml(item);
      await sql`
        update es_articles
        set type = ${item.type},
            title = ${item.title},
            excerpt = ${excerpt},
            status = ${status},
            published_at = ${publishedAt},
            scheduled_at = ${scheduledAt},
            seo_title = ${seoTitleFor(item.title)},
            meta_description = ${excerpt.slice(0, 155)},
            primary_keyword = ${item.keyword},
            section = ${item.section},
            editorial_template = ${item.template},
            content_html = ${contentHtml},
            direct_answer = ${item.lead.slice(0, 280)},
            local_hook = ${item.localAngle.slice(0, 280)},
            cover_image_url = ${coverUrl},
            og_image_url = ${coverUrl},
            cover_image_alt = ${coverAlt},
            cover_image_caption = ${coverCaption},
            cover_image_credit = ${coverCredit},
            cover_image_width = ${1200},
            cover_image_height = ${630},
            news_eligible = ${item.type === "NEWS"},
            web_story_eligible = ${item.template === "POST_MAGNETICO"},
            updated_at = now()
        where id = ${row.id}
      `;
    } else {
      await sql`
        update es_articles
        set status = ${status},
            published_at = ${publishedAt},
            scheduled_at = ${scheduledAt},
            seo_title = ${seoTitleFor(item.title)},
            cover_image_url = ${coverUrl},
            og_image_url = ${coverUrl},
            cover_image_alt = ${coverAlt},
            cover_image_caption = ${coverCaption},
            cover_image_credit = ${coverCredit},
            cover_image_width = ${1200},
            cover_image_height = ${630},
            updated_at = now()
        where id = ${row.id}
      `;
    }
    covers += 1;
    if (goLive) {
      published += 1;
      publishedSlugs.push({
        slug,
        type: item.type,
        title: item.title,
        path: item.type === "NEWS" ? `/noticias/${slug}` : `/blog/${slug}`
      });
    } else scheduled += 1;
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        written: true,
        published,
        scheduled,
        publishedNow: publishedSlugs,
        coversUpdated: covers,
        bodiesRewritten: rewriteBodies,
        missingSlugs: missing,
        note: "Títulos/textos novos (inspiração Gupy/Sólides, sem plágio). Slugs de capa preservados. Rode no web Emprego São Luís."
      },
      null,
      2
    )
  );
} finally {
  await sql.end({ timeout: 5 });
}
