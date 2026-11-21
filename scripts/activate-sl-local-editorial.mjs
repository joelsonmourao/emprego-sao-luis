#!/usr/bin/env node
/**
 * Ativa o pacote sl-local-* (105 no catálogo):
 *  - insere índices faltantes (ex.: 46–105) se o banco só tiver parte do pacote
 *  - publica N agora (default 3; misturando GUIDE/NEWS)
 *  - reagenda o restante ~3/dia a partir de amanhã
 *  - atualiza capa/crédito a partir de credits.json (fotos reais)
 *  - --rewrite-bodies: regenera título + contentHtml (HTML)
 *
 *   node scripts/activate-sl-local-editorial.mjs
 *   node scripts/activate-sl-local-editorial.mjs --write --i-understand-production --rewrite-bodies
 *
 * Não usa migrate. Rode uma vez no Terminal Coolify do web Emprego São Luís.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { SLUG_BASE, catalog, catalogIndexFromSlug, slugFor } from "./data/sl-local-editorial-catalog.mjs";
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
        catalogSize: catalog.length,
        plan: {
          publishNow: preview,
          scheduleRest: remainingCount,
          firstScheduled: remainingSlots[0]?.toISOString() ?? null,
          lastScheduled: remainingSlots.at(-1)?.toISOString() ?? null,
          creditsLoaded: credits.length,
          note: "Com --write, índices faltantes no banco são inseridos automaticamente."
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

const seoSlugs = catalog.map((item) => slugFor(item));

try {
  let rows = await sql`
    select id, slug, status, scheduled_at
    from es_articles
    where slug like ${`${SLUG_BASE}-%`}
       or slug = any(${seoSlugs})
       or tags @> ${sql.json(["sl-local"])}
  `;

  const covered = new Set();
  for (const row of rows) {
    const idx = catalogIndexFromSlug(row.slug);
    if (idx != null) covered.add(idx);
  }
  const missingIndices = [];
  for (let i = 0; i < catalog.length; i += 1) {
    if (!covered.has(i)) missingIndices.push(i);
  }

  let inserted = 0;
  if (missingIndices.length) {
    let [author] = await sql`select id from es_authors where slug = ${`${SLUG_BASE}-autor`} limit 1`;
    if (!author) {
      [author] = await sql`
        insert into es_authors (name, slug, bio)
        values (
          ${"Redação Empregos São Luís"},
          ${`${SLUG_BASE}-autor`},
          ${"Equipe editorial do Empregos São Luís."}
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
          ${"Pilar editorial local para candidatos em São Luís."},
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

    const insertSlots = buildRemainingSlots(missingIndices.length);
    for (let slotIdx = 0; slotIdx < missingIndices.length; slotIdx += 1) {
      const index = missingIndices[slotIdx];
      const item = catalog[index];
      const slug = slugFor(item);
      const cluster = clusters[index % clusters.length];
      const excerpt = `${item.lead}`.replace(/\s+/g, " ").trim().slice(0, 220);
      const coverUrl = `${siteUrl}/covers/sl-local/${slug}.webp`;
      const contentHtml = buildArticleHtml(item);
      const sources = [
        { name: "Empregos São Luís — política editorial", url: `${siteUrl}/politica-editorial` },
        { name: "Empregos São Luís — política de fontes", url: `${siteUrl}/politica-fontes` },
        { name: "Empregos São Luís — segurança do candidato", url: `${siteUrl}/seguranca-candidatos` }
      ];
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
          ${contentHtml},
          ${coverUrl},
          ${`Capa: ${item.title}`},
          ${`Imagem para “${item.title}”.`},
          ${"Empregos São Luís — capa editorial"},
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
          ${insertSlots[slotIdx]},
          ${item.type === "NEWS"},
          ${false},
          ${item.template === "POST_MAGNETICO"},
          ${true},
          ${new Date()}
        )
      `;
      inserted += 1;
    }

    rows = await sql`
      select id, slug, status, scheduled_at
      from es_articles
      where slug like ${`${SLUG_BASE}-%`}
         or slug = any(${seoSlugs})
         or tags @> ${sql.json(["sl-local"])}
    `;
  }

  if (!rows.length) {
    console.error("Nenhum artigo sl-local-* no banco após insert. Verifique o catálogo/DB.");
    process.exit(1);
  }

  function rowForIndex(index) {
    const item = catalog[index];
    const seo = slugFor(item);
    const n = String(index + 1).padStart(2, "0");
    return (
      rows.find((r) => r.slug === seo) ||
      rows.find((r) => r.slug === `${SLUG_BASE}-${item.key}`) ||
      rows.find((r) => r.slug.startsWith(`${SLUG_BASE}-${n}-`)) ||
      null
    );
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
    // Sincroniza slug + capa com o catálogo atual (evita título novo com capa/slug antigo).
    const slug = slugFor(item);
    const previousSlug = row.slug;
    const credit = creditBySlug.get(slug) || creditBySlug.get(previousSlug);
    const coverUrl = `${siteUrl}/covers/sl-local/${slug}.webp`;
    const coverAlt = credit?.alt || `Capa: ${item.title}`;
    const coverCaption = credit?.caption || `Imagem para “${item.title}”.`;
    const coverCredit = credit?.credit || "Empregos São Luís — capa editorial";
    const goLive = goLiveSet.has(i);
    const scheduledAt = goLive ? null : remainingSlots[scheduleIdx++];
    const status = goLive ? "PUBLISHED" : "SCHEDULED";
    const publishedAt = goLive ? now : null;
    const excerpt = `${item.lead}`.replace(/\s+/g, " ").trim().slice(0, 220);
    const metaDescription = excerpt.slice(0, 155);

    if (rewriteBodies) {
      const contentHtml = buildArticleHtml(item);
      await sql`
        update es_articles
        set type = ${item.type},
            title = ${item.title},
            slug = ${slug},
            excerpt = ${excerpt},
            status = ${status},
            published_at = ${publishedAt},
            scheduled_at = ${scheduledAt},
            seo_title = ${seoTitleFor(item.title)},
            meta_description = ${metaDescription},
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
            cover_image_variants = ${sql.json({})},
            news_eligible = ${item.type === "NEWS"},
            web_story_eligible = ${item.template === "POST_MAGNETICO"},
            updated_at = now()
        where id = ${row.id}
      `;
    } else {
      await sql`
        update es_articles
        set slug = ${slug},
            status = ${status},
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
            cover_image_variants = ${sql.json({})},
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
        catalogSize: catalog.length,
        insertedMissing: inserted,
        published,
        scheduled,
        publishedNow: publishedSlugs,
        coversUpdated: covers,
        bodiesRewritten: rewriteBodies,
        stillMissing: missing,
        note: "Corpo já em HTML (content_html). Capas em /covers/sl-local/. Rode no web Emprego São Luís."
      },
      null,
      2
    )
  );
} finally {
  await sql.end({ timeout: 5 });
}
