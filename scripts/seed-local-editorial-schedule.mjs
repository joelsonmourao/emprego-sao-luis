#!/usr/bin/env node
/**
 * Agenda posts locais (sl-local-*, hoje 105) como SCHEDULED (~3/dia).
 * Capas: /covers/sl-local/{slug}.webp (gere antes com fetch/generate covers).
 * Se já existir parte do pacote, só insere os índices faltantes (ex.: 46–105).
 *
 *   node scripts/seed-local-editorial-schedule.mjs
 *   node scripts/seed-local-editorial-schedule.mjs --write
 *   node scripts/seed-local-editorial-schedule.mjs --write --fix-seo
 *
 * Não roda no migrate. Produção: ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 + --i-understand-production
 * Remoto: ADSENSE_EDITORIAL_ALLOW_REMOTE=1
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import {
  MIN_USEFUL_CHARS,
  SLUG_BASE,
  catalog,
  catalogIndexFromSlug,
  slugFor
} from "./data/sl-local-editorial-catalog.mjs";
import { buildArticleHtml } from "./data/sl-local-article-html.mjs";

const write = process.argv.includes("--write");
const fixSeo = process.argv.includes("--fix-seo");
const understandProduction = process.argv.includes("--i-understand-production");
const allowRemote = process.env.ADSENSE_EDITORIAL_ALLOW_REMOTE === "1";
const allowProduction = process.env.ADSENSE_EDITORIAL_ALLOW_PRODUCTION === "1";
const databaseUrl = process.env.DATABASE_URL;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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
  JSON.stringify(
    { ok: true, target: { host: target.host, port: target.port, database: target.database, user: target.user } },
    null,
    2
  )
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

const siteUrl = (process.env.SITE_URL || "https://empregossaoluis.com.br").replace(/\/$/, "");

/** 3 horários/dia (09/13/17 America/Sao_Paulo = UTC-3), a partir de amanhã. */
function buildScheduleSlots(count, from = new Date()) {
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
      // BRT = UTC-3 → UTC = hour+3
      slots.push(new Date(Date.UTC(y, m, d, hour + 3, 0, 0)));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return slots;
}

function buildHtml(item) {
  return buildArticleHtml(item);
}

function coverPathFor(slug) {
  return resolve(root, "apps/web/public/covers/sl-local", `${slug}.webp`);
}

/** Título SEO do admin aceita no máximo 70 caracteres. */
function seoTitleFor(title) {
  const suffix = " | Empregos São Luís";
  const max = 70;
  if (`${title}${suffix}`.length <= max) return `${title}${suffix}`;
  const room = max - suffix.length;
  if (room < 12) return title.slice(0, max);
  const trimmed = title.slice(0, room).replace(/\s+\S*$/, "").replace(/[:\-–—]\s*$/, "").trim();
  return `${trimmed || title.slice(0, room)}${suffix}`.slice(0, max);
}

const scheduleSlots = buildScheduleSlots(catalog.length);
const missingCovers = catalog.filter((item) => !existsSync(coverPathFor(slugFor(item)))).map((i) => slugFor(i));

if (!write) {
  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: true,
        marker: "SL-LOCAL-EDITORIAL-SCHEDULE",
        plan: {
          articles: catalog.length,
          allScheduled: true,
          slotsPerDay: 3,
          days: Math.ceil(catalog.length / 3),
          firstSlot: scheduleSlots[0]?.toISOString(),
          lastSlot: scheduleSlots[scheduleSlots.length - 1]?.toISOString(),
          minUsefulChars: MIN_USEFUL_CHARS,
          coverPattern: "/covers/sl-local/{slug}.webp",
          missingCovers: missingCovers.length
        },
        checks: { localOk, allowRemote, allowProduction, looksProduction }
      },
      null,
      2
    )
  );
  if (missingCovers.length) {
    console.log(`Aviso: ${missingCovers.length} capa(s) ausente(s). Rode: node scripts/generate-sl-local-covers.mjs`);
  }
  console.log("Dry-run concluído. Nenhuma gravação.");
  process.exit(0);
}

if (!localOk && !remoteWriteOk && !productionWriteOk) {
  console.error(
    "Recusa fail-closed: local E2E, ADSENSE_EDITORIAL_ALLOW_REMOTE=1, ou ALLOW_PRODUCTION + --i-understand-production."
  );
  process.exit(1);
}

