#!/usr/bin/env node
/**
 * Reescreve links /vagas (e correlatos) no HTML persistido dos artigos,
 * para o corpus não depender só da reescrita em tempo de renderização.
 *
 * Dry-run:
 *   node scripts/rewrite-job-board-links-in-articles.mjs
 *   npm run rewrite:job-board-links -- --i-understand-production
 *
 * Coolify (/app), escrita:
 *   ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 npm run rewrite:job-board-links -- --write --i-understand-production
 *
 * Usa `postgres` (igual aos outros scripts Coolify) — não importa @es/db/TypeScript.
 * NÃO publica FACT_REVIEW nem reativa vagas. Só altera content_html de links/CTAs.
 */
import postgres from "postgres";

const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const understandProduction = args.has("--i-understand-production");
const allowProduction = process.env.ADSENSE_EDITORIAL_ALLOW_PRODUCTION === "1";
const dryRun = !write;
const databaseUrl = process.env.DATABASE_URL;

const JOB_BOARD_HREF =
  /href=(["'])(\/(?:vagas|vagas-slz|slz|slz-vagas|slz-empregos|empregos-slz|busca|alertas|publicar-vaga|anunciar-vaga|area-empresas|empresas|categorias|cidades)(?:\/[^"']*)?)\1/gi;

function portalSafeHref(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (
    path.startsWith("/publicar-vaga") ||
    path.startsWith("/anunciar-vaga") ||
    path.startsWith("/area-empresas")
  ) {
    return "/contato";
  }
  return "/blog";
}

function rewrite(html) {
  if (!html) return { html, changed: false };
  let changed = false;
  const out = html.replace(JOB_BOARD_HREF, (_full, quote, path) => {
    changed = true;
    return `href=${quote}${portalSafeHref(path)}${quote}`;
  });
  return { html: out, changed };
}

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

if (!databaseUrl) {
  console.error("DATABASE_URL ausente — abortando.");
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
  process.env.NODE_ENV === "production" ||
  hostLooksDockerInternal;

if (write && looksProduction && !(allowProduction && understandProduction)) {
  console.error(
    "Produção: ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 e --i-understand-production são obrigatórios com --write."
  );
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1 });

try {
  const rows = await sql`
    select id, slug, status, content_html as "contentHtml"
    from es_articles
    order by updated_at desc
    limit 1000
  `;

  let touched = 0;
  const preview = [];

  if (write) {
    await sql.begin(async (tx) => {
      for (const row of rows) {
        const { html, changed } = rewrite(row.contentHtml);
        if (!changed) continue;
        touched += 1;
        preview.push(row.slug);
        await tx`
          update es_articles
          set content_html = ${html},
              updated_at = now()
          where id = ${row.id}
        `;
      }
    });
  } else {
    for (const row of rows) {
      const { changed } = rewrite(row.contentHtml);
      if (!changed) continue;
      touched += 1;
      preview.push(`${row.status} ${row.slug}`);
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun,
        write,
        target: { host: target.host, database: target.database },
        scanned: rows.length,
        withJobBoardLinks: touched,
        sample: preview.slice(0, 15)
      },
      null,
      2
    )
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
