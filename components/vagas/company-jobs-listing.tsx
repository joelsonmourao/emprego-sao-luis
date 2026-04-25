import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JobCard } from "@/components/job-card";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import {
  buildCompanyListingSeo,
  buildListingCollectionPageJsonLd,
  buildListingFaq,
  getCityJobsPath,
  getCompanyJobsPath,
  getStateJobsPath,
  getVagasEmpresaPath
} from "@/lib/seo/jobs-pages";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getCompanyHubs, getCompanyHubBySlug, getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";

import type { CompanyJobsListingVariant } from "@/lib/seo/company-jobs-metadata";

function listingPath(companySlug: string, variant: CompanyJobsListingVariant) {
  return variant === "vagas-hub" ? getVagasEmpresaPath(companySlug) : getCompanyJobsPath(companySlug);
}

function buildPageHref(companySlug: string, variant: CompanyJobsListingVariant, order: "relevance" | "date" | undefined, pageNumber: number) {
  const params = new URLSearchParams();
  if (order && order !== "relevance") params.set("order", order);
  if (pageNumber > 1) params.set("page", String(pageNumber));
  const query = params.toString();
  const base = listingPath(companySlug, variant);
  return query ? `${base}?${query}` : base;
}

export async function CompanyJobsListing({
  companySlug,
  searchParams,
  variant
}: {
  companySlug: string;
  searchParams: Record<string, string | string[] | undefined>;
  variant: CompanyJobsListingVariant;
}) {
  const raw = searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const company = await getCompanyHubBySlug(companySlug);
  if (!company) {
    notFound();
  }

  const [jobs, allCompanies] = await Promise.all([
    getJobsList({
      companySlug: company.slug,
      order: parsed.order,
      page: parsed.page
    }),
    getCompanyHubs()
  ]);

  const seo = buildCompanyListingSeo(
    {
      companyName: company.name,
      companySlug: company.slug,
      totalJobs: jobs.total
    },
    { variant: variant === "vagas-hub" ? "vagas-hub" : "default" }
  );

  const faq = buildListingFaq({ name: company.name, totalJobs: jobs.total, type: "company" });
  const relatedCompanies = allCompanies
    .filter((item) => item.slug !== company.slug && (item.citySlug === company.city.slug || item.stateSlug === company.state.slug))
    .slice(0, 8);
  const buildOrderHref = (order: "relevance" | "date") => buildPageHref(company.slug, variant, order, 1);

  const breadcrumbCompanyPath = listingPath(company.slug, variant);
  const relatedCompanyHref = (slug: string) => getCompanyJobsPath(slug);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Empresas", path: "/empresas" },
          { name: company.name, path: breadcrumbCompanyPath }
        ])}
      />
      <JsonLd data={buildListingCollectionPageJsonLd({ name: seo.h1, description: seo.description, path: seo.canonicalPath })} />
      <JsonLd data={buildFaqJsonLd(faq)} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Empresas", href: "/empresas" }, { label: company.name }]} />

      <div className="brand-page-hero rounded-[2rem] border border-slate-200 px-5 py-6 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8 sm:py-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {company.logoUrl ? <img src={company.logoUrl} alt={company.name} className="h-12 w-12 rounded-2xl border border-slate-200 bg-white object-cover p-1" /> : null}
            <span className="rounded-full bg-white px-4 py-2 font-semibold text-[var(--brand-orange)]">
              {jobs.total} {jobs.total === 1 ? "vaga ativa" : "vagas ativas"}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--brand-navy)] sm:text-5xl">{seo.h1}</h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--brand-text-secondary)] sm:text-lg">{seo.intro}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href={getCityJobsPath(company.city.slug)} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-[var(--brand-text-secondary)]">
              {company.city.name}, {company.state.code}
            </Link>
            <Link href={getStateJobsPath(company.state.slug)} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-[var(--brand-text-secondary)]">
              Ver vagas no {company.state.name}
            </Link>
            {company.websiteUrl ? (
              <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-semibold text-[var(--brand-blue)]">
                Site oficial
              </a>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-[var(--brand-text-secondary)]">Ordenar por:</span>
            <Link
              href={buildOrderHref("relevance")}
              className={
                parsed.order === "date"
                  ? "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)]"
                  : "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white"
              }
            >
              Relevancia
            </Link>
            <Link
              href={buildOrderHref("date")}
              className={
                parsed.order === "date"
                  ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white"
                  : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)]"
              }
            >
              Data
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
        eyebrow="Página de empresa"
              title={`Como encontrar vagas de Jovem Aprendiz no ${company.name}`}
        description={`Use esta página para ver vagas atualizadas do ${company.name}, cidades onde a empresa está contratando e caminhos relacionados para ampliar a busca sem cair em filtros técnicos.`}
            />
          </div>

          {jobs.items.length ? (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                {jobs.items.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={(pageNumber) => buildPageHref(company.slug, variant, parsed.order, pageNumber)} />
            </>
          ) : (
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-sm text-[var(--brand-text-secondary)] shadow-sm">
            Esta empresa ainda não tem vagas ativas suficientes para uma página forte de listagem.
            </div>
          )}

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              eyebrow="Conteudo complementar"
              title={`Cidades e perfis com vagas no ${company.name}`}
              description={`Acompanhe as oportunidades mais recentes do ${company.name}, compare outras empresas no mesmo mercado e siga para paginas de cidade e estado com mais volume de busca.`}
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="brand-chip rounded-[1.8rem] p-6">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Cidades com vagas da empresa</h2>
            <div className="mt-4 space-y-3">
              <Link href={getCityJobsPath(company.city.slug)} className="block rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-3 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:text-[var(--brand-orange)]">
                {company.city.name}, {company.state.code}
              </Link>
              <Link href={getStateJobsPath(company.state.slug)} className="block rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-3 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:text-[var(--brand-orange)]">
                {company.state.name}
              </Link>
            </div>
          </div>

          <div className="brand-panel rounded-[1.8rem] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Empresas relacionadas</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedCompanies.map((item) => (
                <Link key={item.slug} href={relatedCompanyHref(item.slug)} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:text-[var(--brand-orange)]">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="brand-panel rounded-[1.8rem] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Vagas parecidas</h2>
            <div className="mt-4 space-y-4">
              {jobs.items.slice(0, 4).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="space-y-6">
      <SectionHeading eyebrow="Perguntas frequentes" title={`FAQ sobre Jovem Aprendiz no ${company.name}`} description="Bloco de apoio para fortalecer a página de empresa com respostas públicas e úteis." />
        <FaqList items={faq} />
      </div>
    </section>
  );
}
