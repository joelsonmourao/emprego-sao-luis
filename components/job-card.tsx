import { ArrowUpRight, Building2, Clock3, MapPin, Sparkles } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type JobCardProps = {
  job: {
    slug: string;
    title: string;
    companyName: string;
    companyLogoUrl?: string | null;
    summary: string;
    city: { name: string };
    state: { code: string };
    publishedAt: Date;
    applyUrl: string;
    locationType?: string;
    company?: { slug: string; name: string } | null;
  };
};

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="group h-full overflow-hidden rounded-[2rem] border-slate-200 bg-white/95 shadow-[0_25px_90px_-50px_rgba(34,73,245,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_100px_-45px_rgba(255,107,87,0.3)]">
      <CardHeader className="relative overflow-hidden pb-4">
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(34,73,245,0.14)_0%,rgba(16,152,247,0.12)_55%,rgba(255,107,87,0.12)_100%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-[var(--brand-mist)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-cobalt)]">
                Jovem Aprendiz
              </span>
              {job.locationType ? (
                <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[var(--brand-coral)]">
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
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--brand-cobalt)] shadow-sm ring-1 ring-slate-200">
            <Sparkles className="h-5 w-5" />
          </span>
        </div>
        <CardDescription className="relative mt-1 flex flex-col gap-2 text-sm">
          <span className="inline-flex items-center gap-2">
            {job.companyLogoUrl ? (
              <img src={job.companyLogoUrl} alt={job.companyName} className="h-7 w-7 rounded-xl border border-slate-200 bg-white object-cover p-1" />
            ) : (
              <Building2 className="h-4 w-4 text-[var(--brand-cobalt)]" />
            )}
            {job.company?.slug ? (
              <TrackedLink href={`/empresas/${job.company.slug}`} eventName="company_click" entityType="company" entitySlug={job.company.slug}>
                {job.companyName}
              </TrackedLink>
            ) : (
              job.companyName
            )}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--brand-coral)]" />
            {job.city.name}, {job.state.code}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="line-clamp-3 text-sm leading-7 text-slate-600">{job.summary}</p>
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[linear-gradient(135deg,rgba(237,244,255,0.82),rgba(255,245,235,0.9))] px-4 py-3">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Clock3 className="h-4 w-4" />
            Publicada em {formatDate(job.publishedAt)}
          </span>
          <Button asChild size="sm" className="gap-2 rounded-2xl bg-[linear-gradient(135deg,#2249f5_0%,#1098f7_100%)] text-white hover:opacity-95">
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
