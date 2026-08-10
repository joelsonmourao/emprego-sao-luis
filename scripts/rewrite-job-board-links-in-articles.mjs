/**
 * Reescreve links /vagas (e correlatos) no HTML persistido dos artigos,
 * para o corpus não depender só da reescrita em tempo de renderização.
 *
 * Uso (staging/local):
 *   DATABASE_URL=... node scripts/rewrite-job-board-links-in-articles.mjs --dry-run
 *   DATABASE_URL=... node scripts/rewrite-job-board-links-in-articles.mjs --write
 *
 * Produção exige confirmação explícita.
 * NÃO publica FACT_REVIEW nem reativa vagas.
 */
import { createDatabase, articles } from "@es/db";
import { sql } from "drizzle-orm";

const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const allowProd = args.has("--i-understand-production");
const dryRun = !write;

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

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL ausente — abortando.");
    process.exit(1);
  }
  const url = process.env.DATABASE_URL;
  const prodLike = /railway|render|supabase|neon|coolify|empregos/i.test(url) || process.env.NODE_ENV === "production";
  if (write && prodLike && !allowProd) {
    console.error("Produção: passe --i-understand-production junto com --write.");
    process.exit(1);
  }

  const connection = createDatabase(url);
  try {
    const rows = await connection.db
      .select({
        id: articles.id,
        slug: articles.slug,
        status: articles.status,
        contentHtml: articles.contentHtml
      })
      .from(articles)
      .limit(1000);

    let touched = 0;
    for (const row of rows) {
      const { html, changed } = rewrite(row.contentHtml);
      if (!changed) continue;
      touched += 1;
      console.log(`${dryRun ? "[dry]" : "[write]"} ${row.status} ${row.slug}`);
      if (write) {
        await connection.db
          .update(articles)
          .set({ contentHtml: html, updatedAt: new Date() })
          .where(sql`${articles.id} = ${row.id}`);
      }
    }
    console.log(`Artigos com links de job board: ${touched}/${rows.length}. mode=${dryRun ? "dry-run" : "write"}`);
  } finally {
    await connection.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
