export type EntityPageQuality = "FORTE" | "FRACA" | "SEM_VAGAS";

const plainLength = (value: string | null | undefined) =>
  String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().length;

const validMetadata = (title: string | null | undefined, description: string | null | undefined) =>
  plainLength(title) >= 25 && plainLength(description) >= 100;

export function classifyCompanyPage(input: {
  activeJobs: number;
  descriptionHtml?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
}): EntityPageQuality {
  if (input.activeJobs === 0) return "SEM_VAGAS";
  return plainLength(input.descriptionHtml) >= 500 && validMetadata(input.seoTitle, input.metaDescription)
    ? "FORTE"
    : "FRACA";
}

export function classifyCategoryPage(input: {
  activeJobs: number;
  description?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
}): EntityPageQuality {
  if (input.activeJobs === 0) return "SEM_VAGAS";
  return input.activeJobs >= 5 && plainLength(input.description) >= 500 && validMetadata(input.seoTitle, input.metaDescription)
    ? "FORTE"
    : "FRACA";
}

export function classifyCityPage(input: {
  activeJobs: number;
  seoTitle?: string | null;
  metaDescription?: string | null;
}): EntityPageQuality {
  if (input.activeJobs === 0) return "SEM_VAGAS";
  return input.activeJobs >= 5 && validMetadata(input.seoTitle, input.metaDescription) ? "FORTE" : "FRACA";
}
