import Link from "next/link";
import { AlertTriangle, Building2, MapPin, ShieldCheck } from "lucide-react";

import { PublicAdSlot } from "@/components/ads/public-ad-slot";
import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCard } from "@/components/job-card";
import { JobApplyPanel } from "@/components/vagas/job-apply-panel";
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
  "rounded-full border border-[var(--brand-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-charcoal)]";

function jobEmploymentLabel(job: JobWithRelations) {
  if (job.categoryName?.trim()) return job.categoryName.trim();
  switch (job.employmentType) {
    case "APPRENTICESHIP":
      return "Jovem Aprendiz";
    case "INTERNSHIP":
      return "Estágio";
    case "PART_TIME":
      return "Meio período";
    case "CONTRACTOR":
      return "Contrato";
    case "TEMPORARY":
      return "Temporário";
    default:
      return "CLT";
  }
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
  const salaryLabel =
    job.salaryMin && job.salaryMax
      ? `R$ ${job.salaryMin.toLocaleString("pt-BR")} a R$ ${job.salaryMax.toLocaleString("pt-BR")}`
      : job.salaryMin
        ? `A partir de R$ ${job.salaryMin.toLocaleString("pt-BR")}`
        : job.salaryMax
          ? `Até R$ ${job.salaryMax.toLocaleString("pt-BR")}`
          : job.salaryDisplay?.trim() || "Não informado";

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }, { label: headingTitle }]} />

      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-[var(--brand-line)] bg-white shadow-[0_24px_70px_-40px_rgba(26,26,26,0.22)]">
            <div className="h-2 bg-[var(--brand-brick)]" />
            <div className="space-y-5 p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[rgba(123,44,40,0.16)] bg-[var(--brand-beige)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--brand-brick)]">
                  {jobEmploymentLabel(job)}
                </span>
                {job.locationType ? (
                  <span className={chipClass}>
                    {job.locationType === "REMOTE" ? "Remoto" : job.locationType === "HYBRID" ? "Híbrido" : "Presencial"}
                  </span>
                ) : null}
              </div>

              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-brick)]">
                  <MapPin className="h-4 w-4" />
                  {job.city.name}, {job.state.code}
                </p>
                <h1 className="text-2xl font-extrabold leading-tight text-[var(--brand-charcoal)] sm:text-3xl lg:text-4xl">{headingTitle}</h1>
                <p className="inline-flex items-center gap-2 text-sm text-[var(--brand-text-secondary)]">
                  <Building2 className="h-4 w-4 text-[var(--brand-green)]" />
                  {job.companyName}
                  <span aria-hidden>•</span>
                  Publicada em {formatBrazilDateTime(job.publishedAt)}
                </p>
              </div>

              <ul className="flex flex-wrap gap-2">
                <li>
                  <span className={chipClass}>Salário: {salaryLabel}</span>
                </li>
                {job.workHours ? (
                  <li>
                    <span className={chipClass}>{job.workHours}</span>
                  </li>
                ) : null}
                <li>
                  <span className={chipClass}>Validade: {validityDate ? formatDate(validityDate) : "Não informada"}</span>
                </li>
              </ul>

              {job.heroImageUrl ? (
                <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--brand-line)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={job.heroImageUrl} alt={headingTitle} width={960} height={540} className="h-full w-full object-cover" />
                </div>
              ) : null}

              {job.company?.websiteUrl || job.companyWebsiteUrl ? (
                <TrackedExternalLink
                  href={job.company?.websiteUrl ?? job.companyWebsiteUrl ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="company_site_click"
                  entityType="company"
                  entitySlug={job.company?.slug ?? job.slug}
                  className="inline-flex text-sm font-semibold text-[var(--brand-brick)] transition hover:text-[#65231f]"
                >
                  Conhecer a empresa
                </TrackedExternalLink>
              ) : null}
            </div>
          </section>

          <PublicAdSlot slotSlug="job-after-hero" format="horizontal" fullWidthResponsive />

          <section className="rounded-3xl border border-[var(--brand-line)] bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-extrabold text-[var(--brand-charcoal)]">Descrição da vaga</h2>
            <div
              className="prose-content mt-5 text-[var(--brand-text-secondary)]"
              dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(mergedDescriptionHtml) }}
            />
          </section>

          <PublicAdSlot slotSlug="job-after-description" format="rectangle" fullWidthResponsive />

          <section className="rounded-3xl border border-[rgba(123,44,40,0.18)] bg-[rgba(123,44,40,0.06)] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
              <div>
                <h2 className="text-lg font-extrabold text-[var(--brand-charcoal)]">Aviso do agregador</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--brand-text-secondary)]">
                  O {sourceSiteLabel} organiza e divulga oportunidades de emprego em São Luís e no Maranhão. A contratação, triagem e comunicação com candidatos são de responsabilidade exclusiva da empresa anunciante. Confira sempre os dados da vaga antes de se candidatar e desconfie de pedidos de pagamento ou dados bancários.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--brand-line)] bg-white p-5 shadow-[0_20px_60px_-36px_rgba(26,26,26,0.18)] sm:p-8">
            <h2 className="text-xl font-extrabold text-[var(--brand-charcoal)]">Candidatar-se a esta vaga</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)]">
              A candidatura é feita pelo canal oficial da empresa. O Emprego São Luís apenas divulga a oportunidade.
            </p>
            <div className="mt-5">
              <JobApplyPanel applyUrl={job.applyUrl} jobSlug={job.slug} />
            </div>
            <p className="mt-4 text-xs text-[var(--brand-text-secondary)]">Fonte: {sourceSiteLabel}</p>
          </section>

          <section className="brand-dark-panel rounded-3xl p-5 text-white sm:p-8">
            <h2 className="text-xl font-extrabold">Veja mais vagas parecidas</h2>
            <p className="mt-3 text-sm leading-7 text-white/84">
              Explore outras oportunidades em {job.city.name}, no {job.state.name} ou na {job.companyName}.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={getCityJobsPath(job.city.slug)} className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-sm font-semibold hover:border-white/45">
                Mais vagas em {job.city.name}
              </Link>
              <Link href={getStateJobsPath(job.state.slug)} className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-sm font-semibold hover:border-white/45">
                Mais vagas no {job.state.name}
              </Link>
              {job.company?.slug ? (
                <Link href={getCompanyJobsPath(job.company.slug)} className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-sm font-semibold hover:border-white/45">
                  Mais vagas da {job.company.name}
                </Link>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <PublicAdSlot slotSlug="job-sidebar" format="rectangle" fullWidthResponsive />

          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-[var(--brand-charcoal)]">Vagas relacionadas</h2>
            {relatedJobs.length ? (
              relatedJobs.map((relatedJob) => <JobCard key={relatedJob.id} job={relatedJob} />)
            ) : (
              <p className="rounded-2xl border border-dashed border-[var(--brand-line)] bg-white px-4 py-5 text-sm text-[var(--brand-text-secondary)]">
                Nenhuma vaga relacionada no momento.
              </p>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-[var(--brand-charcoal)]">Conteúdos relacionados</h2>
            {relatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </section>

          <div className="rounded-2xl border border-[rgba(123,44,40,0.18)] bg-[rgba(123,44,40,0.06)] p-4 text-sm leading-6 text-[var(--brand-text-secondary)]">
            <p className="inline-flex items-center gap-2 font-semibold text-[var(--brand-brick)]">
              <AlertTriangle className="h-4 w-4" />
              Evite golpes
            </p>
            <p className="mt-2">Empresas sérias não pedem pagamento para contratar. Desconfie de mensagens urgentes pedindo PIX, senhas ou documentos fora do canal oficial.</p>
            <Button asChild variant="ghost" size="sm" className="mt-3 px-0 text-[var(--brand-brick)]">
              <Link href="/blog/como-evitar-golpes-em-falsas-vagas-de-emprego">Ler dicas de segurança</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
