import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JobCard } from "@/components/job-card";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { buildListingFaq, buildListingCollectionPageJsonLd, getCityJobsPath, getStateJobsPath } from "@/lib/seo/jobs-pages";
import { buildProgrammaticCityTitle, jovemAprendizCityPath, jovemAprendizStatePath } from "@/lib/seo/jovem-aprendiz-programmatic";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getCityByStateAndSlug, getStateBySlug } from "@/lib/repositories/geo";
import { getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";

export const revalidate = 1200;

function buildPageHref(stateSlug: string, citySlug: string, order: "relevance" | "date" | undefined, pageNumber: number) {
  const params = new URLSearchParams();
  if (order && order !== "relevance") params.set("order", order);
  if (pageNumber > 1) params.set("page", String(pageNumber));
  const query = params.toString();
  const base = jovemAprendizCityPath(stateSlug, citySlug);
  return query ? `${base}?${query}` : base;
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ estado: string; cidade: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { estado, cidade } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const city = await getCityByStateAndSlug(estado, cidade);
  const pathname = jovemAprendizCityPath(estado, cidade);
  const canonicalPath = city ? getCityJobsPath(city.slug) : getCityJobsPath(cidade);

  if (!city) {
    return buildSiteMetadata({
      title: "Cidade não encontrada",
      description: "Página não encontrada.",
      pathname,
      canonicalUrl: canonicalPath,
      noIndex: true
    });
  }

  const jobs = await getJobsList({ stateSlug: city.state.slug, citySlug: city.slug, order: parsed.order, page: parsed.page });
  const title = buildProgrammaticCityTitle(jobs.total, city.name, city.state.code);
  const description = `Listagem com ${jobs.total} vaga(s) de Jovem Aprendiz em ${city.name}, ${city.state.code}.`;

  return buildSiteMetadata({
    title,
    description,
    pathname,
    canonicalUrl: canonicalPath,
    // Variante programatica mantida apenas para navegacao e UX.
    noIndex: true
  });
}

export default async function JovemAprendizCidadePage({
  params,
  searchParams
}: {
  params: Promise<{ estado: string; cidade: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { estado, cidade } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const city = await getCityByStateAndSlug(estado, cidade);
  if (!city) {
    notFound();
  }

  const state = await getStateBySlug(city.state.slug);
  if (!state) {
    notFound();
  }

  const jobs = await getJobsList({ stateSlug: city.state.slug, citySlug: city.slug, order: parsed.order, page: parsed.page });
  const pathname = jovemAprendizCityPath(estado, cidade);
  const title = buildProgrammaticCityTitle(jobs.total, city.name, city.state.code);
  const intro = `Vagas de Jovem Aprendiz em ${city.name}, ${city.state.code}, com foco em primeiro emprego.`;
  const faq = buildListingFaq({ name: `${city.name}, ${city.state.code}`, totalJobs: jobs.total, type: "city" });
  const buildOrderHref = (order: "relevance" | "date") => buildPageHref(state.slug, city.slug, order, 1);
  const noIndex = jobs.total === 0;

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vagas", path: "/vagas" },
          { name: state.name, path: jovemAprendizStatePath(state.slug) },
          { name: city.name, path: pathname }
        ])}
      />
      <JsonLd data={buildListingCollectionPageJsonLd({ name: title, description: intro, path: pathname })} />
      <JsonLd data={buildFaqJsonLd(faq)} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Vagas", href: "/vagas" },
          { label: state.name, href: jovemAprendizStatePath(state.slug) },
          { label: city.name }
        ]}
      />

      <header className="brand-page-hero rounded-[2rem] border border-slate-200 px-5 py-6 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Jovem Aprendiz por cidade</p>
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
          Sem vagas ativas para indexar esta URL. Quando houver oportunidades, a página será indexada.
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              eyebrow="Listagem local"
              title={`Oportunidades em ${city.name}`}
              description="Compare empresas, cargos e links de candidatura com SEO local."
            />
          </div>

          {jobs.items.length ? (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                {jobs.items.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={(pageNumber) => buildPageHref(state.slug, city.slug, parsed.order, pageNumber)} />
            </>
          ) : (
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-sm text-[var(--brand-text-secondary)] shadow-sm">
              Sem vagas ativas nesta cidade.
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="brand-chip rounded-[1.8rem] p-6">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Rotas relacionadas</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link className="text-[var(--brand-blue)] hover:text-[var(--brand-orange)]" href={getCityJobsPath(city.slug)}>
                  Listagem classica da cidade
                </Link>
              </li>
              <li>
                <Link className="text-[var(--brand-blue)] hover:text-[var(--brand-orange)]" href={getStateJobsPath(state.slug)}>
                  Vagas no estado {state.name}
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-[var(--brand-navy)]">Perguntas frequentes</h2>
        <FaqList items={faq} />
      </div>
    </section>
  );
}
