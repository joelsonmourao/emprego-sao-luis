import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
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
import { getSiteSettings } from "@/lib/site-settings";

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

  const isDuplicatedHubFilter =
    !parsed.q &&
    (Boolean(parsed.empresa) || (Boolean(parsed.estado) && !parsed.cidade));

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

  const [jobs, states, companies, siteContent, settings] = await Promise.all([
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
    getSiteContent(),
    getSiteSettings()
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
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 sm:space-y-8 lg:px-8 lg:py-10">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Vagas", path: "/vagas" }])} />
      <JsonLd data={buildFaqJsonLd(faq)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }]} />

      <div className="brand-page-hero rounded-[1.5rem] border border-slate-200 px-4 py-5 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:rounded-[2rem] sm:px-5 sm:py-6 sm:rounded-[2.2rem] sm:px-8 sm:py-8">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-orange)] sm:text-xs sm:tracking-[0.28em]">
            {parsed.q ? "Busca filtrada" : "Vagas de Jovem Aprendiz"}
          </p>
          <h1 className="text-[1.75rem] font-black tracking-tight leading-[1.1] text-[var(--brand-navy)] sm:text-4xl sm:leading-[1.08]">{heading}</h1>
          <p className="max-w-4xl text-[14px] leading-6 text-[var(--brand-text-secondary)] sm:text-[15px] sm:leading-7 sm:text-lg sm:leading-8">{intro}</p>
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:gap-3 sm:text-sm">
            <span className="font-semibold text-[var(--brand-text-secondary)]">Ordenar por:</span>
            <Link
              href={buildOrderHref("relevance") as never}
              className={
                parsed.order === "relevance"
                  ? "whitespace-nowrap rounded-full bg-[var(--brand-navy)] px-3 py-1.5 text-xs font-semibold text-white sm:px-4 sm:py-2 sm:text-sm"
                  : "whitespace-nowrap rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
              }
            >
              Relevancia
            </Link>
            <Link
              href={buildOrderHref("date") as never}
              className={
                parsed.order === "date"
                  ? "whitespace-nowrap rounded-full bg-[var(--brand-navy)] px-3 py-1.5 text-xs font-semibold text-white sm:px-4 sm:py-2 sm:text-sm"
                  : "whitespace-nowrap rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
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
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {jobs.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          {settings.google.adsenseEnabled && settings.google.adsensePublisherId ? (
            <div className="my-4 sm:my-6">
              <AdSlot
                publisherId={settings.google.adsensePublisherId}
                slot="7890123456"
                format="auto"
                fullWidthResponsive={true}
              />
            </div>
          ) : null}
          
          <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={buildPageHref} />
        </>
      ) : (
        <EmptyState
          title="Ainda nao encontramos vagas com essa combinacao"
          description="Tente remover alguns filtros ou navegar pelas paginas de cidade e estado para encontrar mais oportunidades."
        />
      )}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="brand-chip rounded-[1.5rem] p-4 sm:rounded-[1.8rem] sm:p-5 sm:rounded-[2rem] sm:p-6">
          <h2 className="text-base font-black text-slate-950 sm:text-lg">Empresas com vagas recentes</h2>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
            {companies.slice(0, 8).map((company) => (
              <Link key={company.slug} href={`/empresas/${company.slug}`} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm">
                {company.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="brand-panel rounded-[1.5rem] border border-slate-200 p-4 shadow-[0_25px_80px_-50px_rgba(26,43,76,0.22)] sm:rounded-[1.8rem] sm:p-6 sm:rounded-[2rem] sm:p-8">
          <SectionHeading
            eyebrow="Continue a busca"
            title="Use cidade, estado e empresa para encontrar uma vaga com mais foco"
            description="Quanto mais perto a busca ficar da sua realidade, mais rapido voce chega nas vagas que combinam com a sua rotina."
          />
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            {states.slice(0, 6).map((state) => (
              <Link
                key={state.id}
                href={`/vagas/estado/${state.slug}`}
                className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <SectionHeading eyebrow="Perguntas frequentes" title={faqTitle} description={faqDescription} />
        <FaqList items={faq} />
      </div>
    </section>
  );
}
