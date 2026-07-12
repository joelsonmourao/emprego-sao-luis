import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { articles, categories, cities, companies, createDatabase, jobs, states } from "@es/db";
import { dedupeEntries, normalizeLastmod, type SitemapEntry } from "@es/seo";

const INSTITUTIONAL_PATHS = ["/", "/vagas", "/empresas", "/categorias", "/blog", "/noticias", "/quem-somos", "/contato", "/privacidade", "/termos", "/cookies", "/anunciar-vaga", "/instagram"];

export async function listSitemapEntries(category: "static" | "jobs" | "companies" | "cities" | "categories" | "blog") {
  if (!process.env.DATABASE_URL) return [] as SitemapEntry[];
  const connection = createDatabase(process.env.DATABASE_URL);
  const siteUrl = process.env.SITE_URL ?? "http://localhost:4321";
  const toEntry = (path: string, lastmod?: Date | null, changefreq?: SitemapEntry["changefreq"], priority?: number): SitemapEntry => {
    const entry: SitemapEntry = { loc: new URL(path, siteUrl).toString() };
    const normalized = normalizeLastmod(lastmod);
    if (normalized) entry.lastmod = normalized;
    if (changefreq) entry.changefreq = changefreq;
    if (priority !== undefined) entry.priority = priority;
    return entry;
  };
  try {
    if (category === "static") return dedupeEntries(INSTITUTIONAL_PATHS.map((path) => toEntry(path, undefined, path === "/" ? "daily" : "monthly", path === "/" ? 1 : 0.5)));
    if (category === "jobs") {
      const rows = await connection.db.select({ slug: jobs.slug, updatedAt: jobs.updatedAt }).from(jobs).where(and(eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, new Date()))).orderBy(desc(jobs.updatedAt));
      return dedupeEntries(rows.map((row) => toEntry(`/vagas/${row.slug}`, row.updatedAt, "daily", 0.8)));
    }
    if (category === "companies") {
      const rows = await connection.db.select({ slug: companies.slug, updatedAt: companies.updatedAt }).from(companies).where(eq(companies.active, true)).orderBy(desc(companies.updatedAt));
      return dedupeEntries(rows.map((row) => toEntry(`/empresas/${row.slug}`, row.updatedAt, "weekly", 0.6)));
    }
    if (category === "cities") {
      const rows = await connection.db.select({ slug: cities.slug, updatedAt: cities.updatedAt }).from(cities).innerJoin(states, eq(cities.stateId, states.id)).where(and(eq(cities.active, true), eq(states.code, "MA"))).orderBy(desc(cities.updatedAt));
      return dedupeEntries(rows.map((row) => toEntry(`/vagas/cidade/${row.slug}`, row.updatedAt, "weekly", 0.7)));
    }
    if (category === "categories") {
      const rows = await connection.db.select({ slug: categories.slug, updatedAt: categories.updatedAt }).from(categories).where(eq(categories.active, true)).orderBy(desc(categories.updatedAt));
      return dedupeEntries(rows.map((row) => toEntry(`/categorias/${row.slug}`, row.updatedAt, "weekly", 0.6)));
    }
    const rows = await connection.db.select({ slug: articles.slug, updatedAt: articles.updatedAt, type: articles.type }).from(articles).where(and(eq(articles.status, "PUBLISHED"), inArray(articles.type, ["GUIDE", "DATA_REPORT"]))).orderBy(desc(articles.updatedAt));
    return dedupeEntries(rows.map((row) => toEntry(`/blog/${row.slug}`, row.updatedAt, "weekly", 0.5)));
  } finally {
    await connection.close();
  }
}

export async function listSitemapManifest() {
  const categories = ["static", "jobs", "companies", "cities", "categories", "blog"] as const;
  const siteUrl = process.env.SITE_URL ?? "http://localhost:4321";
  const files: Array<{ slug: string; loc: string; lastmod?: string; count: number }> = [];
  for (const category of categories) {
    const entries = await listSitemapEntries(category);
    const chunks = entries.length ? [entries] : [];
    if (category === "jobs" || category === "blog") {
      const size = 1000;
      const split: typeof entries[] = [];
      for (let index = 0; index < entries.length; index += size) split.push(entries.slice(index, index + size));
      chunks.splice(0, chunks.length, ...split);
    }
    chunks.forEach((chunk, index) => {
      const page = chunks.length > 1 ? `-${index + 1}` : "";
      const slug = `${category}${page}.xml`;
      const lastmod = chunk.reduce<string | undefined>((latest, entry) => (!entry.lastmod ? latest : !latest || entry.lastmod > latest ? entry.lastmod : latest), undefined);
      const file: { slug: string; loc: string; count: number; lastmod?: string } = { slug, loc: new URL(`/sitemaps/${slug}`, siteUrl).toString(), count: chunk.length };
      if (lastmod) file.lastmod = lastmod;
      files.push(file);
    });
  }
  files.push({ slug: "news.xml", loc: new URL("/sitemap-news.xml", siteUrl).toString(), count: 0 });
  return files;
}
