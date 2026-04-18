import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { JobCard } from "@/components/job-card";
import { JobSearchForm } from "@/components/job-search-form";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import {
  buildJobsListingDescription,
  buildJobsListingHeading,
  buildJobsListingIntro,
  buildJobsListingMetaTitle,
  buildJobsSearchCanonicalPath,
  isStrategicJobsSearchIndexable
} from "@/lib/listing";
import { getCompanyHubs, getJobsList } from "@/lib/repositories/jobs";
import { getSearchGeoData } from "@/lib/repositories/geo";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { jobSearchParamsSchema } from "@/lib/schemas/search";
import { renderFaqTemplate, renderTemplate } from "@/lib/site-copy";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    q: typeof raw.q === "string" ? raw.q : undefined,
    estado: typeof raw.estado === "string" ? raw.estado : undefined,
    cidade: typeof raw.cidade === "string" ? raw.cidade : undefined,
    empresa: typeof raw.empresa === "string" ? raw.empresa : undefined,
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const [jobs, states] = await Promise.all([
    getJobsList({
      query: parsed.q,
      stateSlug: parsed.estado,
      citySlug: parsed.cidade,
      companySlug: parsed.empresa,
      order: parsed.order,
      page: parsed.page
    }),
    getSearchGeoData()
  ]);

  const selectedState = states.find((state) => state.slug === parsed.estado);
  const selectedCity = selectedState?.cities.find((city) => city.slug === parsed.cidade);
  
  const indexableSearch = isStrategicJobsSearchIndexable({
    total: jobs.total,
    query: parsed.q,
    stateSlug: parsed.estado,
    citySlug: parsed.cidade,
    companySlug: parsed.empresa,
    order: parsed.order,
    page: parsed.page
  });

  const isBaseListing =
    !parsed.q &&
    !parsed.estado &&
    !parsed.cidade &&
    !parsed.empresa &&
    (parsed.page ?? 1) === 1 &&
    (parsed.order ?? "relevance") === "relevance";

  const isDuplicatedHubFilter = !parsed.q && Boolean(parsed.estado || parsed.cidade || parsed.empresa);

  return buildSiteMetadata({
    title: buildJobsListingMetaTitle({
      total: jobs.total,
      query: parsed.q,
      stateName: selectedState?.name,
      cityName: selectedCity?.name,
      stateCode: selectedState?.code
    }),
    description: buildJobsListingDescription({
      total: jobs.total,
      query: parsed.q,
      stateName: selectedState?.name,
      cityName: selectedCity?.name,
      stateCode: selectedState?.code
    }),
    pathname: "/vagas",
    canonicalUrl: buildJobsSearchCanonicalPath({
      total: jobs.total,
      query: parsed.q,
      stateSlug: parsed.estado,
      citySlug: parsed.cidade,
      companySlug: parsed.empresa,
      order: parsed.order,
      page: parsed.page
    }),
    // CORREÇÃO: Se houver estado ou cidade, forçamos a indexação (false para noIndex).
    // Se quiser liberar para TUDO, basta colocar noIndex: false
    noIndex: isBaseListing ? false : isDuplicatedHubFilter ? true : !indexableSearch
  });
}

