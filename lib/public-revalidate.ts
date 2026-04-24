import { revalidatePath, revalidateTag } from "next/cache";

import { EMPLOYMENT_CATEGORIES } from "@/lib/employment-categories";
import { getCityJobsPath, getCompanyJobsPath, getJobPath, getStateJobsPath, getVagasEmpresaPath } from "@/lib/seo/jobs-pages";
import { jovemAprendizCategoryPath, jovemAprendizCityPath, jovemAprendizCompanyPath, jovemAprendizStatePath } from "@/lib/seo/jovem-aprendiz-programmatic";

import type { EmploymentType } from "@prisma/client";

export const SITEMAP_MANIFEST_CACHE_TAG = "sitemap-manifest";

export type JobPublicRevalidateMeta = {
  slug: string;
  stateSlug: string;
  citySlug: string;
  companySlug: string | null;
  employmentType: EmploymentType;
};

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
  revalidateJobPaths(meta);
}

/** After bulk import or many updates: refresh sitemap cache and top listings without per-slug path fan-out. */
export function revalidatePublicSurfacesAfterBulkJobChange() {
  revalidateTag(SITEMAP_MANIFEST_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/vagas");
  revalidatePath("/empresas");
}
