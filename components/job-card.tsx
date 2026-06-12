import { ArrowUpRight, Building2, Clock3, MapPin } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { getCityJobsPath, getCompanyJobsPath } from "@/lib/seo/jobs-pages";
import { formatDate } from "@/lib/utils";

type JobCardProps = {
  job: {
    slug: string;
    title: string;
    companyName: string;
    companyLogoUrl?: string | null;
    summary: string;
    city: { name: string; slug: string };
    state: { code: string };
    publishedAt: Date | null;
    applyUrl: string;
    locationType?: string;
    categoryName?: string | null;
    employmentType?: string | null;
    company?: { slug: string; name: string } | null;
  };
};

function getJobBadgeLabel(job: JobCardProps["job"]) {
  if (job.categoryName?.trim()) return job.categoryName.trim();
  switch (job.employmentType) {
    case "APPRENTICESHIP":
      return "Jovem Aprendiz";
    case "INTERNSHIP":
      return "Estágio";
    case "PART_TIME":
      return "Meio período";
    case "CONTRACT":
      return "Contrato";
    case "TEMPORARY":
      return "Temporário";
    default:
      return "Vaga";
  }
}

function buildCardSummary(job: JobCardProps["job"]) {
  const summary = job.summary.trim();
  if (summary) return summary;
  return `Oportunidade divulgada por ${job.companyName} em ${job.city.name}, ${job.state.code}.`;
}

export function JobCard({ job }: JobCardProps) {
  const cardSummary = buildCardSummary(job);

  return (
    <article className="es-card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-white shadow-[0_18px_48px_-30px_rgba(26,26,26,0.22)]">
      <div className="h-2 bg-[linear-gradient(90deg,var(--brand-orange)_0%,var(--brand-brick)_55%,var(--brand-green)_100%)]" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--brand-mist)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--brand-green)]">
            {getJobBadgeLabel(job)}
          </span>
          {job.locationType ? (
            <span className="rounded-full bg-[rgba(242,140,27,0.12)] px-3 py-1 text-[11px] font-semibold text-[var(--brand-orange)]">
              {job.locationType === "REMOTE" ? "Remoto" : job.locationType === "HYBRID" ? "Híbrido" : "Presencial"}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-xl font-extrabold leading-snug text-[var(--brand-charcoal)]">
          <TrackedLink href={`/vagas/${job.slug}`} eventName="job_click" entityType="job" entitySlug={job.slug}>
            {job.title}
          </TrackedLink>
        </h3>

        <div className="mt-3 space-y-2 text-sm text-[var(--brand-text-secondary)]">
          <p className="inline-flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-[var(--brand-brick)]" />
            {job.company?.slug ? (
              <TrackedLink href={getCompanyJobsPath(job.company.slug)} eventName="company_click" entityType="company" entitySlug={job.company.slug}>
                {job.companyName}
              </TrackedLink>
            ) : (
              job.companyName
            )}
          </p>
          <p className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[var(--brand-orange)]" />
            <TrackedLink href={getCityJobsPath(job.city.slug)} eventName="city_click" entityType="city" entitySlug={job.city.slug}>
              {job.city.name}, {job.state.code}
            </TrackedLink>
          </p>
        </div>

        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-7 text-[var(--brand-text-secondary)]">{cardSummary}</p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--brand-line)] pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--brand-text-secondary)]">
            <Clock3 className="h-3.5 w-3.5" />
            {job.publishedAt ? formatDate(job.publishedAt) : "Recente"}
          </span>
          <Button asChild size="sm" variant="secondary" className="gap-1.5">
            <TrackedLink href={`/vagas/${job.slug}`} eventName="job_click" entityType="job" entitySlug={job.slug} aria-label={`Ver vaga ${job.title}`}>
              Ver vaga
              <ArrowUpRight className="h-4 w-4" />
            </TrackedLink>
          </Button>
        </div>
      </div>
    </article>
  );
}
