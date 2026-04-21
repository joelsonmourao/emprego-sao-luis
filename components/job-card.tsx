import { ArrowUpRight, Building2, Clock3, MapPin, Sparkles } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    publishedAt: Date;
    applyUrl: string;
    locationType?: string;
    company?: { slug: string; name: string } | null;
  };
};

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="group h-full overflow-hidden rounded-[2rem] border-[var(--brand-line)] bg-white shadow-[0_25px_90px_-55px_rgba(26,43,76,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_100px_-50px_rgba(26,43,76,0.18)]">
      <CardHeader className="relative overflow-hidden pb-4">
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(26,43,76,0.08)_0%,rgba(47,111,237,0.08)_60%,rgba(255,109,0,0.1)_100%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-[var(--brand-mist)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-navy)]">
                Jovem Aprendiz
              </span>
              {job.locationType ? (
                <span className="inline-flex rounded-full bg-[rgba(255,109,0,0.12)] px-3 py-1 text-xs font-semibold text-[var(--brand-orange)]">
                  {job.locationType === "REMOTE" ? "Remoto" : job.locationType === "HYBRID" ? "Hibrido" : "Presencial"}
                </span>
              ) : null}
            </div>
            <CardTitle className="text-[1.7rem] leading-tight">
              <TrackedLink href={`/vagas/${job.slug}`} eventName="job_click" entityType="job" entitySlug={job.slug}>
                {job.title}
              </TrackedLink>
            </CardTitle>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand-orange)] shadow-sm ring-1 ring-[var(--brand-line)]">
            <Sparkles className="h-5 w-5" />
          </span>
        </div>
        <CardDescription className="relative mt-1 flex flex-col gap-2 text-sm">
          <span className="inline-flex items-center gap-2">
            {job.companyLogoUrl ? (
              <img src={job.companyLogoUrl} alt={job.companyName} className="h-7 w-7 rounded-xl border border-slate-200 bg-white object-cover p-1" />
            ) : (
              <Building2 className="h-4 w-4 text-[var(--brand-blue)]" />
            )}
            {job.company?.slug ? (
              <TrackedLink href={getCompanyJobsPath(job.company.slug)} eventName="company_click" entityType="company" entitySlug={job.company.slug}>
                {job.companyName}
              </TrackedLink>
            ) : (
              job.companyName
            )}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--brand-orange)]" />
            <TrackedLink href={getCityJobsPath(job.city.slug)} eventName="city_click" entityType="city" entitySlug={job.city.slug}>
              {job.city.name}, {job.state.code}
            </TrackedLink>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="line-clamp-3 text-sm leading-7 text-[var(--brand-text-secondary)]">{job.summary}</p>
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[linear-gradient(135deg,rgba(244,247,246,0.98),rgba(255,248,241,0.98))] px-4 py-3">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--brand-text-secondary)]">
            <Clock3 className="h-4 w-4" />
            Publicada em {formatDate(job.publishedAt)}
          </span>
          <Button asChild size="sm" className="gap-2 rounded-2xl">
            <TrackedLink href={`/vagas/${job.slug}`} eventName="job_click" entityType="job" entitySlug={job.slug}>
              Ver vaga
              <ArrowUpRight className="h-4 w-4" />
            </TrackedLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
