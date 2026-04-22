import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { SITE_TIME_ZONE } from "@/lib/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");

export function jovemAprendizStatePath(stateSlug: string) {
  return `/vagas/jovem-aprendiz/${stateSlug}`;
}

export function jovemAprendizCityPath(stateSlug: string, citySlug: string) {
  return `/vagas/jovem-aprendiz/${stateSlug}/${citySlug}`;
}

export function jovemAprendizCompanyPath(companySlug: string) {
  return `/vagas/jovem-aprendiz/empresa/${companySlug}`;
}

export function jovemAprendizCategoryPath(categorySlug: string) {
  return `/vagas/jovem-aprendiz/categoria/${categorySlug}`;
}

export function formatProgrammaticMonthYearLabel() {
  return dayjs().tz(SITE_TIME_ZONE).format("MMMM [de] YYYY");
}

export function buildProgrammaticStateTitle(totalJobs: number, stateName: string, stateCode: string) {
  const count = `${totalJobs} ${totalJobs === 1 ? "vaga" : "vagas"}`;
  return `${count} de Jovem Aprendiz no ${stateName} (${stateCode}) - ${formatProgrammaticMonthYearLabel()}`;
}

export function buildProgrammaticCityTitle(totalJobs: number, cityName: string, stateCode: string) {
  const count = `${totalJobs} ${totalJobs === 1 ? "vaga" : "vagas"}`;
  return `${count} de Jovem Aprendiz em ${cityName}, ${stateCode} - ${formatProgrammaticMonthYearLabel()}`;
}

export function buildProgrammaticCompanyTitle(totalJobs: number, companyName: string) {
  const count = `${totalJobs} ${totalJobs === 1 ? "vaga" : "vagas"}`;
  return `${count} de Jovem Aprendiz na ${companyName} - ${formatProgrammaticMonthYearLabel()}`;
}

export function buildProgrammaticCategoryTitle(totalJobs: number, categoryLabel: string) {
  const count = `${totalJobs} ${totalJobs === 1 ? "vaga" : "vagas"}`;
  return `${count} de ${categoryLabel} - ${formatProgrammaticMonthYearLabel()}`;
}