export default async function JobsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    q: typeof raw.q === "string" ? raw.q : undefined,
    estado: typeof raw.estado === "string" ? raw.estado : undefined,
    cidade: typeof raw.cidade === "string" ? raw.cidade : undefined,
    empresa: typeof raw.empresa === "string" ? raw.empresa : undefined,
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const [jobs, states, companies, siteContent] = await Promise.all([
    getJobsList({
      query: parsed.q,
      stateSlug: parsed.estado,
      citySlug: parsed.cidade,
      companySlug: parsed.empresa,
      order: parsed.order,
      page: parsed.page
    }),
    getSearchGeoData(),
    getCompanyHubs(),
    getSiteContent()
  ]);

  const selectedState = states.find((state) => state.slug === parsed.estado);
  const selectedCity = selectedState?.cities.find((city) => city.slug === parsed.cidade);
  const selectedCompany = companies.find((company) => company.slug === parsed.empresa);
  
  const heading = buildJobsListingHeading({
    total: jobs.total,
    query: parsed.q,
    stateName: selectedState?.name,
    cityName: selectedCity?.name,
    stateCode: selectedState?.code,
    companyName: selectedCompany?.name
  });
  
  const intro = buildJobsListingIntro({
    total: jobs.total,
    query: parsed.q,
    stateName: selectedState?.name,
    cityName: selectedCity?.name,
    stateCode: selectedState?.code,
    companyName: selectedCompany?.name
  });
  
  const faqValues = { totalJobs: jobs.total };
  const faq = renderFaqTemplate(siteContent.faq.home, faqValues);
  const faqTitle = renderTemplate(siteContent.home.faqTitle, faqValues);
  const faqDescription = renderTemplate(siteContent.home.faqDescription, faqValues);

  const buildPageHref = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (parsed.q) params.set("q", parsed.q);
    if (parsed.estado) params.set("estado", parsed.estado);
    if (parsed.cidade) params.set("cidade", parsed.cidade);
    if (parsed.empresa) params.set("empresa", parsed.empresa);
    if (parsed.order) params.set("order", parsed.order);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    const query = params.toString();
    return query ? `/vagas?${query}` : "/vagas";
  };

  const buildOrderHref = (order: "relevance" | "date") => {
    const params = new URLSearchParams();
    if (parsed.q) params.set("q", parsed.q);
    if (parsed.estado) params.set("estado", parsed.estado);
    if (parsed.cidade) params.set("cidade", parsed.cidade);
    if (parsed.empresa) params.set("empresa", parsed.empresa);
    params.set("order", order);
    const query = params.toString();
    return `/vagas?${query}`;
  };

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Vagas", path: "/vagas" }])} />
      <JsonLd data={buildFaqJsonLd(faq)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas" }]} />

      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">
            {parsed.q ? "Busca filtrada" : "Vagas de Jovem Aprendiz"}
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--brand-navy)] sm:text-5xl">{heading}</h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--brand-text-secondary)] sm:text-lg">{intro}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-[var(--brand-text-secondary)]">Ordenar por:</span>
            <Link
              href={buildOrderHref("relevance") as never}
              className={
                parsed.order === "relevance"
                  ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white"
                  : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"
              }
            >
              Relevancia
            </Link>
            <Link
              href={buildOrderHref("date") as never}
              className={
                parsed.order === "date"
                  ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white"
                  : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"
              }
            >
              Data
            </Link>
          </div>
        </div>
      </div>

      <JobSearchForm states={states} action="/vagas" initialQuery={parsed.q} initialState={parsed.estado} initialCity={parsed.cidade} compact />

      {jobs.items.length ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {jobs.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={buildPageHref} />
        </>
      ) : (
        <EmptyState
          title="Ainda nao encontramos vagas com essa combinacao"
          description="Tente remover alguns filtros ou navegar pelas paginas de cidade e estado para encontrar mais oportunidades."
        />
      )}

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="brand-chip rounded-[2rem] p-6">
          <h2 className="text-lg font-black text-slate-950">Empresas com vagas recentes</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {companies.slice(0, 8).map((company) => (
              <Link key={company.slug} href={`/empresas/${company.slug}`} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]">
                {company.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="brand-panel rounded-[2rem] border border-slate-200 p-8 shadow-[0_25px_80px_-50px_rgba(26,43,76,0.22)]">
          <SectionHeading
            eyebrow="Continue a busca"
            title="Use cidade, estado e empresa para encontrar uma vaga com mais foco"
            description="Quanto mais perto a busca ficar da sua realidade, mais rapido voce chega nas vagas que combinam com a sua rotina."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {states.slice(0, 6).map((state) => (
              <Link
                key={state.id}
                href={`/vagas/estado/${state.slug}`}
                className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeading eyebrow="Perguntas frequentes" title={faqTitle} description={faqDescription} />
        <FaqList items={faq} />
      </div>
    </section>
  );
}
