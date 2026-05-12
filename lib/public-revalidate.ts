import { revalidatePath, revalidateTag } from "next/cache";

import { EMPLOYMENT_CATEGORIES } from "@/lib/employment-categories";
import { getCityJobsPath, getCompanyJobsPath, getJobPath, getStateJobsPath, getVagasEmpresaPath } from "@/lib/seo/jobs-pages";
import { jovemAprendizCategoryPath, jovemAprendizCityPath, jovemAprendizCompanyPath, jovemAprendizStatePath } from "@/lib/seo/jovem-aprendiz-programmatic";

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
  revalidatePath(jovemAprendizStatePath(meta.stateSlug));
  revalidatePath(jovemAprendizCityPath(meta.stateSlug, meta.citySlug));
  const categorySlug = EMPLOYMENT_CATEGORIES.find((item) => item.employmentType === meta.employmentType)?.slug;
  if (categorySlug) {
    revalidatePath(jovemAprendizCategoryPath(categorySlug));
  }

  if (meta.companySlug) {
    revalidatePath(getCompanyJobsPath(meta.companySlug));
    revalidatePath(getVagasEmpresaPath(meta.companySlug));
    revalidatePath(jovemAprendizCompanyPath(meta.companySlug));
  }
}

/** After a single job create/update/delete or visibility change. */
export function revalidatePublicSurfacesForJob(meta: JobPublicRevalidateMeta) {
  revalidateTag(SITEMAP_MANIFEST_CACHE_TAG);
  revalidateTag(PUBLIC_JOBS_CACHE_TAG);
  revalidateTag(PUBLIC_GEO_CACHE_TAG);
  revalidateSitemapIndexPaths();
  revalidateJobPaths(meta);
}

/** After bulk import or many updates: refresh sitemap cache and top listings without per-slug path fan-out. */
export function revalidatePublicSurfacesAfterBulkJobChange() {
  revalidateTag(SITEMAP_MANIFEST_CACHE_TAG);
  revalidateTag(PUBLIC_JOBS_CACHE_TAG);
  revalidateTag(PUBLIC_GEO_CACHE_TAG);
  revalidateSitemapIndexPaths();
  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath("/empresas");
}

/**
 * Após importação com slugs conhecidos: invalida tags de cache do Next e revalida paths agregados
 * (inclui cada página de vaga e listagens afetadas). Em self-hosted com múltiplas réplicas, cada
 * instância mantém cache próprio — se algo persistir antigo, reinicie o container ou faça redeploy.
 */
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
    paths.add(jovemAprendizStatePath(meta.stateSlug));
    paths.add(jovemAprendizCityPath(meta.stateSlug, meta.citySlug));
    const categorySlug = EMPLOYMENT_CATEGORIES.find((item) => item.employmentType === meta.employmentType)?.slug;
    if (categorySlug) {
      paths.add(jovemAprendizCategoryPath(categorySlug));
    }
    if (meta.companySlug) {
      paths.add(getCompanyJobsPath(meta.companySlug));
      paths.add(getVagasEmpresaPath(meta.companySlug));
      paths.add(jovemAprendizCompanyPath(meta.companySlug));
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
