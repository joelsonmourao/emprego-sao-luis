import { and, desc, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { articles, categories, cities, companies, createDatabase, jobs, states, webStories } from "@es/db";
import { dedupeEntries, normalizeLastmod, type SitemapEntry } from "@es/seo";

const INSTITUTIONAL_PATHS = [
  "/",
  "/vagas-slz",
  "/quem-somos",
  "/contato",
  "/privacidade",
  "/termos",
  "/cookies",
  "/publicar-vaga",
  "/area-empresas",
  "/instagram"
];

export async function listSitemapEntries(
  category: "static" | "jobs" | "companies" | "cities" | "categories" | "blog" | "news" | "web-stories"
) {
  if (!process.env.DATABASE_URL) return [] as SitemapEntry[];
  const connection = createDatabase(process.env.DATABASE_URL);
  const siteUrl = process.env.SITE_URL ?? "http://localhost:4321";
  const toEntry = (
    path: string,
    lastmod?: Date | null,
    changefreq?: SitemapEntry["changefreq"],
    priority?: number
  ): SitemapEntry => {
    const entry: SitemapEntry = { loc: new URL(path, siteUrl).toString() };
    const normalized = normalizeLastmod(lastmod);
    if (normalized) entry.lastmod = normalized;
    if (changefreq) entry.changefreq = changefreq;
    if (priority !== undefined) entry.priority = priority;
    return entry;
  };
  try {
    if (category === "static") {
      const now = new Date();
      const [[activeJob], [activeCompany], [news], [guide]] = await Promise.all([
        connection.db.select({ id: jobs.id }).from(jobs).where(and(eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, now))).limit(1),
        connection.db.select({ id: companies.id }).from(companies).innerJoin(jobs, eq(jobs.companyId, companies.id)).where(and(eq(companies.active, true), eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, now))).limit(1),
        connection.db.select({ id: articles.id }).from(articles).where(and(eq(articles.status, "PUBLISHED"), eq(articles.type, "NEWS"))).limit(1),
        connection.db.select({ id: articles.id }).from(articles).where(and(eq(articles.status, "PUBLISHED"), inArray(articles.type, ["GUIDE", "DATA_REPORT"]))).limit(1)
      ]);
      const paths = [...INSTITUTIONAL_PATHS, ...(activeJob ? ["/vagas", "/categorias"] : []), ...(activeCompany ? ["/empresas"] : []), ...(news ? ["/noticias"] : []), ...(guide ? ["/blog"] : [])];
      return dedupeEntries(
        paths.map((path) =>
          toEntry(
            path,
            undefined,
            path === "/" || path === "/vagas-slz" ? "daily" : "monthly",
            path === "/" ? 1 : path === "/vagas-slz" ? 0.9 : 0.5
          )
        )
      );
    }
    if (category === "jobs") {
      const rows = await connection.db
        .select({ slug: jobs.slug, updatedAt: jobs.updatedAt })
        .from(jobs)
        .where(and(eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, new Date())))
        .orderBy(desc(jobs.updatedAt));
      return dedupeEntries(rows.map((row) => toEntry(`/vagas/${row.slug}`, row.updatedAt, "daily", 0.8)));
    }
    if (category === "companies") {
      const rows = await connection.db
        .select({ slug: companies.slug, updatedAt: companies.updatedAt })
        .from(companies)
        .innerJoin(jobs, eq(jobs.companyId, companies.id))
        .where(and(eq(companies.active, true), eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, new Date())))
        .groupBy(companies.id)
        .orderBy(desc(companies.updatedAt));
      return dedupeEntries(rows.map((row) => toEntry(`/empresas/${row.slug}`, row.updatedAt, "weekly", 0.6)));
    }
    if (category === "cities") {
      const rows = await connection.db
        .select({ slug: cities.slug, updatedAt: cities.updatedAt })
        .from(cities)
        .innerJoin(states, eq(cities.stateId, states.id))
        .innerJoin(jobs, eq(jobs.cityId, cities.id))
        .where(and(eq(cities.active, true), eq(states.code, "MA"), eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, new Date())))
        .groupBy(cities.id)
        .orderBy(desc(cities.updatedAt));
      return dedupeEntries(
        rows.map((row) => toEntry(`/vagas/cidade/${row.slug}`, row.updatedAt, "weekly", 0.7))
      );
    }
    if (category === "categories") {
      const rows = await connection.db
        .select({ slug: categories.slug, updatedAt: categories.updatedAt })
        .from(categories)
        .innerJoin(jobs, eq(jobs.categoryId, categories.id))
        .where(and(eq(categories.active, true), eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, new Date())))
        .groupBy(categories.id)
        .orderBy(desc(categories.updatedAt));
      return dedupeEntries(
        rows.map((row) => toEntry(`/categorias/${row.slug}`, row.updatedAt, "weekly", 0.6))
      );
    }
    if (category === "web-stories") {
      const now = new Date();
      const rows = await connection.db
        .select({ slug: webStories.slug, updatedAt: webStories.updatedAt })
        .from(webStories)
        .where(
          and(
            eq(webStories.status, "PUBLISHED"),
            or(isNull(webStories.expiresAt), gt(webStories.expiresAt, now))
          )
        )
        .orderBy(desc(webStories.updatedAt));
      return dedupeEntries(rows.map((row) => toEntry(`/web-stories/${row.slug}`, row.updatedAt, "weekly", 0.5)));
    }
    const articleTypes = category === "news" ? (["NEWS"] as const) : (["GUIDE", "DATA_REPORT"] as const);
    const rows = await connection.db
      .select({ slug: articles.slug, updatedAt: articles.updatedAt, type: articles.type })
      .from(articles)
      .where(and(eq(articles.status, "PUBLISHED"), inArray(articles.type, articleTypes)))
      .orderBy(desc(articles.updatedAt));
    return dedupeEntries(
      rows.map((row) =>
        toEntry(
          `/${category === "news" ? "noticias" : "blog"}/${row.slug}`,
          row.updatedAt,
          category === "news" ? "daily" : "weekly",
          category === "news" ? 0.7 : 0.5
        )
      )
    );
  } finally {
    await connection.close();
  }
}

