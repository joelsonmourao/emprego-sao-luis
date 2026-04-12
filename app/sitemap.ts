import type { MetadataRoute } from "next";

import { staticPages } from "@/data/seo-pages";
import { absoluteUrl } from "@/lib/utils";
import { getAllPublishedPostEntries } from "@/lib/repositories/blog";
import { getAllActiveJobEntries, getCompanyEntries } from "@/lib/repositories/jobs";
import { getCities, getStates } from "@/lib/repositories/geo";

function normalizeQueryForSitemap(title: string) {
  return title.trim().replace(/\s+/g, " ").replace(/^jovem aprendiz\s+/i, "").replace(/^em\s+/i, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, posts, states, cities, companies] = await Promise.all([
    getAllActiveJobEntries(),
    getAllPublishedPostEntries(),
    getStates(),
    getCities(),
    getCompanyEntries()
  ]);
  const strategicSearchUrls = new Map<string, Date>();

  jobs.forEach((job) => {
    const query = normalizeQueryForSitemap(job.title);
    if (query.length < 2 || query.length > 80) return;

    const cityParams = new URLSearchParams({
      q: query,
      estado: job.state.slug,
      cidade: job.city.slug
    });
    strategicSearchUrls.set(absoluteUrl(`/vagas?${cityParams.toString()}`), job.updatedAt);

    const stateParams = new URLSearchParams({
      q: query,
      estado: job.state.slug
    });
    strategicSearchUrls.set(absoluteUrl(`/vagas?${stateParams.toString()}`), job.updatedAt);
  });

  return [
    ...staticPages.map((path) => ({ url: absoluteUrl(path), lastModified: new Date() })),
    ...jobs.map((job) => ({ url: absoluteUrl(`/vagas/${job.slug}`), lastModified: job.updatedAt })),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updatedAt })),
    ...states.flatMap((state) => [
      { url: absoluteUrl(`/estados/${state.slug}`), lastModified: state.updatedAt },
      { url: absoluteUrl(`/vagas/estado/${state.slug}`), lastModified: state.updatedAt }
    ]),
    ...cities.map((city) => ({
      url: absoluteUrl(`/vagas/estado/${city.state.slug}/${city.slug}`),
      lastModified: city.updatedAt
    })),
    ...companies.map((company) => ({ url: absoluteUrl(`/empresas/${company.slug}`), lastModified: company.updatedAt })),
    ...Array.from(strategicSearchUrls.entries()).map(([url, lastModified]) => ({ url, lastModified }))
  ];
}
