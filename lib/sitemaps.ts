import { unstable_cache } from "next/cache";

import { JOB_CATEGORIES } from "@/lib/job-categories";
import { getCityJobsPath, getCompanyJobsPath, getJobPath } from "@/lib/seo/jobs-pages";
import { shouldIndexPage } from "@/lib/seo/indexing";
import { getAllPublishedPostEntries } from "@/lib/repositories/blog";
import { getCities } from "@/lib/repositories/geo";
import { SITEMAP_MANIFEST_CACHE_TAG } from "@/lib/public-revalidate";
import { getAllActiveJobEntries, getCompanyEntries } from "@/lib/repositories/jobs";
import { getSiteOrigin } from "@/lib/site-url";
import { absoluteUrl } from "@/lib/utils";

export const SITEMAP_CHUNK_SIZE = 1000;

const INSTITUTIONAL_ROUTES = [
  "/sobre",
  "/quem-somos",
  "/contato",
  "/anunciar-vaga",
  "/privacidade",
  "/termos",
  "/cookies",
  "/categorias"
] as const;

export type SitemapCategory = "home" | "institutionals" | "jobs" | "cities" | "categories" | "companies" | "blog" | "listings";

export type SitemapUrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export type SitemapFile = {
  slug: string;
  category: SitemapCategory;
  page: number;
  urlCount: number;
  lastmod?: string;
  entries: SitemapUrlEntry[];
};

export type SitemapManifest = {
  files: SitemapFile[];
  counts: Record<SitemapCategory, number>;
};

