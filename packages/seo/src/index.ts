export const SITE_NAME = "Empregos São Luís";

interface JobPostingInput {
  title: string; description: string; publishedAt: Date | null; expiresAt: Date | null; employmentType: string;
  workplaceType: string; companyName: string; companyWebsiteUrl?: string | null; cityName: string; stateCode: string;
  applicationUrl: string; salaryMin?: string | null; salaryMax?: string | null; salaryCurrency: string; salaryPeriod?: string | null;
}
export function buildJobPosting(input: JobPostingInput) {
  if (!input.publishedAt || !input.expiresAt || input.expiresAt <= new Date()) return null;
  const baseSalary = input.salaryMin || input.salaryMax ? { "@type": "MonetaryAmount", currency: input.salaryCurrency, value: { "@type": "QuantitativeValue", ...(input.salaryMin ? { minValue: Number(input.salaryMin) } : {}), ...(input.salaryMax ? { maxValue: Number(input.salaryMax) } : {}), ...(input.salaryPeriod ? { unitText: input.salaryPeriod } : {}) } } : undefined;
  return { "@context": "https://schema.org", "@type": "JobPosting", title: input.title, description: input.description, datePosted: input.publishedAt.toISOString(), validThrough: input.expiresAt.toISOString(), employmentType: input.employmentType, hiringOrganization: { "@type": "Organization", name: input.companyName, ...(input.companyWebsiteUrl ? { sameAs: input.companyWebsiteUrl } : {}) }, ...(input.workplaceType === "remoto" ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "BR" } } : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: input.cityName, addressRegion: input.stateCode, addressCountry: "BR" } } }), ...(baseSalary ? { baseSalary } : {}), directApply: false, url: input.applicationUrl };
}

export function escapeXml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;"); }
