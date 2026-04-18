import { cache } from "react";
import { HubType } from "@prisma/client";

import { staticPages } from "@/data/seo-pages";
import { buildJobsSearchCanonicalPath } from "@/lib/listing";
import { getHubProfiles } from "@/lib/repositories/hubs";
import { getAllPublishedPostEntries } from "@/lib/repositories/blog";
import { getAllActiveJobEntries, getCompanyEntries } from "@/lib/repositories/jobs";
import { getCities, getStates } from "@/lib/repositories/geo";
import { getSiteOrigin } from "@/lib/site-url";
import { absoluteUrl } from "@/lib/utils";

export const SITEMAP_CHUNK_SIZE = 1000;

const ROOT_ROUTES_BY_CATEGORY = {
  home: ["/"],
  institutionals: ["/sobre", "/contato", "/politica-de-privacidade", "/politica-de-cookies", "/termos-de-uso"],
  jobs: ["/vagas"],
  states: ["/estados"],
  cities: ["/cidades"],
  companies: ["/empresas"],
  blog: ["/blog"]
} as const;

const JOB_QUERY_STOPWORDS = new Set([
  "aprendiz",
  "jovem",
  "vaga",
  "vagas",
  "programa",
  "para",
  "com",
  "sem",
  "uma",
  "um",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "na",
  "no",
  "nas",
  "nos",
  "em",
  "e",
  "ou"
]);

export type SitemapCategory =
  | "home"
  | "institutionals"
  | "jobs"
  | "states"
  | "cities"
  | "companies"
  | "blog"
  | "listings";