function normalizeDate(value?: Date | string | null) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function getLatestDate(values: Array<Date | string | null | undefined>) {
  const timestamps = values
    .map((value) => {
      if (!value) return null;
      const date = value instanceof Date ? value : new Date(value);
      return Number.isNaN(date.getTime()) ? null : date.getTime();
    })
    .filter((value): value is number => value !== null);

  if (!timestamps.length) return undefined;
  return new Date(Math.max(...timestamps));
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toSitemapEntry(
  path: string,
  lastmod?: Date | string | null,
  seo?: { changefreq?: SitemapUrlEntry["changefreq"]; priority?: number }
): SitemapUrlEntry {
  return {
    loc: absoluteUrl(path),
    lastmod: normalizeDate(lastmod),
    changefreq: seo?.changefreq,
    priority: seo?.priority
  };
}

function getLatestLastmod(entries: SitemapUrlEntry[]) {
  return entries.reduce<string | undefined>((latest, entry) => {
    if (!entry.lastmod) return latest;
    if (!latest) return entry.lastmod;
    return entry.lastmod > latest ? entry.lastmod : latest;
  }, undefined);
}

function splitEntries(category: SitemapCategory, entries: SitemapUrlEntry[]): SitemapFile[] {
  const deduped = Array.from(new Map(entries.map((entry) => [entry.loc, entry])).values());
  if (!deduped.length) return [];

  const files: SitemapFile[] = [];
  for (let index = 0; index < deduped.length; index += SITEMAP_CHUNK_SIZE) {
    const page = Math.floor(index / SITEMAP_CHUNK_SIZE) + 1;
    const chunk = deduped.slice(index, index + SITEMAP_CHUNK_SIZE);
    files.push({
      slug: `${category}-${page}.xml`,
      category,
      page,
      urlCount: chunk.length,
      lastmod: getLatestLastmod(chunk),
      entries: chunk
    });
  }
  return files;
}

async function computeSitemapManifest(): Promise<SitemapManifest> {
  const [jobs, posts, cities, companies] = await Promise.all([
    getAllActiveJobEntries(),
    getAllPublishedPostEntries(),
    getCities(),
    getCompanyEntries()
  ]);

  const maranhaoCities = cities.filter((city) => city.state.code === "MA");
  const maranhaoJobs = jobs.filter((job) => job.state.code === "MA");

  const activeCityCounts = maranhaoJobs.reduce<Map<string, number>>((map, job) => {
    map.set(job.city.slug, (map.get(job.city.slug) ?? 0) + 1);
    return map;
  }, new Map());

  const latestJobsDate = maranhaoJobs[0]?.updatedAt;
  const latestPostsDate = posts[0]?.updatedAt;
  const latestCitiesDate = maranhaoCities[0]?.updatedAt;
  const latestCompaniesDate = companies[0]?.updatedAt;
  const latestSiteActivityDate = getLatestDate([latestJobsDate, latestPostsDate, latestCitiesDate, latestCompaniesDate]);

  const homeEntries = [
    toSitemapEntry("/", latestSiteActivityDate, { changefreq: "daily", priority: 1 }),
    toSitemapEntry("/vagas", latestJobsDate, { changefreq: "daily", priority: 0.9 })
  ];

  const institutionalEntries = INSTITUTIONAL_ROUTES.map((path) =>
    toSitemapEntry(path, undefined, { changefreq: "monthly", priority: 0.4 })
  );

  const jobEntries = maranhaoJobs.map((job) =>
    toSitemapEntry(getJobPath(job.slug), job.updatedAt, { changefreq: "daily", priority: 0.8 })
  );

  const cityEntries = maranhaoCities.flatMap((city) => {
    const totalJobs = activeCityCounts.get(city.slug) ?? 0;
    const shouldIndex = shouldIndexPage({
      kind: "city-listing",
      totalJobs,
      hasSpecificMetadata: true,
      hasOwnContent: true,
      internalLinkCount: 6
    });
    if (!shouldIndex || totalJobs <= 0) return [];
    return [toSitemapEntry(getCityJobsPath(city.slug), city.updatedAt, { changefreq: "daily", priority: 0.7 })];
  });

  const categoryEntries = JOB_CATEGORIES.map((category) =>
    toSitemapEntry(`/vagas/categoria/${category.slug}`, latestJobsDate, { changefreq: "weekly", priority: 0.6 })
  );

  const companyEntries = [
    toSitemapEntry("/empresas", latestCompaniesDate, { changefreq: "weekly", priority: 0.5 }),
    ...companies
      .filter((company) => company.state?.code === "MA")
      .map((company) => toSitemapEntry(getCompanyJobsPath(company.slug), company.updatedAt, { changefreq: "weekly", priority: 0.5 }))
  ];

  const blogEntries = [
    toSitemapEntry("/blog", latestPostsDate, { changefreq: "weekly", priority: 0.6 }),
    ...posts.map((post) => toSitemapEntry(`/blog/${post.slug}`, post.updatedAt, { changefreq: "weekly", priority: 0.6 }))
  ];

  const files = [
    ...splitEntries("home", homeEntries),
    ...splitEntries("institutionals", institutionalEntries),
    ...splitEntries("jobs", jobEntries),
    ...splitEntries("cities", cityEntries),
    ...splitEntries("categories", categoryEntries),
    ...splitEntries("companies", companyEntries),
    ...splitEntries("blog", blogEntries)
  ];

  const counts = files.reduce(
    (accumulator, file) => {
      accumulator[file.category] += file.urlCount;
      return accumulator;
    },
    {
      home: 0,
      institutionals: 0,
      jobs: 0,
      cities: 0,
      categories: 0,
      companies: 0,
      blog: 0,
      listings: 0
    } satisfies Record<SitemapCategory, number>
  );

  return { files, counts };
}

export const getSitemapManifest = unstable_cache(computeSitemapManifest, ["sitemap-manifest-emprego-sl-v1"], {
  revalidate: 180,
  tags: [SITEMAP_MANIFEST_CACHE_TAG]
});

export function buildSitemapIndexXml(files: SitemapFile[]) {
  const xml = files
    .map((file) => {
      const lastmod = file.lastmod ? `<lastmod>${escapeXml(file.lastmod)}</lastmod>` : "";
      return `<sitemap><loc>${escapeXml(absoluteUrl(`/sitemaps/${file.slug}`))}</loc>${lastmod}</sitemap>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</sitemapindex>`;
}

export function buildUrlSetXml(entries: SitemapUrlEntry[]) {
  const xml = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
      const changefreq = entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : "";
      const priority = typeof entry.priority === "number" ? `<priority>${entry.priority.toFixed(1)}</priority>` : "";
      return `<url><loc>${escapeXml(entry.loc)}</loc>${lastmod}${changefreq}${priority}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`;
}

export function findSitemapFile(slug: string, files: SitemapFile[]) {
  return files.find((file) => file.slug === slug);
}

export function createXmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=120, stale-while-revalidate=600, must-revalidate"
    }
  });
}

const EMPTY_SITEMAP_INDEX_XML =
  '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>';

export function buildEmptySitemapIndexXml() {
  return EMPTY_SITEMAP_INDEX_XML;
}

export function buildEmptyUrlSetXml() {
  return buildUrlSetXml([]);
}

export function assertSitemapOriginSafety(xml: string) {
  const origin = getSiteOrigin();
  if (origin.includes("localhost") || origin.includes("vercel.app")) {
    throw new Error("A origem publica do sitemap precisa usar o dominio proprio configurado em SITE_URL.");
  }
  return xml;
}
