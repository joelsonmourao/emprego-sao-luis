import Link from "next/link";

import { PublicAdSlot } from "@/components/ads/public-ad-slot";
import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCard } from "@/components/job-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildJobPublisherName } from "@/lib/seo/job-publisher";
import { getCityJobsPath, getCompanyJobsPath, getStateJobsPath } from "@/lib/seo/jobs-pages";
import { getRelatedPosts } from "@/lib/repositories/blog";
import { getJobBySlug, getRelatedJobs } from "@/lib/repositories/jobs";
import { formatDate } from "@/lib/utils";

type JobWithRelations = NonNullable<Awaited<ReturnType<typeof getJobBySlug>>>;

export async function JobDetailView({ job }: { job: JobWithRelations }) {
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const benefits = Array.isArray(job.benefits) ? job.benefits : [];
  const publisherDisplayName = buildJobPublisherName(job.city?.name, job.state?.code);

  let relatedJobs: Awaited<ReturnType<typeof getRelatedJobs>> = [];
  let relatedPosts: Awaited<ReturnType<typeof getRelatedPosts>> = [];
  try {
    const pair = await Promise.all([
      getRelatedJobs({
        excludeSlug: job.slug,
        citySlug: job.city.slug,
        stateSlug: job.state.slug,
        companySlug: job.company?.slug,
        limit: 3
      }),
      getRelatedPosts({ limit: 3 })
    ]);
    relatedJobs = pair[0];
    relatedPosts = pair[1];
  } catch {
    relatedJobs = [];
    relatedPosts = [];
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 sm:space-y-8 lg:px-8 lg:py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }, { label: job.title }]} />

      <div className="brand-page-hero rounded-[1.5rem] border border-slate-200 px-4 py-5 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:rounded-[2rem] sm:px-5 sm:py-6 sm:rounded-[2.2rem] sm:px-8 sm:py-8">
        <div className={`grid gap-4 ${job.heroImageUrl ? "lg:grid-cols-[1.15fr_0.85fr]" : "grid-cols-1"} sm:gap-6`}>
          <div className="min-w-0 space-y-4 sm:space-y-5">
            {job.company?.logoUrl || job.companyLogoUrl ? (
              <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-2.5 py-1 text-[10px] font-semibold text-[var(--brand-text-secondary)] shadow-sm sm:gap-3 sm:px-3 sm:py-1.5 sm:text-xs">
                <img src={job.company?.logoUrl ?? job.companyLogoUrl ?? ""} alt={job.companyName} className="h-7 w-7 rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-white object-cover p-1 sm:h-9 sm:w-9" />
                <span className="truncate">{job.companyName}</span>
              </div>
            ) : null}
            <SectionHeading
              titleLevel="h1"
              eyebrow={`${job.city.name}, ${job.state.code}`}
              title={job.title}
              description={`${job.companyName} • publicada em ${formatDate(job.publishedAt)} • candidatura no link oficial da empresa`}
            />
            <div className="flex flex-wrap gap-2 sm:gap-2.5 sm:gap-3">
              {job.locationType ? (
                <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--brand-text-secondary)] sm:px-3 sm:py-1.5 sm:text-xs">
                  {job.locationType === "REMOTE" ? "Remoto" : job.locationType === "HYBRID" ? "Hibrido" : "Presencial"}
                </span>
              ) : null}
              {job.workHours ? (
                <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--brand-text-secondary)] sm:px-3 sm:py-1.5 sm:text-xs">{job.workHours}</span>
              ) : null}
              {job.salaryMin || job.salaryMax ? (
                <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--brand-text-secondary)] sm:px-3 sm:py-1.5 sm:text-xs">
                  {job.salaryMin && job.salaryMax
                    ? `R$ ${job.salaryMin.toLocaleString("pt-BR")} - R$ ${job.salaryMax.toLocaleString("pt-BR")}`
                    : job.salaryMin
                      ? `A partir de R$ ${job.salaryMin.toLocaleString("pt-BR")}`
                      : `Ate R$ ${job.salaryMax?.toLocaleString("pt-BR")}`}
                </span>
              ) : (
                <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--brand-text-secondary)] sm:px-3 sm:py-1.5 sm:text-xs">
                  Salário: Não informado
                </span>
              )}
              {(() => {
                const validityDate = job.validThrough ?? job.expiresAt;
                return validityDate ? (
                  <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--brand-text-secondary)] sm:px-3 sm:py-1.5 sm:text-xs">
                    Validade: {formatDate(validityDate)}
                  </span>
                ) : (
                  <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--brand-text-secondary)] sm:px-3 sm:py-1.5 sm:text-xs">
                    Validade: Não informada
                  </span>
                );
              })()}
            </div>
          </div>
          {job.heroImageUrl ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/70 shadow-sm sm:rounded-[2rem]">
              <img src={job.heroImageUrl} alt={job.title} className="h-full max-h-[200px] w-full object-cover sm:max-h-[280px]" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-3 sm:p-4">
        <PublicAdSlot slotSlug="job-after-hero" format="horizontal" fullWidthResponsive />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.8rem] sm:p-5 sm:rounded-3xl sm:p-8">
            <p className="mb-4 rounded-[1.25rem] bg-[var(--brand-soft)] px-3 py-3 text-[14px] leading-6 text-[var(--brand-text-secondary)] sm:mb-5 sm:rounded-[1.5rem] sm:px-4 sm:py-4 sm:text-[15px] sm:leading-7 sm:text-base sm:leading-8">
              {job.summary}
            </p>
            <div
              className="prose-content text-slate-700"
              dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(job.descriptionHtml ?? "") }}
            />
            {requirements.length ? (
              <div className="mt-6 border-t border-slate-100 pt-6 sm:mt-8 sm:pt-8">
                <h2 className="text-lg font-semibold text-[var(--brand-navy)] sm:text-xl">Requisitos</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:mt-4 sm:space-y-3">
                  {requirements.map((item: unknown, index: number) => (
                    <li key={`req-${index}`}>- {String(item)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {benefits.length ? (
              <div className="mt-6 border-t border-slate-100 pt-6 sm:mt-8 sm:pt-8">
                <h2 className="text-lg font-semibold text-[var(--brand-navy)] sm:text-xl">Beneficios</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:mt-4 sm:space-y-3">
                  {benefits.map((item: unknown, index: number) => (
                    <li key={`ben-${index}`}>- {String(item)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="my-4 sm:my-6">
            <PublicAdSlot slotSlug="job-after-description" format="rectangle" fullWidthResponsive />
          </div>

          <div className="brand-panel rounded-[1.5rem] border border-slate-200 p-4 shadow-[0_25px_80px_-50px_rgba(26,43,76,0.2)] sm:rounded-[1.8rem] sm:p-6 sm:rounded-[2rem] sm:p-8">
            <h2 className="text-xl font-black text-[var(--brand-navy)] leading-tight sm:text-2xl">Veja mais vagas parecidas</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:mt-3 sm:text-base sm:leading-8">
              Se esta oportunidade chamou a sua atencao, aproveite para ver outras vagas em {job.city.name} e mais oportunidades ligadas a empresas parecidas.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
              <Link
                href={getCityJobsPath(job.city.slug)}
                className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.24)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
              >
                Mais vagas em {job.city.name}
              </Link>
              <Link
                href={getStateJobsPath(job.state.slug)}
                className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.24)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
              >
                Mais vagas no {job.state.name}
              </Link>
              {job.company?.slug ? (
                <Link
                  href={getCompanyJobsPath(job.company.slug)}
                  className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.24)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
                >
                  Mais vagas da {job.company.name}
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-4 sm:space-y-6">
          <div className="brand-soft-panel rounded-[1.5rem] border border-slate-200 p-4 shadow-[0_28px_100px_-60px_rgba(26,43,76,0.18)] sm:rounded-[1.8rem] sm:p-5 sm:rounded-[2rem] sm:p-6">
            <h2 className="text-xl font-black text-[var(--brand-navy)] leading-tight sm:text-2xl">Candidatura</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:mt-3 sm:leading-7">Leia os requisitos com calma, atualize o currículo e envie sua candidatura pelo link oficial da empresa.</p>
            <Button asChild size="lg" className="mt-4 w-full rounded-2xl sm:mt-5">
              <TrackedExternalLink
                href={job.applyUrl?.trim() || "#"}
                target="_blank"
                rel="noreferrer"
                eventName="apply_click"
                entityType="job"
                entitySlug={job.slug}
              >
                Candidatar-se
              </TrackedExternalLink>
            </Button>
            {job.company?.websiteUrl || job.companyWebsiteUrl ? (
              <TrackedExternalLink
                href={job.company?.websiteUrl ?? job.companyWebsiteUrl ?? ""}
                target="_blank"
                rel="noreferrer"
                eventName="company_site_click"
                entityType="company"
                entitySlug={job.company?.slug ?? job.slug}
                className="mt-3 inline-flex text-sm font-semibold text-[var(--brand-blue)] transition hover:text-[var(--brand-orange)] sm:mt-4"
              >
                Conhecer a empresa
              </TrackedExternalLink>
            ) : null}
            <p className="mt-3 text-xs leading-5 text-[var(--brand-text-secondary)] sm:mt-4 sm:text-sm">
              Fonte: {publisherDisplayName}
            </p>
          </div>

          <PublicAdSlot slotSlug="job-sidebar" format="rectangle" fullWidthResponsive />

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-base font-black text-[var(--brand-navy)] sm:text-lg">Vagas relacionadas</h2>
            {relatedJobs.map((relatedJob) => (
              <JobCard key={relatedJob.id} job={relatedJob} />
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Conteudos relacionados</h2>
            {relatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
