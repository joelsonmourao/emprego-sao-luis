#!/usr/bin/env node
/**
 * Auditoria programática somente leitura das rotas críticas no ambiente isolado.
 * Uso: node scripts/audit-critical-routes.mjs [baseUrl]
 */
const base = (process.argv[2] || process.env.E2E_BASE_URL || "http://127.0.0.1:4321").replace(/\/$/, "");

const staticPaths = [
  "/",
  "/vagas",
  "/blog",
  "/noticias",
  "/empresas",
  "/publicar-vaga",
  "/politica-editorial",
  "/politica-fontes",
  "/politica-correcoes",
  "/privacidade",
  "/termos",
  "/cookies",
  "/seguranca-candidatos",
  "/sitemap.xml",
  "/robots.txt",
  "/vagas/s"
];

function pick(html, re) {
  const match = html.match(re);
  return match?.[1]?.trim() ?? "";
}

async function fetchJobSlugs() {
  const databaseUrl = process.env.E2E_DATABASE_URL || process.env.DATABASE_URL;
  if (!databaseUrl) return [];
  try {
    const postgres = (await import("postgres")).default;
    const sql = postgres(databaseUrl, { max: 1, prepare: false });
    try {
      const rows = await sql`
        select distinct on (channel) slug, channel from (
          select slug, 'url' as channel from es_jobs
          where publication_status = 'PUBLISHED' and application_url is not null and expires_at > now()
          union all
          select slug, 'whatsapp' as channel from es_jobs
          where publication_status = 'PUBLISHED' and application_whatsapp is not null and expires_at > now()
          union all
          select slug, 'email' as channel from es_jobs
          where publication_status = 'PUBLISHED' and application_email is not null and expires_at > now()
          union all
          select slug, 'multi' as channel from es_jobs
          where publication_status = 'PUBLISHED'
            and application_url is not null
            and application_whatsapp is not null
            and application_email is not null
            and expires_at > now()
        ) t
      `;
      return rows.map((row) => `/vagas/${row.slug}`);
    } finally {
      await sql.end({ timeout: 5 });
    }
  } catch {
    return [];
  }
}

async function auditPath(path) {
  const response = await fetch(`${base}${path}`, { redirect: "manual" });
  const status = response.status;
  const location = response.headers.get("location") || "";
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("text") || contentType.includes("xml") || contentType.includes("json")
    ? await response.text()
    : "";
  return {
    path,
    status,
    location,
    title: pick(body, /<title>([^<]+)<\/title>/i),
    description: pick(body, /name=["']description["'] content=["']([^"']+)["']/i),
    canonical: pick(body, /rel=["']canonical["'] href=["']([^"']+)["']/i),
    robots: pick(body, /name=["']robots["'] content=["']([^"']+)["']/i),
    h1: pick(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, "").trim(),
    jsonLd: /application\/ld\+json/i.test(body),
    placeholder: /\[configur[aá]vel no painel administrativo\]/i.test(body),
    adsense: /pagead\/js\/adsbygoogle\.js|data-ad-client=["']ca-pub-/i.test(body),
    sitemapXml: /<(urlset|sitemapindex)[\s>]/i.test(body)
  };
}

const jobPaths = await fetchJobSlugs();
const paths = [...new Set([...staticPaths, ...jobPaths])];
const rows = [];
for (const path of paths) {
  try {
    rows.push(await auditPath(path));
  } catch (error) {
    rows.push({
      path,
      status: 0,
      location: "",
      title: "",
      description: "",
      canonical: "",
      robots: "",
      h1: "",
      jsonLd: false,
      placeholder: false,
      adsense: false,
      sitemapXml: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

const sitemap = rows.find((row) => row.path === "/sitemap.xml");
const childPaths = [];
if (sitemap?.status === 200) {
  const indexBody = await (await fetch(`${base}/sitemap.xml`)).text();
  const locs = [...indexBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  for (const loc of locs) {
    const url = new URL(loc);
    const path = url.pathname + url.search;
    childPaths.push(path);
    rows.push(await auditPath(path));
  }
}

const blockers = rows.filter(
  (row) =>
    row.placeholder ||
    row.adsense ||
    row.status === 0 ||
    (row.path === "/vagas/s" && ![301, 302, 303, 307, 308, 404].includes(row.status)) ||
    (["/sitemap.xml", "/robots.txt"].includes(row.path) && row.status !== 200)
);

console.log(
  JSON.stringify(
    {
      ok: blockers.length === 0,
      base,
      checked: rows.length,
      sitemapChildren: childPaths.length,
      blockers,
      rows
    },
    null,
    2
  )
);
process.exit(blockers.length ? 1 : 0);
