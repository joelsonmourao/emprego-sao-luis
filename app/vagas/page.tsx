import Link from "next/link";
import { cache } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { JobSearchForm } from "@/components/job-search-form";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import {
  buildJobsListingDescription,
  buildJobsListingHeading,
  buildJobsListingIntro,
  buildJobsListingMetaTitle,
  buildJobsSearchCanonicalPath
} from "@/lib/listing";
import { getApprenticeCityUfSitemapRows, getCompanyHubBySlug, getFeaturedCompanies, getJobsList } from "@/lib/repositories/jobs";
import { getSearchGeoData } from "@/lib/repositories/geo";
import { shouldIndexPage } from "@/lib/seo/indexing";
import { buildJovemAprendizCityUfPath } from "@/lib/seo/jovem-aprendiz-city-uf-slug";
import { getCityJobsPath, getCompanyJobsPath, getStateJobsPath } from "@/lib/seo/jobs-pages";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { jobSearchParamsSchema } from "@/lib/schemas/search";
import { renderFaqTemplate, renderTemplate } from "@/lib/site-copy";
import { getSiteContent } from "@/lib/site-content";
import { JobsGridWithMidAd } from "@/components/vagas/jobs-grid-with-mid-ad";

export const revalidate = 600;

const getJobsAndGeoForSearch = cache(
  async (key: string) => {
    const parsed = jobSearchParamsSchema.parse(JSON.parse(key) as Record<string, unknown>);
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
    return { jobs, states, parsed };
  }
);

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const normalizedInput = {
    q: typeof raw.q === "string" ? raw.q : undefined,
    estado: typeof raw.estado === "string" ? raw.estado : undefined,
    cidade: typeof raw.cidade === "string" ? raw.cidade : undefined,
    empresa: typeof raw.empresa === "string" ? raw.empresa : undefined,
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  };
  const { jobs, states, parsed } = await getJobsAndGeoForSearch(JSON.stringify(normalizedInput));

  const selectedState = states.find((state) => state.slug === parsed.estado);
  const selectedCity = selectedState?.cities.find((city) => city.slug === parsed.cidade);
  
  const isBaseListing =
    !parsed.q &&
    !parsed.estado &&
    !parsed.cidade &&
    !parsed.empresa &&
    (parsed.page ?? 1) === 1 &&
    (parsed.order ?? "relevance") === "relevance";

  const shouldIndex = shouldIndexPage({
    kind: isBaseListing ? "jobs-root" : "technical-query",
    totalJobs: jobs.total,
    hasSpecificMetadata: true,
    hasOwnContent: true,
    internalLinkCount: 8,
    hasBetterCanonical: Boolean(!parsed.q && (parsed.estado || parsed.cidade || parsed.empresa)),
    isTechnicalQuery: !isBaseListing
  });

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
      stateCode: selectedState?.code,
      companySlug: parsed.empresa,
      order: parsed.order,
      page: parsed.page
    }),
    // CORREÇÃO: Se houver estado ou cidade, forçamos a indexação (false para noIndex).
    // Se quiser liberar para TUDO, basta colocar noIndex: false
    noIndex: !shouldIndex
  });
}

export default async function JobsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const normalizedInput = {
    q: typeof raw.q === "string" ? raw.q : undefined,
    estado: typeof raw.estado === "string" ? raw.estado : undefined,
    cidade: typeof raw.cidade === "string" ? raw.cidade : undefined,
    empresa: typeof raw.empresa === "string" ? raw.empresa : undefined,
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  };
  const { jobs, states, parsed } = await getJobsAndGeoForSearch(JSON.stringify(normalizedInput));

  const [featuredCompanies, selectedCompany, siteContent, apprenticeSeoRows] = await Promise.all([
    getFeaturedCompanies(),
    parsed.empresa ? getCompanyHubBySlug(parsed.empresa) : Promise.resolve(null),
    getSiteContent(),
    getApprenticeCityUfSitemapRows()
  ]);

  const selectedState = states.find((state) => state.slug === parsed.estado);
  const selectedCity = selectedState?.cities.find((city) => city.slug === parsed.cidade);
  const selectedCompanyName = selectedCompany?.name;

  const cityMetaByKey = new Map<string, { name: string; stateCode: string }>();
  for (const st of states) {
    for (const c of st.cities) {
      cityMetaByKey.set(`${c.slug}__${st.code}`, { name: c.name, stateCode: st.code });
    }
  }
  const apprenticeSeoCityLinks = apprenticeSeoRows
    .map((row) => {
      const meta = cityMetaByKey.get(`${row.citySlug}__${row.stateCode}`);
      if (!meta) return null;
      return { ...row, cityName: meta.name, stateCode: meta.stateCode };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime())
    .slice(0, 12);
  
  const heading = buildJobsListingHeading({
    total: jobs.total,
    query: parsed.q,
    stateName: selectedState?.name,
    cityName: selectedCity?.name,
    stateCode: selectedState?.code,
    companyName: selectedCompanyName
  });
  
  const intro = buildJobsListingIntro({
    total: jobs.total,
    query: parsed.q,
    stateName: selectedState?.name,
    cityName: selectedCity?.name,
    stateCode: selectedState?.code,
    companyName: selectedCompanyName
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
            {parsed.q ? "Busca filtrada" : "Vagas de Jovem Aprendiz e Menor Aprendiz"}
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
          <JobsGridWithMidAd jobs={jobs.items} />

          <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={buildPageHref} />
        </>
      ) : (
        <EmptyState
        title="Ainda não encontramos vagas com essa combinação"
          description="Tente remover alguns filtros ou navegar pelas paginas de cidade e estado para encontrar mais oportunidades."
        />
      )}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="brand-chip rounded-[1.5rem] p-4 sm:rounded-[1.8rem] sm:p-5 sm:rounded-[2rem] sm:p-6">
          <h2 className="text-base font-black text-slate-950 sm:text-lg">Empresas com vagas recentes</h2>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
            {featuredCompanies.slice(0, 8).map((company) => (
              <Link key={company.slug} href={getCompanyJobsPath(company.slug)} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm">
                {company.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="brand-panel rounded-[1.5rem] border border-slate-200 p-4 shadow-[0_25px_80px_-50px_rgba(26,43,76,0.22)] sm:rounded-[1.8rem] sm:p-6 sm:rounded-[2rem] sm:p-8">
          <SectionHeading
            eyebrow="Continue a busca"
            title="Use cidade, estado e empresa para encontrar uma vaga com mais foco"
        description="Quanto mais perto a busca ficar da sua realidade, mais rápido você chega nas vagas que combinam com a sua rotina."
          />
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            {states.slice(0, 6).map((state) => (
              <Link
                key={state.id}
                href={getStateJobsPath(state.slug)}
                className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
              >
                {state.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            {apprenticeSeoCityLinks.map((row) => (
              <Link
                key={`${row.citySlug}-${row.stateCode}`}
                href={buildJovemAprendizCityUfPath(row.citySlug, row.stateCode)}
                className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
              >
                {`Vagas de Jovem Aprendiz em ${row.cityName}, ${row.stateCode}`}
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
