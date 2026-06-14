import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { JobCard } from "@/components/job-card";
import { JobSearchForm } from "@/components/job-search-form";
import { PaginationNav } from "@/components/pagination-nav";
import { buildJobsListingHeading, buildJobsListingIntro } from "@/lib/listing";
import { getJobsList } from "@/lib/repositories/jobs";
import { getSearchGeoData } from "@/lib/repositories/geo";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { jobSearchParamsSchema } from "@/lib/schemas/search";

export const revalidate = 600;

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Buscar vagas de Jovem Aprendiz",
    description: "Use a busca para filtrar vagas por cargo, cidade e estado de forma simples.",
    pathname: "/busca",
    noIndex: true
  });
}

export default async function SearchPage({
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
  const heading = parsed.q
    ? `${buildJobsListingHeading({
        total: jobs.total,
        stateName: selectedState?.name,
        cityName: selectedCity?.name,
        stateCode: selectedState?.code
      })} para "${parsed.q}"`
    : buildJobsListingHeading({
        total: jobs.total,
        stateName: selectedState?.name,
        cityName: selectedCity?.name,
        stateCode: selectedState?.code
      });

  const intro = buildJobsListingIntro({
    total: jobs.total,
    stateName: selectedState?.name,
    cityName: selectedCity?.name,
    stateCode: selectedState?.code
  });

  const buildPageHref = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (parsed.q) params.set("q", parsed.q);
    if (parsed.estado) params.set("estado", parsed.estado);
    if (parsed.cidade) params.set("cidade", parsed.cidade);
    if (parsed.empresa) params.set("empresa", parsed.empresa);
    if (parsed.order) params.set("order", parsed.order);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    return `/busca?${params.toString()}`;
  };

  const buildOrderHref = (order: "relevance" | "date") => {
    const params = new URLSearchParams();
    if (parsed.q) params.set("q", parsed.q);
    if (parsed.estado) params.set("estado", parsed.estado);
    if (parsed.cidade) params.set("cidade", parsed.cidade);
    if (parsed.empresa) params.set("empresa", parsed.empresa);
    params.set("order", order);
    return `/busca?${params.toString()}`;
  };

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Busca" }]} />

      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-brick)]">Busca de vagas</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{heading}</h1>
          <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">{intro}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-slate-700">Ordenar por:</span>
            <Link href={buildOrderHref("relevance") as never} className={parsed.order === "relevance" ? "rounded-full bg-[var(--brand-brick)] px-4 py-2 font-semibold text-white" : "rounded-full border border-[rgba(123,44,40,0.14)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)] transition hover:border-[rgba(123,44,40,0.34)] hover:text-[var(--brand-brick)]"}>
              Relevancia
            </Link>
            <Link href={buildOrderHref("date") as never} className={parsed.order === "date" ? "rounded-full bg-[var(--brand-brick)] px-4 py-2 font-semibold text-white" : "rounded-full border border-[rgba(123,44,40,0.14)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)] transition hover:border-[rgba(123,44,40,0.34)] hover:text-[var(--brand-brick)]"}>
              Data
            </Link>
          </div>
        </div>
      </div>

      <JobSearchForm states={states} action="/busca" initialQuery={parsed.q} initialState={parsed.estado} initialCity={parsed.cidade} compact />

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
          title="Nenhuma vaga encontrada com esses filtros"
          description="Tente remover alguns filtros ou navegar pelas paginas de cidade e estado para encontrar mais oportunidades."
          href="/vagas"
          actionLabel="Explorar vagas"
        />
      )}
    </section>
  );
}
