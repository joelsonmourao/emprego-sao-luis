import { revalidatePath, revalidateTag } from "next/cache";

import { getCityJobsPath, getCompanyJobsPath, getJobPath, getStateJobsPath } from "@/lib/seo/jobs-pages";

import type { EmploymentType } from "@prisma/client";

export const SITEMAP_MANIFEST_CACHE_TAG = "sitemap-manifest";
export const PUBLIC_JOBS_CACHE_TAG = "public-jobs";
export const PUBLIC_BLOG_CACHE_TAG = "public-blog";
export const PUBLIC_GEO_CACHE_TAG = "public-geo";
export const PUBLIC_SITE_SETTINGS_CACHE_TAG = "public-site-settings";

export type JobPublicRevalidateMeta = {
  slug: string;
  stateSlug: string;
  citySlug: string;
  companySlug: string | null;
  employmentType: EmploymentType;
};

function revalidateSitemapIndexPaths() {
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap-fresh.xml");
  revalidatePath("/sitemaps/index.xml");
}

function revalidateJobPaths(meta: JobPublicRevalidateMeta) {
  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath("/empresas");
  revalidatePath(getJobPath(meta.slug));
  revalidatePath(getStateJobsPath(meta.stateSlug));
  revalidatePath(getCityJobsPath(meta.citySlug));

  if (meta.companySlug) {
    revalidatePath(getCompanyJobsPath(meta.companySlug));
  }
}

export function revalidatePublicSurfacesForJob(meta: JobPublicRevalidateMeta) {
  revalidateTag(SITEMAP_MANIFEST_CACHE_TAG);
  revalidateTag(PUBLIC_JOBS_CACHE_TAG);
  revalidateTag(PUBLIC_GEO_CACHE_TAG);
  revalidateSitemapIndexPaths();
  revalidateJobPaths(meta);
}

export function revalidatePublicSurfacesAfterBulkJobChange() {
  revalidateTag(SITEMAP_MANIFEST_CACHE_TAG);
  revalidateTag(PUBLIC_JOBS_CACHE_TAG);
  revalidateTag(PUBLIC_GEO_CACHE_TAG);
  revalidateSitemapIndexPaths();
  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath("/empresas");
}

export function revalidatePublicSurfacesAfterJobImports(metas: JobPublicRevalidateMeta[]) {
  revalidateTag(SITEMAP_MANIFEST_CACHE_TAG);
  revalidateTag(PUBLIC_JOBS_CACHE_TAG);
  revalidateTag(PUBLIC_GEO_CACHE_TAG);
  revalidateSitemapIndexPaths();

  const paths = new Set<string>(["/", "/vagas", "/empresas"]);

  for (const meta of metas) {
    paths.add(getJobPath(meta.slug));
    paths.add(getStateJobsPath(meta.stateSlug));
    paths.add(getCityJobsPath(meta.citySlug));
    if (meta.companySlug) {
      paths.add(getCompanyJobsPath(meta.companySlug));
    }
  }

  for (const path of paths) {
    revalidatePath(path);
  }
}

export function revalidatePublicSurfacesAfterBlogChange(slug?: string | null) {
  revalidateTag(PUBLIC_BLOG_CACHE_TAG);
  revalidateTag(SITEMAP_MANIFEST_CACHE_TAG);
  revalidateSitemapIndexPaths();
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export function revalidatePublicSurfacesAfterSiteSettingsChange() {
  revalidateTag(PUBLIC_SITE_SETTINGS_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath("/blog");
}
