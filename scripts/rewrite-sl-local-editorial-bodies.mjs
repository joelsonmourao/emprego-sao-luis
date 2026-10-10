#!/usr/bin/env node
/**
 * Reescreve corpos sl-local no CMS: H2 únicos por tema, links internos, sem CTA /vagas.
 * Opcionalmente coloca factuais inseguros em FACT_REVIEW/DRAFT.
 *
 * Dry-run:
 *   node scripts/rewrite-sl-local-editorial-bodies.mjs
 *
 * Coolify (/app), produção:
 *   ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 node scripts/rewrite-sl-local-editorial-bodies.mjs --write --i-understand-production
 *
 * Flags:
 *   --write
 *   --i-understand-production
 *   --hold-unsafe-factual   (default ON com --write; use --no-hold-unsafe-factual para desligar)
 *   --skip-hold             alias de --no-hold-unsafe-factual
 *
 * NÃO republica agenda. NÃO reativa vagas. NÃO toca FACT_REVIEW dos 8 guias adsense.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { SLUG_BASE, catalog, slugFor } from "./data/sl-local-editorial-catalog.mjs";
import { buildArticleHtml } from "./data/sl-local-article-html.mjs";

const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const understandProduction = args.has("--i-understand-production");
const holdUnsafe =
  write && !args.has("--no-hold-unsafe-factual") && !args.has("--skip-hold");
const allowProduction = process.env.ADSENSE_EDITORIAL_ALLOW_PRODUCTION === "1";
const databaseUrl = process.env.DATABASE_URL;
const siteUrl = (process.env.SITE_URL || "https://empregossaoluis.com.br").replace(/\/$/, "");

const FACTUAL_RE =
  /\b(clt|fgts|13|decimo|ferias|salario|inss|seguro.?desemprego|aprendiz|estagio|direito trabalh|holerite|abono|rescis|demiss|ctps|terceir|banco de horas|hora extra|contrato tempor|convencao|sindicato|periodo de experiencia)\b/i;

const OFFICIAL_SOURCE_RE = /\.(gov\.br|jus\.br)|planalto\.gov\.br|ibge\.gov\.br|dieese\.org\.br/i;

function describeDbUrl(url) {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port || "(default)",
      database: parsed.pathname.replace(/^\//, "")
    };
  } catch {
    return { error: "URL inválida" };
  }
}

function isFactualItem(item) {
  return FACTUAL_RE.test(`${item.title} ${item.keyword} ${item.section} ${item.lead}`);
}

function hasOfficialSource(row) {
  const blob = `${row.source_url || ""} ${JSON.stringify(row.sources || [])}`;
  return OFFICIAL_SOURCE_RE.test(blob);
}

function stripJobBoardHrefs(html) {
  return String(html || "").replace(
    /href=(["'])(\/(?:vagas|vagas-slz|slz|busca|alertas|publicar-vaga|anunciar-vaga|area-empresas|empresas|categorias|cidades)(?:\/[^"']*)?)\1/gi,
    (_m, q) => `href=${q}/blog${q}`
  );
}

if (!databaseUrl) {
  console.error("DATABASE_URL é obrigatória. PENDENTE DE EXECUÇÃO NO COOLIFY.");
  process.exit(1);
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

if (write && looksProduction && !(allowProduction && understandProduction)) {
  console.error("Produção: ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 e --i-understand-production.");
  process.exit(1);
}

const seoSlugs = catalog.map((item) => slugFor(item));
const sql = postgres(databaseUrl, { max: 1 });

const plan = [];
for (const item of catalog) {
  const slug = slugFor(item);
  const contentHtml = stripJobBoardHrefs(buildArticleHtml(item));
  const words = contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean)
    .length;
  const factual = isFactualItem(item);
  plan.push({ key: item.key, slug, words, factual, contentHtml, title: item.title, type: item.type });
}

console.log(
  JSON.stringify(
    {
      ok: true,
      dryRun: !write,
      holdUnsafeFactual: holdUnsafe,
      target,
      siteUrl,
      catalog: plan.length,
      uniqueSampleH2: plan.slice(0, 3).map((p) => ({
        slug: p.slug,
        words: p.words,
        factual: p.factual
      })),
      factualCount: plan.filter((p) => p.factual).length
    },
    null,
    2
  )
);

if (!write) {
  console.log("Dry-run OK. Passe --write para aplicar.");
  await sql.end();
  process.exit(0);
}

let updated = 0;
let held = 0;
let missing = 0;

await sql.begin(async (tx) => {
  for (const entry of plan) {
    const rows = await tx`
      select id, slug, status, source_url, sources, editorial_stage
      from es_articles
      where slug = ${entry.slug}
         or slug = ${`${SLUG_BASE}-${entry.key}`}
      limit 3
    `;
    const row =
      rows.find((r) => r.slug === entry.slug) ||
      rows.find((r) => r.slug === `${SLUG_BASE}-${entry.key}`) ||
      null;
    if (!row) {
      missing += 1;
      continue;
    }

    const shouldHold = holdUnsafe && entry.factual && !hasOfficialSource(row);
    if (shouldHold) {
      await tx`
        update es_articles
        set content_html = ${entry.contentHtml},
            editorial_stage = 'FACT_REVIEW',
            status = 'DRAFT',
            published_at = null,
            scheduled_at = null,
            updated_at = now()
        where id = ${row.id}
      `;
      held += 1;
    } else {
      await tx`
        update es_articles
        set content_html = ${entry.contentHtml},
            updated_at = now()
        where id = ${row.id}
      `;
    }
    updated += 1;
  }
});

console.log(JSON.stringify({ ok: true, updated, held, missing, holdUnsafe }, null, 2));
await sql.end();