if (missingCovers.length) {
  // No Coolify migrate as capas ficam no deploy do web (/covers/sl-local/), não na imagem migrate.
  if (productionWriteOk || remoteWriteOk) {
    console.warn(
      `[seed] Aviso: ${missingCovers.length} capa(s) ausente(s) neste filesystem. Continuando — redeploy do web deve servir /covers/sl-local/.`
    );
  } else {
    console.error(`Capas ausentes (${missingCovers.length}). Rode: npm run generate:sl-local-covers`);
    console.error(missingCovers.slice(0, 5).join(", "));
    process.exit(1);
  }
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });

async function ensureAuthorPillarClusters() {
  let [author] = await sql`select id from es_authors where slug = ${`${SLUG_BASE}-autor`} limit 1`;
  if (!author) {
    [author] = await sql`
      insert into es_authors (name, slug, bio)
      values (
        ${"Redação Empregos São Luís"},
        ${`${SLUG_BASE}-autor`},
        ${"Equipe editorial do Empregos São Luís. Conteúdo local para candidatos da Grande Ilha, com capas exclusivas por peça."}
      )
      returning id
    `;
  }

  let [pillar] = await sql`select id from es_content_pillars where slug = ${`${SLUG_BASE}-pilar`} limit 1`;
  if (!pillar) {
    [pillar] = await sql`
      insert into es_content_pillars (name, slug, description, audience, active)
      values (
        ${"Emprego local — São Luís"},
        ${`${SLUG_BASE}-pilar`},
        ${"Pilar editorial de guias e notícias locais para candidatos em São Luís."},
        ${"CANDIDATE"},
        true
      )
      returning id
    `;
  }

  let clusters = await sql`select id, slug from es_content_clusters where slug like ${`${SLUG_BASE}-%`}`;
  if (clusters.length < 3) {
    clusters = await sql`
      insert into es_content_clusters (pillar_id, name, slug, description, active)
      values
        (${pillar.id}, ${"Busca segura"}, ${`${SLUG_BASE}-busca-segura`}, ${"Golpes, canais e checagem"}, true),
        (${pillar.id}, ${"Candidatura prática"}, ${`${SLUG_BASE}-candidatura`}, ${"Currículo, entrevista e rotina"}, true),
        (${pillar.id}, ${"Mercado local"}, ${`${SLUG_BASE}-mercado`}, ${"Comércio, bairros e deslocamento"}, true)
      returning id, slug
    `;
  }
  return { author, pillar, clusters };
}

async function insertCatalogIndices(indices, slots, author, pillar, clusters) {
  let scheduled = 0;
  for (let slotIdx = 0; slotIdx < indices.length; slotIdx += 1) {
    const index = indices[slotIdx];
    const item = catalog[index];
    const slug = slugFor(item);
    const html = buildHtml(item);
    const cluster = clusters[index % clusters.length];
    const excerpt = `${item.lead}`.replace(/\s+/g, " ").trim().slice(0, 220);
    const coverUrl = `${siteUrl}/covers/sl-local/${slug}.webp`;
    const sources = [
      { name: "Empregos São Luís — política editorial", url: `${siteUrl}/politica-editorial` },
      { name: "Empregos São Luís — política de fontes", url: `${siteUrl}/politica-fontes` },
      { name: "Empregos São Luís — segurança do candidato", url: `${siteUrl}/seguranca-candidatos` }
    ];
    const scheduledAt = slots[slotIdx];
    const coverAlt = `Capa ilustrada: ${item.title}`;
    const coverCaption = `Ilustração editorial exclusiva para “${item.title}”.`;
    const coverCredit = "Empregos São Luís — ilustração editorial gerada para este post";

    await sql`
      insert into es_articles (
        type, author_id, pillar_id, cluster_id, title, slug, excerpt, content_html,
        cover_image_url, cover_image_alt, cover_image_caption, cover_image_credit,
        cover_image_width, cover_image_height, og_image_url,
        section, tags, source_name, source_url, sources,
        seo_title, meta_description, primary_keyword, search_intent,
        editorial_template, direct_answer, local_hook, audience, candidate_cta,
        editorial_stage, status, published_at, scheduled_at,
        news_eligible, discover_eligible, web_story_eligible, ai_assisted, fact_checked_at
      ) values (
        ${item.type},
        ${author.id},
        ${pillar.id},
        ${cluster.id},
        ${item.title},
        ${slug},
        ${excerpt},
        ${html},
        ${coverUrl},
        ${coverAlt},
        ${coverCaption},
        ${coverCredit},
        ${1200},
        ${630},
        ${coverUrl},
        ${item.section},
        ${sql.json(["sao-luis", "emprego", "sl-local", item.section])},
        ${"Empregos São Luís"},
        ${`${siteUrl}/politica-editorial`},
        ${sql.json(sources)},
        ${seoTitleFor(item.title)},
        ${excerpt.slice(0, 155)},
        ${item.keyword},
        ${"informational"},
        ${item.template},
        ${item.lead.slice(0, 280)},
        ${item.localAngle.slice(0, 280)},
        ${"CANDIDATE"},
        ${"Ver vagas gratuitas em São Luís"},
        ${"APPROVED"},
        ${"SCHEDULED"},
        ${null},
        ${scheduledAt},
        ${item.type === "NEWS"},
        ${false},
        ${item.template === "POST_MAGNETICO"},
        ${true},
        ${new Date()}
      )
    `;
    scheduled += 1;
  }
  return scheduled;
}