export type SitemapUrlEntry = {
  loc: string;
  lastmod?: string;
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

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeSearchQuery(value: string) {
  return stripAccents(value).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function deriveStrategicJobQuery(input: { title: string; cityName: string; stateName: string; stateCode: string }) {
  const locationTokens = new Set(
    [input.cityName, input.stateName, input.stateCode]
      .flatMap((value) => normalizeSearchQuery(value).split(" "))
      .filter(Boolean)
  );

  const normalized = normalizeSearchQuery(input.title)
    .replace(/\bjovem aprendiz\b/g, " ")
    .replace(/\baprendiz\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return null;

  const words = normalized
    .split(" ")
    .filter(
      (word) =>
        word.length >= 3 &&
        !JOB_QUERY_STOPWORDS.has(word) &&
        !locationTokens.has(word) &&
        !/\d/.test(word)
    );

  if (!words.length) return null;

  const query = words.slice(0, 2).join(" ").trim();
  return query.length >= 3 ? query : null;
}

function toSitemapEntry(path: string, lastmod?: Date | string | null): SitemapUrlEntry {
  return {
    loc: absoluteUrl(path),
    lastmod: normalizeDate(lastmod)
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

function resolveDefaultPathForProfile(defaultPath: string, canonicalUrl?: string | null) {
  if (!canonicalUrl) {
    return defaultPath;
  }

  try {
    const origin = getSiteOrigin();
    const canonical = new URL(canonicalUrl, origin);

    if (canonical.origin !== origin) {
      return null;
    }

    const resolvedPath = `${canonical.pathname}${canonical.search}`.replace(/\/$/, "") || "/";
    const normalizedDefault = defaultPath.replace(/\/$/, "") || "/";

    return resolvedPath === normalizedDefault ? defaultPath : null;
  } catch {
    return defaultPath;
  }
}

function buildRootEntries(category: Exclude<SitemapCategory, "listings">, lastmod?: Date | string | null) {
  return ROOT_ROUTES_BY_CATEGORY[category].map((path) => toSitemapEntry(path, lastmod));
}

function buildStrategicListingEntries(
  jobs: Awaited<ReturnType<typeof getAllActiveJobEntries>>
): SitemapUrlEntry[] {
  const cityCounts = new Map<string, { total: number; stateSlug: string; citySlug: string; lastmod?: string }>();
  const cityBaseCounts = new Map<string, { total: number; stateSlug: string; citySlug: string; lastmod?: string }>();

  for (const job of jobs) {
    const query = deriveStrategicJobQuery({
      title: job.title,
      cityName: job.city.name,
      stateName: job.state.name,
      stateCode: job.state.code
    });

    if (!query) {
      continue;
    }

    const cityKey = `${query}__${job.state.slug}__${job.city.slug}`;
    const cityBaseKey = `${job.state.slug}__${job.city.slug}`;
    const lastmod = normalizeDate(job.updatedAt);

    const cityEntry = cityCounts.get(cityKey) ?? {
      total: 0,
      stateSlug: job.state.slug,
      citySlug: job.city.slug,
      lastmod
    };
    cityEntry.total += 1;
    cityEntry.lastmod = !cityEntry.lastmod || (lastmod && lastmod > cityEntry.lastmod) ? lastmod : cityEntry.lastmod;
    cityCounts.set(cityKey, cityEntry);

    const cityBaseEntry = cityBaseCounts.get(cityBaseKey) ?? {
      total: 0,
      stateSlug: job.state.slug,
      citySlug: job.city.slug,
      lastmod
    };
    cityBaseEntry.total += 1;
    cityBaseEntry.lastmod = !cityBaseEntry.lastmod || (lastmod && lastmod > cityBaseEntry.lastmod) ? lastmod : cityBaseEntry.lastmod;
    cityBaseCounts.set(cityBaseKey, cityBaseEntry);
  }

  const entries = new Map<string, SitemapUrlEntry>();

  for (const data of cityBaseCounts.values()) {
    if (data.total < 1) {
      continue;
    }

    const path = buildJobsSearchCanonicalPath({
      total: data.total,
      stateSlug: data.stateSlug,
      citySlug: data.citySlug,
      order: "relevance",
      page: 1
    });

    entries.set(path, toSitemapEntry(path, data.lastmod));
  }

  for (const [key, data] of cityCounts.entries()) {
    const [query] = key.split("__");
    if (data.total < 1) {
      continue;
    }

    const path = buildJobsSearchCanonicalPath({
      total: data.total,
      query,
      stateSlug: data.stateSlug,
      citySlug: data.citySlug,
      order: "relevance",
      page: 1
    });

    entries.set(path, toSitemapEntry(path, data.lastmod));
  }

  return Array.from(entries.values()).sort((a, b) => a.loc.localeCompare(b.loc));
}

export const getSitemapManifest = cache(async (): Promise<SitemapManifest> => {
  const [jobs, posts, states, cities, companies, stateProfiles, cityProfiles, companyProfiles] = await Promise.all([
    getAllActiveJobEntries(),
    getAllPublishedPostEntries(),
    getStates(),
    getCities(),
    getCompanyEntries(),
    getHubProfiles(HubType.STATE),
    getHubProfiles(HubType.CITY),
    getHubProfiles(HubType.COMPANY)
  ]);

  const stateProfileMap = new Map(stateProfiles.map((profile) => [profile.slug, profile]));
  const cityProfileMap = new Map(cityProfiles.map((profile) => [profile.slug, profile]));
  const companyProfileMap = new Map(companyProfiles.map((profile) => [profile.slug, profile]));

  const institutionals = staticPages.filter((path) => ROOT_ROUTES_BY_CATEGORY.institutionals.includes(path as never));

  const homeEntries = buildRootEntries("home", new Date());
  const institutionalEntries = institutionals.map((path) => toSitemapEntry(path, new Date()));

  const jobEntries = [
    ...buildRootEntries("jobs", jobs[0]?.updatedAt ?? new Date()),
    ...jobs.map((job) => toSitemapEntry(`/vagas/${job.slug}`, job.updatedAt))
  ];

  const stateEntries = [
    ...buildRootEntries("states", states[0]?.updatedAt ?? new Date()),
    ...states.flatMap((state) => {
      const profile = stateProfileMap.get(state.slug);
      const directoryPath = resolveDefaultPathForProfile(`/estados/${state.slug}`, profile?.canonicalUrl);
      const jobsPath = resolveDefaultPathForProfile(`/vagas/estado/${state.slug}`, profile?.canonicalUrl);

      if (profile?.noIndex) {
        return [];
      }

      return [directoryPath ? toSitemapEntry(directoryPath, state.updatedAt) : null, jobsPath ? toSitemapEntry(jobsPath, state.updatedAt) : null].filter(
        (entry): entry is SitemapUrlEntry => Boolean(entry)
      );
    })
  ];

  const cityEntries = [
    ...buildRootEntries("cities", cities[0]?.updatedAt ?? new Date()),
    ...cities.flatMap((city) => {
      const profileKey = `${city.state.slug}__${city.slug}`;
      const profile = cityProfileMap.get(profileKey);

      if (profile?.noIndex) {
        return [];
      }

      const path = resolveDefaultPathForProfile(`/vagas/estado/${city.state.slug}/${city.slug}`, profile?.canonicalUrl);
      return path ? [toSitemapEntry(path, city.updatedAt)] : [];
    })
  ];

  const companyEntries = [
    ...buildRootEntries("companies", companies[0]?.updatedAt ?? new Date()),
    ...companies.flatMap((company) => {
      const profile = companyProfileMap.get(company.slug);

      if (profile?.noIndex) {
        return [];
      }

      const path = resolveDefaultPathForProfile(`/empresas/${company.slug}`, profile?.canonicalUrl);
      return path ? [toSitemapEntry(path, company.updatedAt)] : [];
    })
  ];

  const blogEntries = [
    ...buildRootEntries("blog", posts[0]?.updatedAt ?? new Date()),
    ...posts.map((post) => toSitemapEntry(`/blog/${post.slug}`, post.updatedAt))
  ];

  const listingEntries = buildStrategicListingEntries(jobs);

  const files = [
    ...splitEntries("home", homeEntries),
    ...splitEntries("institutionals", institutionalEntries),
    ...splitEntries("jobs", jobEntries),
    ...splitEntries("states", stateEntries),
    ...splitEntries("cities", cityEntries),
    ...splitEntries("companies", companyEntries),
    ...splitEntries("blog", blogEntries),
    ...splitEntries("listings", listingEntries)
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
      states: 0,
      cities: 0,
      companies: 0,
      blog: 0,
      listings: 0
    } satisfies Record<SitemapCategory, number>
  );

  return {
    files,
    counts
  };
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
      return `<url><loc>${escapeXml(entry.loc)}</loc>${lastmod}</url>`;
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
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}

export function assertSitemapOriginSafety(xml: string) {
  const origin = getSiteOrigin();
  if (origin.includes("localhost") || origin.includes("vercel.app")) {
    throw new Error("A origem publica do sitemap precisa usar o dominio proprio configurado em SITE_URL.");
  }

  return xml;
}
