import Link from "next/link";

import { JobCard } from "@/components/job-card";
import { getCityJobsPath, getStateJobsPath } from "@/lib/seo/jobs-pages";
import type { JobListingPayload } from "@/lib/repositories/jobs";

type JobUnavailableViewProps = {
  title: string;
  description: string;
  citySlug?: string | null;
  stateSlug?: string | null;
  relatedJobs: JobListingPayload[];
};

export function JobUnavailableView({ title, description, citySlug, stateSlug, relatedJobs }: JobUnavailableViewProps) {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Vaga indisponível</span>
        <h1 className="mt-4 text-3xl font-black text-[var(--brand-navy)] sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--brand-text-secondary)] sm:text-base">{description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/vagas" className="rounded-full bg-[var(--brand-navy)] px-4 py-2 text-sm font-semibold text-white">
            Ver todas as vagas
          </Link>
          {citySlug ? (
            <Link href={getCityJobsPath(citySlug)} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)]">
              Vagas por cidade
            </Link>
          ) : null}
          {stateSlug ? (
            <Link href={getStateJobsPath(stateSlug)} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)]">
              Vagas por estado
            </Link>
          ) : null}
        </div>
      </div>

      {relatedJobs.length ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-[var(--brand-navy)]">Vagas relacionadas</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {relatedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
