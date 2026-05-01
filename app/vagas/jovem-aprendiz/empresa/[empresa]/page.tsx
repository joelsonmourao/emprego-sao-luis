import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JobCard } from "@/components/job-card";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { buildListingFaq, buildListingCollectionPageJsonLd, getCompanyJobsPath } from "@/lib/seo/jobs-pages";
import { buildProgrammaticCompanyTitle, jovemAprendizCompanyPath } from "@/lib/seo/jovem-aprendiz-programmatic";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getCompanyHubBySlug, getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";

export const revalidate = 1200;

function buildPageHref(companySlug: string, order: "relevance" | "date" | undefined, pageNumber: number) {
  const params = new URLSearchParams();
  if (order && order !== "relevance") params.set("order", order);
  if (pageNumber > 1) params.set("page", String(pageNumber));
  const query = params.toString();
  const base = jovemAprendizCompanyPath(companySlug);
  return query ? `${base}?${query}` : base;
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ empresa: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { empresa } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const company = await getCompanyHubBySlug(empresa);
  const pathname = jovemAprendizCompanyPath(empresa);
  const canonicalPath = getCompanyJobsPath(empresa);

  if (!company) {
    return buildSiteMetadata({
      title: "Empresa não encontrada",
      description: "Página não encontrada.",
      pathname,
      canonicalUrl: canonicalPath,
      noIndex: true
    });
  }

  const jobs = await getJobsList({ companySlug: company.slug, order: parsed.order, page: parsed.page });
  const title = buildProgrammaticCompanyTitle(jobs.total, company.name);
  const description = `Vagas de Jovem Aprendiz na ${company.name}: ${jobs.total} oportunidade(s) ativa(s).`;

  return buildSiteMetadata({
    title,
    description,
    pathname,
    canonicalUrl: canonicalPath,
    socialImageUrl: company.socialImageUrl || company.logoUrl || undefined,
    // Variante programatica mantida apenas para navegacao e UX.
    noIndex: true
  });
}

export default async function JovemAprendizEmpresaPage({
  params,
  searchParams
}: {
  params: Promise<{ empresa: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { empresa } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const company = await getCompanyHubBySlug(empresa);
  if (!company) {
    notFound();
  }

  const jobs = await getJobsList({ companySlug: company.slug, order: parsed.order, page: parsed.page });
  const pathname = jovemAprendizCompanyPath(empresa);
  const title = buildProgrammaticCompanyTitle(jobs.total, company.name);
  const intro = `Acompanhe vagas de Jovem Aprendiz na ${company.name} com listagem focada em SEO e candidatura no site oficial.`;
  const faq = buildListingFaq({ name: company.name, totalJobs: jobs.total, type: "company" });
  const buildOrderHref = (order: "relevance" | "date") => buildPageHref(company.slug, order, 1);
  const noIndex = jobs.total === 0;

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vagas", path: "/vagas" },
          { name: company.name, path: pathname }
        ])}
      />
      <JsonLd data={buildListingCollectionPageJsonLd({ name: title, description: intro, path: pathname })} />
      <JsonLd data={buildFaqJsonLd(faq)} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }, { label: company.name }]} />

      <header className="brand-page-hero rounded-[2rem] border border-slate-200 px-5 py-6 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Empresa</p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--brand-navy)] sm:text-5xl">{title}</h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--brand-text-secondary)] sm:text-lg">{intro}</p>
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
      </header>

      {noIndex ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Sem vagas ativas para indexar esta página de empresa.
        </p>
      ) : null}

      <div className="space-y-6">
        <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
      <SectionHeading eyebrow="Listagem" title={`Vagas na ${company.name}`} description="Cards com resumo e link para a página completa da vaga." />
        </div>

        {jobs.items.length ? (
          <>
            <div className="grid gap-5 lg:grid-cols-2">
              {jobs.items.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={(pageNumber) => buildPageHref(company.slug, parsed.order, pageNumber)} />
          </>
        ) : (
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-sm text-[var(--brand-text-secondary)] shadow-sm">
            Nenhuma vaga ativa para esta empresa.
          </div>
        )}

        <p className="text-sm">
          <Link href={getCompanyJobsPath(company.slug)} className="font-semibold text-[var(--brand-blue)] hover:text-[var(--brand-orange)]">
            Ver página clássica da empresa
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-[var(--brand-navy)]">Perguntas frequentes</h2>
        <FaqList items={faq} />
      </div>
    </section>
  );
}
