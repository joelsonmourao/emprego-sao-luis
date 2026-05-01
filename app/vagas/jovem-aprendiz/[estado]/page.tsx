import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JobCard } from "@/components/job-card";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { buildListingFaq, buildListingCollectionPageJsonLd, getStateJobsPath } from "@/lib/seo/jobs-pages";
import { buildProgrammaticStateTitle, jovemAprendizCityPath, jovemAprendizStatePath } from "@/lib/seo/jovem-aprendiz-programmatic";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getStateBySlug } from "@/lib/repositories/geo";
import { getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";

export const revalidate = 1200;

function buildPageHref(stateSlug: string, order: "relevance" | "date" | undefined, pageNumber: number) {
  const params = new URLSearchParams();
  if (order && order !== "relevance") params.set("order", order);
  if (pageNumber > 1) params.set("page", String(pageNumber));
  const query = params.toString();
  const base = jovemAprendizStatePath(stateSlug);
  return query ? `${base}?${query}` : base;
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ estado: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { estado } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const state = await getStateBySlug(estado);
  const pathname = jovemAprendizStatePath(estado);
  const canonicalPath = getStateJobsPath(estado);

  if (!state) {
    return buildSiteMetadata({
      title: "Estado não encontrado",
      description: "Página não encontrada.",
      pathname,
      canonicalUrl: canonicalPath,
      noIndex: true
    });
  }

  const jobs = await getJobsList({ stateSlug: state.slug, order: parsed.order, page: parsed.page });
  const title = buildProgrammaticStateTitle(jobs.total, state.name, state.code);
  const description = `Veja ${jobs.total} vaga(s) de Jovem Aprendiz no ${state.name}. Listagem atualizada em portal focado em primeiro emprego.`;

  return buildSiteMetadata({
    title,
    description,
    pathname,
    canonicalUrl: canonicalPath,
    // Variante programatica mantida apenas para navegacao e UX.
    noIndex: true
  });
}

export default async function JovemAprendizEstadoPage({
  params,
  searchParams
}: {
  params: Promise<{ estado: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { estado } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const state = await getStateBySlug(estado);
  if (!state) {
    notFound();
  }

  const jobs = await getJobsList({ stateSlug: state.slug, order: parsed.order, page: parsed.page });
  const pathname = jovemAprendizStatePath(estado);
  const title = buildProgrammaticStateTitle(jobs.total, state.name, state.code);
  const intro = `Listagem de vagas de Jovem Aprendiz no estado ${state.name}. Somente oportunidades ativas no portal.`;
  const faq = buildListingFaq({ name: state.name, totalJobs: jobs.total, type: "state" });
  const buildOrderHref = (order: "relevance" | "date") => buildPageHref(state.slug, order, 1);
  const noIndex = jobs.total === 0;

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vagas", path: "/vagas" },
          { name: `Jovem Aprendiz no ${state.name}`, path: pathname }
        ])}
      />
      <JsonLd data={buildListingCollectionPageJsonLd({ name: title, description: intro, path: pathname })} />
      <JsonLd data={buildFaqJsonLd(faq)} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }, { label: state.name }]} />

      <header className="brand-page-hero rounded-[2rem] border border-slate-200 px-5 py-6 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Jovem Aprendiz por estado</p>
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
          Ainda não há vagas ativas suficientes para indexar esta página. Quando novas oportunidades entrarem, ela passa a ser indexada automaticamente.
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              eyebrow="Listagem"
              title={`Vagas em destaque no ${state.name}`}
              description="Compare cargos, empresas e links de candidatura. Conteudo pensado para SEO local e navegacao clara."
            />
          </div>

          {jobs.items.length ? (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                {jobs.items.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={(pageNumber) => buildPageHref(state.slug, parsed.order, pageNumber)} />
            </>
          ) : (
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-sm text-[var(--brand-text-secondary)] shadow-sm">
              Sem vagas ativas para este estado no momento.
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="brand-chip rounded-[1.8rem] p-6">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Cidades com vagas</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {state.cities
                .filter((c) => c._count.jobs > 0)
                .slice(0, 12)
                .map((c) => (
                  <li key={c.id}>
                    <Link className="font-medium text-[var(--brand-blue)] hover:text-[var(--brand-orange)]" href={jovemAprendizCityPath(state.slug, c.slug)}>
                      {c.name}
                    </Link>
                  </li>
                ))}
            </ul>
            <Link href={getStateJobsPath(state.slug)} className="mt-4 inline-block text-sm font-semibold text-[var(--brand-text-secondary)] hover:text-[var(--brand-orange)]">
              Ver rota classica do estado
            </Link>
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
