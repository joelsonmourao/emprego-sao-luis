import { unstable_cache } from "next/cache";
import { HubType } from "@prisma/client";

import { staticPages } from "@/data/seo-pages";
import { getCityJobsPath, getCompanyJobsPath, getJobPath } from "@/lib/seo/jobs-pages";
import { buildJovemAprendizCityUfPath } from "@/lib/seo/jovem-aprendiz-city-uf-slug";
import { shouldIndexPage } from "@/lib/seo/indexing";
import { getAllPublishedPostEntries } from "@/lib/repositories/blog";
import { getCities } from "@/lib/repositories/geo";
import { getHubProfiles } from "@/lib/repositories/hubs";
import { SITEMAP_MANIFEST_CACHE_TAG } from "@/lib/public-revalidate";
import { getAllActiveJobEntries, getApprenticeCityUfSitemapRows, getCompanyEntries, getCompanyHubs } from "@/lib/repositories/jobs";
import { getSiteOrigin } from "@/lib/site-url";
import { absoluteUrl } from "@/lib/utils";

export const SITEMAP_CHUNK_SIZE = 1000;

const ROOT_ROUTES_BY_CATEGORY = {
  home: ["/", "/vagas"],
  institutionals: ["/sobre", "/contato", "/politica-de-privacidade", "/politica-de-cookies", "/termos-de-uso", "/menor-aprendiz"],
  jobs: [],
  cities: ["/cidades"],
  companies: ["/empresas"],
  blog: ["/blog"],
  fresh: [],
  programmatic: []
} as const;

export type SitemapCategory =
  | "home"
  | "institutionals"
  | "jobs"
  | "cities"
  | "companies"
  | "blog"
  | "fresh"
  | "listings"
  | "programmatic";

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

  if (!timestamps.length) {
    return undefined;
  }

  return new Date(Math.max(...timestamps));
}

