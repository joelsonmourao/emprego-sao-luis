import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JobCard } from "@/components/job-card";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { buildListingFaq, buildListingCollectionPageJsonLd, buildCityListingSeo, getCityJobsPath, getCompanyJobsPath, getStateJobsPath } from "@/lib/seo/jobs-pages";
import { shouldIndexPage } from "@/lib/seo/indexing";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getCityBySlug, getStateBySlug } from "@/lib/repositories/geo";
import { getCompanyHubs, getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";

export const revalidate = 1200;

function buildPageHref(slug: string, order: "relevance" | "date" | undefined, pageNumber: number) {
  const params = new URLSearchParams();
  if (order && order !== "relevance") params.set("order", order);
  if (pageNumber > 1) params.set("page", String(pageNumber));
  const query = params.toString();
  return query ? `${getCityJobsPath(slug)}?${query}` : getCityJobsPath(slug);
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const city = await getCityBySlug(slug);

  if (!city) {
    return buildSiteMetadata({
      title: "Cidade não encontrada",
      description: "A página de cidade solicitada não foi encontrada.",
      pathname: getCityJobsPath(slug),
      noIndex: true
    });
  }

  const jobs = await getJobsList({
    stateSlug: city.state.slug,
    citySlug: city.slug,
    order: parsed.order,
    page: parsed.page
  });

  const seo = buildCityListingSeo({
    cityName: city.name,
    citySlug: city.slug,
    stateName: city.state.name,
    stateSlug: city.state.slug,
    stateCode: city.state.code,
    totalJobs: jobs.total
  });

  const shouldIndex = shouldIndexPage({
    kind: "city-listing",
    totalJobs: jobs.total,
    hasSpecificMetadata: true,
    hasOwnContent: true,
    internalLinkCount: 6,
    isDuplicateLike: false
  });

  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "bb2dcd" },
    body: JSON.stringify({
      sessionId: "bb2dcd",
      runId: "pre-fix",
      hypothesisId: "H5",
      location: "app/vagas/cidade/[slug]/page.tsx",
      message: "city listing indexing decision",
      data: {
        citySlug: city.slug,
        totalJobs: jobs.total,
        page: parsed.page,
        order: parsed.order ?? "relevance",
        shouldIndex
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  return buildSiteMetadata({
    title: seo.title,
    description: seo.description,
    pathname: seo.canonicalPath,
    canonicalUrl: seo.canonicalPath,
    noIndex: parsed.page > 1 || (parsed.order ?? "relevance") !== "relevance" || !shouldIndex
  });
}

export default async function JobsByCityCleanPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const city = await getCityBySlug(slug);
  if (!city) {
    notFound();
  }

  const [state, jobs, companies] = await Promise.all([
    getStateBySlug(city.state.slug),
    getJobsList({
      stateSlug: city.state.slug,
      citySlug: city.slug,
      order: parsed.order,
      page: parsed.page
    }),
    getCompanyHubs()
  ]);

  if (!state) {
    notFound();
  }

  const seo = buildCityListingSeo({
    cityName: city.name,
    citySlug: city.slug,
    stateName: city.state.name,
    stateSlug: city.state.slug,
    stateCode: city.state.code,
    totalJobs: jobs.total
  });

  const faq = buildListingFaq({ name: `${city.name}, ${city.state.code}`, totalJobs: jobs.total, type: "city" });
  const companiesInCity = companies.filter((company) => company.citySlug === city.slug).slice(0, 8);
  const siblingCities = state.cities.filter((item) => item.slug !== city.slug && item._count.jobs > 0).slice(0, 8);
  const relatedJobs = jobs.items.slice(0, 6);
  const buildOrderHref = (order: "relevance" | "date") => buildPageHref(city.slug, order, 1);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vagas", path: "/vagas" },
          { name: state.name, path: getStateJobsPath(state.slug) },
          { name: `${city.name}, ${city.state.code}`, path: getCityJobsPath(city.slug) }
        ])}
      />
      <JsonLd data={buildListingCollectionPageJsonLd({ name: seo.h1, description: seo.description, path: seo.canonicalPath })} />
      <JsonLd data={buildFaqJsonLd(faq)} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Vagas", href: "/vagas" },
          { label: state.name, href: getStateJobsPath(state.slug) },
          { label: city.name }
        ]}
      />

      <div className="brand-page-hero rounded-[2rem] border border-slate-200 px-5 py-6 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8 sm:py-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-white px-4 py-2 font-semibold text-[var(--brand-orange)]">
              {jobs.total} {jobs.total === 1 ? "vaga ativa" : "vagas ativas"}
            </span>
            <span className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-[var(--brand-text-secondary)]">
              {city.name}, {city.state.code}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--brand-navy)] sm:text-5xl">{seo.h1}</h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--brand-text-secondary)] sm:text-lg">{seo.intro}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-[var(--brand-text-secondary)]">Ordenar por:</span>
            <Link href={buildOrderHref("relevance")} className={parsed.order === "date" ? "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)]" : "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white"}>
              Relevancia
            </Link>
            <Link href={buildOrderHref("date")} className={parsed.order === "date" ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white" : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)]"}>
              Data
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              eyebrow="Busca local"
              title={`Empresas e oportunidades de Jovem Aprendiz em ${city.name}`}
        description={`Use esta página para acompanhar vagas por empresa, comparar oportunidades recentes e navegar para o estado de ${state.name} e cidades próximas com mais contratações.`}
            />
          </div>

          {jobs.items.length ? (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                {jobs.items.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={(pageNumber) => buildPageHref(city.slug, parsed.order, pageNumber)} />
            </>
          ) : (
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-sm text-[var(--brand-text-secondary)] shadow-sm">
              Ainda não existem vagas ativas suficientes nesta cidade para indexação forte.
            </div>
          )}

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              eyebrow="Mais contexto"
        title={`Como usar esta página para encontrar Jovem Aprendiz em ${city.name}`}
              description={`Acompanhe novas vagas, veja empresas contratando em ${city.name}, ${city.state.code}, compare requisitos frequentes e continue a busca por oportunidades semelhantes no estado.`}
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="brand-chip rounded-[1.8rem] p-6">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Empresas com vagas nesta cidade</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {companiesInCity.map((company) => (
                <Link key={company.slug} href={getCompanyJobsPath(company.slug)} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:text-[var(--brand-orange)]">
                  {company.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="brand-panel rounded-[1.8rem] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Continue pelo estado</h2>
            <div className="mt-4 space-y-3">
              <Link href={getStateJobsPath(state.slug)} className="block rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-3 text-sm font-semibold text-[var(--brand-text-secondary)] transition hover:text-[var(--brand-orange)]">
                Ver vagas de Jovem Aprendiz no {state.name}
              </Link>
              {siblingCities.map((relatedCity) => (
                <Link key={relatedCity.id} href={getCityJobsPath(relatedCity.slug)} className="block rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-3 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:text-[var(--brand-orange)]">
                  {relatedCity.name}, {state.code}
                </Link>
              ))}
            </div>
          </div>

          <div className="brand-panel rounded-[1.8rem] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Vagas relacionadas</h2>
            <div className="mt-4 space-y-4">
              {relatedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="space-y-6">
      <SectionHeading eyebrow="Perguntas frequentes" title={`FAQ sobre Jovem Aprendiz em ${city.name}, ${city.state.code}`} description="Respostas objetivas para fortalecer a navegação e a intenção de busca desta página." />
        <FaqList items={faq} />
      </div>
    </section>
  );
}
