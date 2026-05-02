#!/usr/bin/env node
/**
 * Auditoria SEO local: status HTTP, canonical, robots meta, presença de JSON-LD (heurística).
 * Uso: SITE_URL=https://slzcontent.com.br node scripts/audit-seo.mjs
 *    ou: node scripts/audit-seo.mjs https://localhost:3000
 */

const base =
  process.argv[2]?.trim() ||
  process.env.SITE_URL?.trim() ||
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "http://127.0.0.1:3000";

const paths = [
  "/robots.txt",
  "/sitemap.xml",
  "/vagas",
  "/vagas/jovem-aprendiz/sao-luis-ma",
  "/vagas/cidade/sao-luis-ma",
  "/vagas/estado/ma",
  "/blog"
];

function abs(path) {
  return new URL(path, base.replace(/\/?$/, "/")).toString();
}

function pickCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) return null;
  const href = m[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

function pickRobotsMeta(html) {
  const m = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
  if (!m) return null;
  const c = m[0].match(/content=["']([^"']+)["']/i);
  return c ? c[1] : null;
}

function countJsonLdType(html, type) {
  const re = new RegExp(`"@type"\\s*:\\s*"${type}"`, "g");
  return (html.match(re) || []).length;
}

async function audit(path) {
  const url = abs(path);
  const res = await fetch(url, { redirect: "manual" });
  const html = res.headers.get("content-type")?.includes("text/html") ? await res.text() : "";
  const canonical = html ? pickCanonical(html) : null;
  const robotsMeta = html ? pickRobotsMeta(html) : null;
  const jobPosting = html ? countJsonLdType(html, "JobPosting") : 0;
  const itemList = html ? countJsonLdType(html, "ItemList") : 0;
  const breadcrumb = html ? countJsonLdType(html, "BreadcrumbList") : 0;
  const faq = html ? countJsonLdType(html, "FAQPage") : 0;

  return {
    path,
    url,
    status: res.status,
    location: res.headers.get("location"),
    canonical,
    robotsMeta,
    jobPosting,
    itemList,
    breadcrumb,
    faq
  };
}

const rows = [];
for (const p of paths) {
  try {
    rows.push(await audit(p));
  } catch (e) {
    rows.push({ path: p, error: String(e) });
  }
}

console.log(JSON.stringify({ base, rows }, null, 2));

let exit = 0;
for (const r of rows) {
  if (r.error) {
    console.error("FAIL", r.path, r.error);
    exit = 1;
    continue;
  }
  if (r.path.startsWith("/vagas/jovem-aprendiz/") && r.path.split("/").length > 4) {
    if (r.status !== 200) {
      console.error("FAIL", r.path, "expected 200, got", r.status);
      exit = 1;
    }
    if (r.jobPosting !== 0) {
      console.error("FAIL", r.path, "JobPosting count should be 0 on list, got", r.jobPosting);
      exit = 1;
    }
  }
}

process.exit(exit);