function isWithinFreshWindow(lastmod: string, now: Date, hours: number) {
  const date = new Date(lastmod);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return now.getTime() - date.getTime() <= hours * 60 * 60 * 1000;
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

  if (!deduped.length) {
    return [];
  }

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

function buildRootEntries(category: Exclude<SitemapCategory, "listings">, lastmod?: Date | string | null) {
  return ROOT_ROUTES_BY_CATEGORY[category].map((path) => toSitemapEntry(path, lastmod));
}

async function computeSitemapManifest(): Promise<SitemapManifest> {
  const [jobs, posts, cities, companies, companyHubs, cityProfiles, companyProfiles, apprenticeCityUfRows] = await Promise.all([
    getAllActiveJobEntries(),
    getAllPublishedPostEntries(),
    getCities(),
    getCompanyEntries(),
    getCompanyHubs(),
    getHubProfiles(HubType.CITY),
    getHubProfiles(HubType.COMPANY),
    getApprenticeCityUfSitemapRows()
  ]);

  const cityProfileMap = new Map(cityProfiles.map((profile) => [profile.slug, profile]));
  const companyProfileMap = new Map(companyProfiles.map((profile) => [profile.slug, profile]));
  const companyHubMap = new Map(companyHubs.map((company) => [company.slug, company]));
  const activeCityCounts = jobs.reduce<Map<string, number>>((map, job) => {
    map.set(job.city.slug, (map.get(job.city.slug) ?? 0) + 1);
    return map;
  }, new Map());

  const cityStateJobCounts = jobs.reduce<Map<string, number>>((map, job) => {
    const key = `${job.state.slug}__${job.city.slug}`;
    map.set(key, (map.get(key) ?? 0) + 1);
    return map;
  }, new Map());

  const institutionals = staticPages.filter((path) => ROOT_ROUTES_BY_CATEGORY.institutionals.includes(path as never));
  const latestJobsDate = jobs[0]?.updatedAt;
  const latestPostsDate = posts[0]?.updatedAt;
  const latestCitiesDate = cities[0]?.updatedAt;
  const latestCompaniesDate = companies[0]?.updatedAt;
  const latestSiteActivityDate = getLatestDate([latestJobsDate, latestPostsDate, latestCitiesDate, latestCompaniesDate]);

  const homeEntries = [
    toSitemapEntry("/", latestSiteActivityDate, { changefreq: "daily", priority: 1 }),
    toSitemapEntry("/vagas", latestJobsDate, { changefreq: "daily", priority: 0.9 })
  ];
  const institutionalEntries = institutionals.map((path) => toSitemapEntry(path, undefined, { changefreq: "monthly", priority: 0.4 }));
  const jobEntries = jobs.map((job) => toSitemapEntry(getJobPath(job.slug), job.updatedAt, { changefreq: "daily", priority: 0.8 }));

  const cityEntries = buildRootEntries("cities", latestCitiesDate).map((entry) => ({
    ...entry,
    changefreq: "weekly" as const,
    priority: 0.7
  }));
  const companyEntries = buildRootEntries("companies", latestCompaniesDate).map((entry) => ({
    ...entry,
    changefreq: "weekly" as const,
    priority: 0.5
  }));

  const listingsEntries: SitemapUrlEntry[] = [
    ...cities.flatMap((city) => {
      const profile = cityProfileMap.get(`${city.state.slug}__${city.slug}`);
      const shouldIndex = shouldIndexPage({
        kind: "city-listing",
        totalJobs: activeCityCounts.get(city.slug) ?? 0,
        hasSpecificMetadata: true,
        hasOwnContent: true,
        internalLinkCount: 6
      });

      if (profile?.noIndex || !shouldIndex) {
        return [];
      }

      return [toSitemapEntry(getCityJobsPath(city.slug), city.updatedAt, { changefreq: "daily", priority: 0.7 })];
    }),
    ...companies.flatMap((company) => {
      const profile = companyProfileMap.get(company.slug);
      const hub = companyHubMap.get(company.slug);
      const totalJobs = hub?.count ?? 0;
      const shouldIndex = shouldIndexPage({
        kind: "company-listing",
        totalJobs,
        hasSpecificMetadata: true,
        hasOwnContent: true,
        internalLinkCount: 5
      });

      if (profile?.noIndex || !shouldIndex) {
        return [];
      }

      return [toSitemapEntry(getCompanyJobsPath(company.slug), company.updatedAt, { changefreq: "weekly", priority: 0.5 })];
    })
  ];

  const blogEntries = [
    ...buildRootEntries("blog", latestPostsDate),
    ...posts.map((post) => toSitemapEntry(`/blog/${post.slug}`, post.updatedAt, { changefreq: "weekly", priority: 0.6 }))
  ];

  const programmaticEntries: SitemapUrlEntry[] = [
    ...apprenticeCityUfRows.map((row) =>
      toSitemapEntry(buildJovemAprendizCityUfPath(row.citySlug, row.stateCode), row.lastmod, { changefreq: "daily", priority: 0.75 })
    ),
    ...cities.flatMap((city) => {
      const total = cityStateJobCounts.get(`${city.state.slug}__${city.slug}`) ?? 0;
      if (total <= 0) return [];
      // Rotas programaticas de cidade ficam fora do sitemap para evitar duplicidade com /vagas/cidade/[slug].
      return [];
    }),
    ...companyHubs.flatMap(() => {
      // Rotas programaticas de empresa ficam fora do sitemap para evitar duplicidade com /empresa/[slug]/jovem-aprendiz.
      return [];
    })
  ];

  const freshWindowHours = Number.parseInt(process.env.SITEMAP_FRESH_WINDOW_HOURS ?? "72", 10);
  const now = new Date();
  const freshEntries = [
    ...homeEntries,
    ...jobEntries,
    ...cityEntries,
    ...companyEntries,
    ...blogEntries,
    ...programmaticEntries
  ].filter((entry) => entry.lastmod && isWithinFreshWindow(entry.lastmod, now, Number.isNaN(freshWindowHours) ? 72 : freshWindowHours));

  const files = [
    ...splitEntries("home", homeEntries),
    ...splitEntries("institutionals", institutionalEntries),
    ...splitEntries("jobs", jobEntries),
    ...splitEntries("cities", cityEntries),
    ...splitEntries("companies", companyEntries),
    ...splitEntries("blog", blogEntries),
    ...splitEntries("fresh", freshEntries),
    ...splitEntries("listings", listingsEntries),
    ...splitEntries("programmatic", programmaticEntries)
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
      companies: 0,
      blog: 0,
      fresh: 0,
      listings: 0,
      programmatic: 0
    } satisfies Record<SitemapCategory, number>
  );

  return { files, counts };
}

export const getSitemapManifest = unstable_cache(computeSitemapManifest, ["sitemap-manifest-v2"], {
  // TTL curto: em várias réplicas o revalidateTag só limpa o cache do processo que importou; as outras
  // recebem dados novos dentro deste intervalo mesmo sem tag.
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
      // Evita CDN/proxy segurar XML antigo por horas após import (revalidateTag não invalida cache HTTP).
      "Cache-Control": "public, max-age=0, s-maxage=120, stale-while-revalidate=600, must-revalidate"
    }
  });
}

/** XML válido quando o manifest não pode ser calculado (não chama DB nem SITE_URL). */
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
