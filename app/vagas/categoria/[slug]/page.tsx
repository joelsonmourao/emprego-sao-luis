import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCard } from "@/components/job-card";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { getJobCategoryBySlug } from "@/lib/job-categories";
import { getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";

export const revalidate = 1800;

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
  const category = getJobCategoryBySlug(slug);
  const basePath = `/vagas/categoria/${slug}`;

  if (!category) {
    return buildSiteMetadata({
      title: "Categoria não encontrada",
      description: "A categoria solicitada não foi encontrada.",
      pathname: basePath,
      noIndex: true
    });
  }

  const pageSuffix = parsed.page > 1 ? ` - Página ${parsed.page}` : "";

  return buildSiteMetadata({
    title: `Vagas de ${category.name} em São Luís e Maranhão${pageSuffix} - Emprego São Luís`,
    description: `Veja vagas de ${category.name} em São Luís, Região Metropolitana e cidades do Maranhão.`,
    pathname: basePath,
    canonicalUrl:
      parsed.page > 1
        ? `${basePath}?page=${parsed.page}${parsed.order && parsed.order !== "relevance" ? `&order=${parsed.order}` : ""}`
        : basePath,
    noIndex: parsed.page > 1
  });
}

export default async function CategoryJobsPage({
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

  const category = getJobCategoryBySlug(slug);
  if (!category) notFound();

  const jobs = await getJobsList({
    categorySlug: category.slug,
    stateSlug: "maranhao",
    order: parsed.order,
    page: parsed.page
  });

  const basePath = `/vagas/categoria/${slug}`;

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vagas", path: "/vagas" },
          { name: category.name, path: basePath }
        ])}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Vagas", href: "/vagas" },
          { label: category.name }
        ]}
      />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 sm:px-8">
        <SectionHeading
          eyebrow="Categoria"
          title={`Vagas de ${category.name} em São Luís e Maranhão`}
          description={category.description}
        />
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--brand-text-secondary)]">
          Oportunidades divulgadas na categoria {category.name}. O Emprego São Luís atua como divulgador — confira os detalhes e acesse o link oficial de candidatura informado pela empresa anunciante.
        </p>
      </div>

      {jobs.items.length ? (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {jobs.items.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-sm leading-7 text-[var(--brand-text-secondary)]">
          Não há vagas publicadas nesta categoria no momento.{" "}
          <Link href="/vagas" className="font-semibold text-[var(--brand-brick)] hover:underline">
            Ver todas as vagas
          </Link>{" "}
          ou{" "}
          <Link href="/categorias" className="font-semibold text-[var(--brand-brick)] hover:underline">
            explorar outras categorias
          </Link>
          .
        </div>
      )}

      <PaginationNav
        page={jobs.page}
        totalPages={jobs.totalPages}
        buildHref={(pageNumber) => {
          const params = new URLSearchParams();
          if (parsed.order && parsed.order !== "relevance") params.set("order", parsed.order);
          if (pageNumber > 1) params.set("page", String(pageNumber));
          const query = params.toString();
          return query ? `${basePath}?${query}` : basePath;
        }}
      />
    </section>
  );
}
