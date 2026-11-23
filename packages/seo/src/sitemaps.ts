import { escapeXml } from "./index.js";

export const SITEMAP_CHUNK_SIZE = 1000;

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export function normalizeLastmod(value?: Date | string | null) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function buildSitemapIndex(files: Array<{ loc: string; lastmod?: string }>) {
  const body = files.map((file) => `<sitemap><loc>${escapeXml(file.loc)}</loc>${file.lastmod ? `<lastmod>${escapeXml(file.lastmod)}</lastmod>` : ""}</sitemap>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
}

export function buildUrlSet(entries: SitemapEntry[]) {
  const body = entries.map((entry) => `<url><loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""}${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ""}${entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : ""}</url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export function chunkEntries<T>(entries: T[], size = SITEMAP_CHUNK_SIZE) {
  const chunks: T[][] = [];
  for (let index = 0; index < entries.length; index += size) chunks.push(entries.slice(index, index + size));
  return chunks;
}

export function dedupeEntries(entries: SitemapEntry[]) {
  return Array.from(new Map(entries.map((entry) => [entry.loc, entry])).values());
}