try {
  const existing = await sql`
    select id, slug, title, seo_title from es_articles
    where slug like ${`${SLUG_BASE}-%`}
       or slug = any(${catalog.map((item) => slugFor(item))})
       or tags @> ${sql.json(["sl-local"])}
  `;
  const covered = new Set();
  for (const row of existing) {
    const idx = catalogIndexFromSlug(row.slug);
    if (idx != null) covered.add(idx);
  }
  const missingIndices = [];
  for (let i = 0; i < catalog.length; i += 1) {
    if (!covered.has(i)) missingIndices.push(i);
  }

  if (existing.length && missingIndices.length === 0) {
    if (!fixSeo) {
      console.log(
        JSON.stringify({
          ok: true,
          skipped: true,
          reason: `Pacote completo: ${existing.length} artigo(s) cobrem os ${catalog.length} índices do catálogo. Edite no admin; use --fix-seo para título SEO/capa em lote.`,
          sample: existing.slice(0, 3).map((r) => r.slug)
        })
      );
      process.exit(0);
    }
    let seoFixed = 0;
    for (const row of existing) {
      const idx = catalogIndexFromSlug(row.slug);
      const item = idx != null ? catalog[idx] : catalog.find((entry) => slugFor(entry) === row.slug);
      const nextSeo = seoTitleFor(item?.title || row.title || "");
      const nextCover = `${siteUrl}/covers/sl-local/${row.slug}.webp`;
      await sql`
        update es_articles
        set seo_title = ${nextSeo},
            cover_image_url = ${nextCover},
            og_image_url = ${nextCover},
            updated_at = now()
        where id = ${row.id}
      `;
      seoFixed += 1;
    }
    console.log(
      JSON.stringify({
        ok: true,
        fixSeo: true,
        seoFixed,
        sample: existing.slice(0, 3).map((r) => r.slug)
      })
    );
    process.exit(0);
  }

  const { author, pillar, clusters } = await ensureAuthorPillarClusters();
  const insertSlots = buildScheduleSlots(missingIndices.length);
  const scheduled = await insertCatalogIndices(missingIndices, insertSlots, author, pillar, clusters);

  const proof = await sql`
    select status, count(*)::int as n from es_articles
    where slug like ${`${SLUG_BASE}-%`}
       or slug = any(${catalog.map((item) => slugFor(item))})
       or tags @> ${sql.json(["sl-local"])}
    group by status
  `;

  console.log(
    JSON.stringify(
      {
        ok: true,
        written: true,
        marker: "SL-LOCAL-EDITORIAL-SCHEDULE",
        catalogSize: catalog.length,
        alreadyPresent: existing.length,
        inserted: scheduled,
        missingWere: missingIndices.map((i) => slugFor(catalog[i])).slice(0, 8),
        firstSlot: insertSlots[0]?.toISOString() ?? null,
        lastSlot: insertSlots.at(-1)?.toISOString() ?? null,
        coverBase: `${siteUrl}/covers/sl-local/`,
        note: "Worker publica SCHEDULED quando scheduled_at <= now. Capas servidas pelo web em /covers/sl-local/.",
        proof: proof.map((r) => ({ status: r.status, n: r.n }))
      },
      null,
      2
    )
  );
} finally {
  await sql.end({ timeout: 5 });
}
