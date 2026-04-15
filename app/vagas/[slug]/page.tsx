import Link from "next/link";
import { notFound } from "next/navigation";

import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCard } from "@/components/job-card";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildJobPostingJsonLd } from "@/lib/seo/json-ld";
import { getRelatedPosts } from "@/lib/repositories/blog";
import { getJobBySlug, getRelatedJobs } from "@/lib/repositories/jobs";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return buildSiteMetadata({
      title: "Vaga nao encontrada",
      description: "A vaga solicitada nao foi encontrada.",
      pathname: `/vagas/${slug}`,
      noIndex: true
    });
  }

  return buildSiteMetadata({
    title: job.seoTitle ?? `${job.title} em ${job.city.name}, ${job.state.code}`,
    description: job.seoDescription ?? job.summary,
    pathname: `/vagas/${job.slug}`,
    socialImageUrl: job.heroImageUrl || job.company?.socialImageUrl || job.companyLogoUrl || undefined
  });
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const [relatedJobs, relatedPosts] = await Promise.all([
    getRelatedJobs({
      excludeSlug: job.slug,
      citySlug: job.city.slug,
      stateSlug: job.state.slug,
      companySlug: job.company?.slug,
      limit: 3
    }),
    getRelatedPosts({ limit: 3 })
  ]);

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Vagas", path: "/vagas" }, { name: job.title, path: `/vagas/${job.slug}` }])} />
      <JsonLd
        data={buildJobPostingJsonLd({
          id: job.id,
          externalId: job.externalId,
          title: job.title,
          summary: job.summary,
          descriptionHtml: job.descriptionHtml,
          slug: job.slug,
          companyName: job.companyName,
          companyLogoUrl: job.company?.logoUrl ?? job.companyLogoUrl,
          companyWebsiteUrl: job.company?.websiteUrl ?? job.companyWebsiteUrl,
          cityName: job.city.name,
          stateCode: job.state.code,
          publishedAt: job.publishedAt.toISOString(),
          updatedAt: job.updatedAt.toISOString(),
          expiresAt: job.expiresAt?.toISOString() ?? null,
          validThrough: job.validThrough?.toISOString() ?? null,
          applyUrl: job.applyUrl,
          locationType: job.locationType,
          employmentType: job.employmentType,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          workHours: job.workHours,
          requirements: Array.isArray(job.requirements) ? job.requirements.map((item) => String(item)) : [],
          responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.map((item) => String(item)) : []
        })}
      />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }, { label: job.title }]} />

      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <div className={`grid gap-6 ${job.heroImageUrl ? "lg:grid-cols-[1.15fr_0.85fr]" : "grid-cols-1"}`}>
          <div className="space-y-5">
            {job.company?.logoUrl || job.companyLogoUrl ? (
                <div className="inline-flex items-center gap-3 rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-text-secondary)] shadow-sm">
                 <img src={job.company?.logoUrl ?? job.companyLogoUrl ?? ""} alt={job.companyName} className="h-10 w-10 rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-white object-cover p-1" />
                {job.companyName}
              </div>
            ) : null}
            <SectionHeading
              eyebrow={`${job.city.name}, ${job.state.code}`}
              title={job.title}
              description={`${job.companyName} • publicada em ${formatDate(job.publishedAt)} • candidatura no link oficial da empresa`}
            />
            <div className="flex flex-wrap gap-3">
              {job.locationType ? (
                <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)]">
                  {job.locationType === "REMOTE" ? "Remoto" : job.locationType === "HYBRID" ? "Hibrido" : "Presencial"}
                </span>
              ) : null}
              {job.workHours ? (
                <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)]">{job.workHours}</span>
              ) : null}
              {(job.salaryMin || job.salaryMax) ? (
                <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)]">
                  {job.salaryMin && job.salaryMax 
                    ? `R$ ${job.salaryMin.toLocaleString('pt-BR')} - R$ ${job.salaryMax.toLocaleString('pt-BR')}`
                    : job.salaryMin 
                    ? `A partir de R$ ${job.salaryMin.toLocaleString('pt-BR')}`
                    : `Ate R$ ${job.salaryMax?.toLocaleString('pt-BR')}`
                  }
                </span>
              ) : (
                <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)]">
                  Salário: Não informado
                </span>
              )}
              {(() => {
                const validityDate = job.validThrough ?? job.expiresAt;
                return validityDate ? (
                  <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)]">
                    Validade: {formatDate(validityDate)}
                  </span>
                ) : (
                  <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)]">
                    Validade: Não informada
                  </span>
                );
              })()}
            </div>
          </div>
          {job.heroImageUrl ? (
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 shadow-sm">
              <img src={job.heroImageUrl} alt={job.title} className="h-full max-h-[280px] w-full object-cover" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
             <p className="mb-6 rounded-[1.5rem] bg-[var(--brand-soft)] px-5 py-4 text-base leading-8 text-[var(--brand-text-secondary)]">
              {job.summary}
            </p>
            <div className="prose-content text-slate-700" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(job.descriptionHtml) }} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Requisitos</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--brand-text-secondary)]">
                {(Array.isArray(job.requirements) ? job.requirements : []).map((item: unknown, index: number) => (
                  <li key={`${item}-${index}`}>- {String(item)}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[var(--brand-navy)]">Beneficios</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--brand-text-secondary)]">
                {(Array.isArray(job.benefits) ? job.benefits : []).map((item: unknown, index: number) => (
                  <li key={`${item}-${index}`}>- {String(item)}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="brand-panel rounded-[2rem] border border-slate-200 p-8 shadow-[0_25px_80px_-50px_rgba(26,43,76,0.2)]">
            <h2 className="text-2xl font-black text-[var(--brand-navy)]">Veja mais vagas parecidas</h2>
            <p className="mt-3 text-base leading-8 text-[var(--brand-text-secondary)]">
              Se esta oportunidade chamou a sua atencao, aproveite para ver outras vagas em {job.city.name} e mais oportunidades ligadas a empresas parecidas.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/vagas/estado/${job.state.slug}/${job.city.slug}`}
                className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.24)] hover:text-[var(--brand-orange)]"
              >
                Mais vagas em {job.city.name}
              </Link>
              {job.company?.slug ? (
                <Link
                  href={`/empresas/${job.company.slug}`}
                  className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.24)] hover:text-[var(--brand-orange)]"
                >
                  Mais vagas da {job.company.name}
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="brand-soft-panel rounded-[2rem] border border-slate-200 p-6 shadow-[0_28px_100px_-60px_rgba(26,43,76,0.18)]">
            <h2 className="text-2xl font-black text-[var(--brand-navy)]">Candidatura</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-text-secondary)]">Leia os requisitos com calma, atualize o curriculo e envie sua candidatura pelo link oficial da empresa.</p>
            <Button asChild size="lg" className="mt-5 w-full rounded-2xl">
              <TrackedExternalLink href={job.applyUrl} target="_blank" rel="noreferrer" eventName="apply_click" entityType="job" entitySlug={job.slug}>
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
                className="mt-4 inline-flex text-sm font-semibold text-[var(--brand-blue)] transition hover:text-[var(--brand-orange)]"
              >
                Conhecer a empresa
              </TrackedExternalLink>
            ) : null}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Vagas relacionadas</h2>
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
