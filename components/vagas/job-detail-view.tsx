import Link from "next/link";

import { PublicAdSlot } from "@/components/ads/public-ad-slot";
import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCard } from "@/components/job-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { formatBrazilDateTime } from "@/lib/date-utils";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { getSiteSettings } from "@/lib/site-settings";
import { getCityJobsPath, getCompanyJobsPath, getStateJobsPath } from "@/lib/seo/jobs-pages";
import { getRecentPosts } from "@/lib/repositories/blog";
import { getJobBySlug, getRelatedJobs } from "@/lib/repositories/jobs";
import { formatDate } from "@/lib/utils";

type JobWithRelations = NonNullable<Awaited<ReturnType<typeof getJobBySlug>>>;

const chipClass =
  "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--brand-text-secondary)] sm:px-3 sm:py-1.5 sm:text-xs";

function jobListingRegionBodyClass(job: JobWithRelations) {
  return `${job.state.slug}-${job.city.slug}`.replace(/[^a-z0-9-]/gi, "");
}

function jobEmploymentSlug(job: JobWithRelations) {
  if (job.employmentType === "APPRENTICESHIP") return "jovem-aprendiz";
  return job.employmentType.toLowerCase().replace(/_/g, "-");
}

export async function JobDetailView({ job, displayTitle }: { job: JobWithRelations; displayTitle?: string | null }) {
  const headingTitle = (displayTitle?.trim() || job.title).trim();
  const settings = await getSiteSettings();
  const sourceSiteLabel = settings.siteName.trim();
  const mergedDescriptionHtml = job.descriptionHtml ?? "";

  let relatedJobs: Awaited<ReturnType<typeof getRelatedJobs>> = [];
  let relatedPosts: Awaited<ReturnType<typeof getRecentPosts>> = [];
  try {
    const pair = await Promise.all([
      getRelatedJobs({
        excludeSlug: job.slug,
        citySlug: job.city.slug,
        stateSlug: job.state.slug,
        companySlug: job.company?.slug,
        limit: 3
      }),
      getRecentPosts()
    ]);
    relatedJobs = pair[0];
    const cityNeedle = job.city.name.toLowerCase();
    const stateCodeNeedle = job.state.code.toLowerCase();
    const stateNameNeedle = job.state.name.toLowerCase();
    const localizedPosts = pair[1].filter((post) => {
      const haystack = `${post.title} ${post.excerpt}`.toLowerCase();
      return haystack.includes(cityNeedle) || haystack.includes(stateCodeNeedle) || haystack.includes(stateNameNeedle);
    });
    const fallbackPosts = pair[1].filter((post) => !localizedPosts.some((localPost) => localPost.id === post.id));
    relatedPosts = [...localizedPosts, ...fallbackPosts].slice(0, 3);
  } catch {
    relatedJobs = [];
    relatedPosts = [];
  }

  const validityDate = job.validThrough ?? job.expiresAt;
  const listingTypeSlug = job.employmentType.toLowerCase().replace(/_/g, "-");
  const employmentSlug = jobEmploymentSlug(job);
  const regionBody = jobListingRegionBodyClass(job);

  const articleClassName = [
    `post-${job.id}`,
    "job_listing",
    "type-job_listing",
    "status-publish",
    "hentry",
    `job_listing_region-${regionBody}`,
    `job_listing_type-${listingTypeSlug}`,
    `job-type-${employmentSlug}`
  ].join(" ");

  return (
    <div
      id="content"
      className="site-content mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
    >
      <div className="container w-full max-w-none">
        <div id="primary" className="content-area min-w-0">
          <main id="main" className="site-main min-w-0">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }, { label: headingTitle }]} />

            <article id={`post-${job.id}`} className={articleClassName}>
              <div className="entry-content" itemProp="text">
                <div className="single_job_listing space-y-4 sm:space-y-6">
                  <div className="brand-page-hero rounded-[1.5rem] border border-slate-200 px-4 py-5 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:rounded-[2rem] sm:px-5 sm:py-6 sm:rounded-[2.2rem] sm:px-8 sm:py-8">
                    <div className={`grid gap-4 ${job.heroImageUrl ? "lg:grid-cols-[1.15fr_0.85fr]" : "grid-cols-1"} sm:gap-6`}>
                      <div className="min-w-0 space-y-4 sm:space-y-5">
                        {job.company?.logoUrl || job.companyLogoUrl ? (
                          <div className="company">
                            <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-2.5 py-1 text-[10px] font-semibold text-[var(--brand-text-secondary)] shadow-sm sm:gap-3 sm:px-3 sm:py-1.5 sm:text-xs">
                              <img
                                src={job.company?.logoUrl ?? job.companyLogoUrl ?? ""}
                                alt={job.companyName}
                                width={36}
                                height={36}
                                loading="lazy"
                                decoding="async"
                                className="h-7 w-7 rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-white object-cover p-1 sm:h-9 sm:w-9"
                              />
                              <span className="truncate">{job.companyName}</span>
                            </div>
                          </div>
                        ) : null}
                        <header className="entry-header">
                          <SectionHeading
                            titleLevel="h1"
                            titleClassName="entry-title"
                            eyebrow={`${job.city.name}, ${job.state.code}`}
                            title={headingTitle}
                            description={`${job.companyName} • publicada em ${formatBrazilDateTime(job.publishedAt)} • candidatura no link oficial da empresa`}
                          />
                        </header>
                        <ul className="job-listing-meta meta m-0 flex list-none flex-wrap gap-2 p-0 sm:gap-2.5 sm:gap-3">
                          {job.locationType ? (
                            <li className="list-none">
                              <span className={chipClass}>
                                {job.locationType === "REMOTE" ? "Remoto" : job.locationType === "HYBRID" ? "Hibrido" : "Presencial"}
                              </span>
                            </li>
                          ) : null}
                          {job.workHours ? (
                            <li className="list-none">
                              <span className={chipClass}>{job.workHours}</span>
                            </li>
                          ) : null}
                          {job.salaryMin || job.salaryMax ? (
                            <li className="list-none">
                              <span className={chipClass}>
                                {job.salaryMin && job.salaryMax
                                  ? `Faixa salarial estimada: R$ ${job.salaryMin.toLocaleString("pt-BR")} a R$ ${job.salaryMax.toLocaleString("pt-BR")}`
                                  : job.salaryMin
                                    ? `Faixa salarial estimada: a partir de R$ ${job.salaryMin.toLocaleString("pt-BR")}`
                                    : `Faixa salarial estimada: até R$ ${job.salaryMax?.toLocaleString("pt-BR")}`}
                              </span>
                            </li>
                          ) : (
                            <li className="list-none">
                              <span className={chipClass}>Salário: Não informado</span>
                            </li>
                          )}
                          {validityDate ? (
                            <li className="list-none">
                              <span className={chipClass}>Validade: {formatDate(validityDate)}</span>
                            </li>
                          ) : (
                            <li className="list-none">
                              <span className={chipClass}>Validade: Não informada</span>
                            </li>
                          )}
                        </ul>
                      </div>
                      {job.heroImageUrl ? (
                        <div className="aspect-[16/10] min-h-[200px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/70 shadow-sm sm:min-h-[260px] sm:rounded-[2rem]">
                          <img
                            src={job.heroImageUrl}
                            alt={headingTitle}
                            width={960}
                            height={600}
                            loading="eager"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="min-h-[140px] rounded-[1.25rem] border border-slate-200 bg-white/80 p-3 sm:min-h-[160px] sm:p-4">
                    <PublicAdSlot slotSlug="job-after-hero" format="horizontal" fullWidthResponsive />
                  </div>

                  <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="job_description rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.8rem] sm:p-5 sm:rounded-3xl sm:p-8">
                        <div
                          className="prose-content text-slate-700"
                          dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(mergedDescriptionHtml) }}
                        />
                      </div>

                    <div className="my-4 min-h-[250px] sm:my-6">
                      <PublicAdSlot slotSlug="job-after-description" format="rectangle" fullWidthResponsive />
                    </div>

                    <div className="brand-panel rounded-[1.5rem] border border-slate-200 p-4 shadow-[0_25px_80px_-50px_rgba(26,43,76,0.2)] sm:rounded-[1.8rem] sm:p-6 sm:rounded-[2rem] sm:p-8">
                      <h2 className="text-xl font-black text-[var(--brand-navy)] leading-tight sm:text-2xl">Veja mais vagas parecidas</h2>
                      <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:mt-3 sm:text-base sm:leading-8">
                        Se esta oportunidade chamou a sua atencao, aproveite para ver outras vagas em {job.city.name} e mais oportunidades
                        ligadas a empresas parecidas.
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
                      <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:mt-3 sm:leading-7">
                        Leia os requisitos com calma, atualize o currículo e envie sua candidatura pelo link oficial da empresa.
                      </p>
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
                      <p className="mt-3 text-xs leading-5 text-[var(--brand-text-secondary)] sm:mt-4 sm:text-sm">Fonte: {sourceSiteLabel}</p>
                    </div>

                    <div className="min-h-[250px]">
                      <PublicAdSlot slotSlug="job-sidebar" format="rectangle" fullWidthResponsive />
                    </div>

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
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
