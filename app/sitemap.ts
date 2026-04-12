import type { MetadataRoute } from "next";

import { staticPages } from "@/data/seo-pages";
import { absoluteUrl } from "@/lib/utils";
import { getAllPublishedPostEntries } from "@/lib/repositories/blog";
import { getAllActiveJobEntries, getCompanyEntries } from "@/lib/repositories/jobs";
import { getCities, getStates } from "@/lib/repositories/geo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, posts, states, cities, companies] = await Promise.all([
    getAllActiveJobEntries(),
    getAllPublishedPostEntries(),
    getStates(),
    getCities(),
    getCompanyEntries()
  ]);

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
    ...companies.map((company) => ({ url: absoluteUrl(`/empresas/${company.slug}`), lastModified: company.updatedAt }))
  ];
}