export async function listSitemapManifest() {
  const categories = ["static", "jobs", "companies", "cities", "categories", "blog", "news", "web-stories"] as const;
  const siteUrl = process.env.SITE_URL ?? "http://localhost:4321";
  const files: Array<{ slug: string; loc: string; lastmod?: string; count: number }> = [];
  for (const category of categories) {
    const entries = await listSitemapEntries(category);
    const chunks = entries.length ? [entries] : [];
    if (category === "jobs" || category === "blog" || category === "news") {
      const size = 1000;
      const split: (typeof entries)[] = [];
      for (let index = 0; index < entries.length; index += size)
        split.push(entries.slice(index, index + size));
      chunks.splice(0, chunks.length, ...split);
    }
    chunks.forEach((chunk, index) => {
      const page = chunks.length > 1 ? `-${index + 1}` : "";
      const slug = `${category}${page}.xml`;
      const lastmod = chunk.reduce<string | undefined>(
        (latest, entry) =>
          !entry.lastmod ? latest : !latest || entry.lastmod > latest ? entry.lastmod : latest,
        undefined
      );
      const file: { slug: string; loc: string; count: number; lastmod?: string } = {
        slug,
        loc: new URL(`/sitemaps/${slug}`, siteUrl).toString(),
        count: chunk.length
      };
      if (lastmod) file.lastmod = lastmod;
      files.push(file);
    });
  }
  files.push({ slug: "google-news.xml", loc: new URL("/sitemap-news.xml", siteUrl).toString(), count: 0 });
  return files;
}
