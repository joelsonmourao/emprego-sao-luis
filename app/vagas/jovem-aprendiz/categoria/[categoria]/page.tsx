import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JobCard } from "@/components/job-card";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { getEmploymentCategoryBySlug } from "@/lib/employment-categories";
import { buildListingFaq, buildListingCollectionPageJsonLd } from "@/lib/seo/jobs-pages";
import { buildProgrammaticCategoryTitle, jovemAprendizCategoryPath } from "@/lib/seo/jovem-aprendiz-programmatic";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";

export const revalidate = 1200;

function buildPageHref(categorySlug: string, order: "relevance" | "date" | undefined, pageNumber: number) {
  const params = new URLSearchParams();
  if (order && order !== "relevance") params.set("order", order);
  if (pageNumber > 1) params.set("page", String(pageNumber));
  const query = params.toString();
  const base = jovemAprendizCategoryPath(categorySlug);
  return query ? `${base}?${query}` : base;
}

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { categoria } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const category = getEmploymentCategoryBySlug(categoria);
  const pathname = jovemAprendizCategoryPath(categoria);

  if (!category) {
    return buildSiteMetadata({
      title: "Categoria nao encontrada",
      description: "Pagina nao encontrada.",
      pathname,
      noIndex: true
    });
  }

  const jobs = await getJobsList({ employmentType: category.employmentType, order: parsed.order, page: parsed.page });
  const title = buildProgrammaticCategoryTitle(jobs.total, category.label);
  const description = `${category.description} Total de ${jobs.total} vaga(s) ativa(s).`;

  return buildSiteMetadata({
    title,
    description,
    pathname,
    canonicalUrl: pathname,
    noIndex: jobs.total === 0 || parsed.page > 1 || (parsed.order ?? "relevance") !== "relevance"
  });
}

export default async function JovemAprendizCategoriaPage({
  params,
  searchParams
}: {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { categoria } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });

  const category = getEmploymentCategoryBySlug(categoria);
  if (!category) {
    notFound();
  }

  const jobs = await getJobsList({ employmentType: category.employmentType, order: parsed.order, page: parsed.page });
  const pathname = jovemAprendizCategoryPath(categoria);
  const title = buildProgrammaticCategoryTitle(jobs.total, category.label);
  const intro = category.description;
  const faq = buildListingFaq({ name: category.label, totalJobs: jobs.total, type: "state" });
  const buildOrderHref = (order: "relevance" | "date") => buildPageHref(category.slug, order, 1);
  const noIndex = jobs.total === 0;

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vagas", path: "/vagas" },
          { name: category.label, path: pathname }
        ])}
      />
      <JsonLd data={buildListingCollectionPageJsonLd({ name: title, description: intro, path: pathname })} />
      <JsonLd data={buildFaqJsonLd(faq)} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }, { label: category.label }]} />

      <header className="brand-page-hero rounded-[2rem] border border-slate-200 px-5 py-6 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Por tipo de vaga</p>
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
          Sem vagas ativas nesta categoria para indexacao.
        </p>
      ) : null}

      <div className="space-y-6">
        <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading eyebrow="Listagem" title={`Vagas: ${category.label}`} description="Somente vagas ativas no portal." />
        </div>

        {jobs.items.length ? (
          <>
            <div className="grid gap-5 lg:grid-cols-2">
              {jobs.items.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={(pageNumber) => buildPageHref(category.slug, parsed.order, pageNumber)} />
          </>
        ) : (
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-sm text-[var(--brand-text-secondary)] shadow-sm">
            Nenhuma vaga ativa nesta categoria.
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-[var(--brand-navy)]">Perguntas frequentes</h2>
        <FaqList items={faq} />
      </div>
    </section>
  );
}
