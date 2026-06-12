import Link from "next/link";

import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getBlogCategories, getPosts } from "@/lib/repositories/blog";

export const revalidate = 7200;

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Blog sobre emprego e carreira em São Luís e Maranhão",
    description:
      "Artigos sobre currículo, entrevista, primeiro emprego, segurança em candidaturas e mercado de trabalho no Maranhão.",
    pathname: "/blog"
  });
}

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; categoria?: string }>;
}) {
  const raw = await searchParams;
  const page = Math.max(1, Number(raw.page ?? "1") || 1);
  const categorySlug = raw.categoria?.trim() || undefined;

  const [posts, categories] = await Promise.all([
    getPosts({ page, categorySlug }),
    getBlogCategories()
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const buildPageHref = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set("categoria", categorySlug);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  };

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <div className="brand-page-hero rounded-3xl border border-[var(--brand-line)] px-6 py-8 sm:px-8">
        <SectionHeading
          eyebrow="Blog Emprego São Luís"
          title="Dicas para buscar emprego, montar currículo e se preparar para entrevistas"
          description={`${posts.total} artigo(s) com orientações práticas para candidatos de São Luís, Região Metropolitana e cidades do Maranhão. Conteúdo original, útil e atualizado.`}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/vagas">Ver vagas</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/anunciar-vaga">Publicar vaga</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={
            !categorySlug
              ? "rounded-full bg-[var(--brand-green)] px-4 py-2 text-sm font-bold text-white"
              : "rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] hover:border-[var(--brand-orange)]/35"
          }
        >
          Todos
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog?categoria=${category.slug}`}
            className={
              categorySlug === category.slug
                ? "rounded-full bg-[var(--brand-green)] px-4 py-2 text-sm font-bold text-white"
                : "rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] hover:border-[var(--brand-orange)]/35"
            }
          >
            {category.name} ({category._count.posts})
          </Link>
        ))}
      </div>

      {activeCategory ? (
        <p className="text-sm text-[var(--brand-text-secondary)]">
          Filtrando por categoria: <strong className="text-[var(--brand-charcoal)]">{activeCategory.name}</strong>
        </p>
      ) : null}

      {posts.items.length ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.items.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <PaginationNav page={posts.page} totalPages={posts.totalPages} buildHref={buildPageHref} />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--brand-line)] bg-white px-6 py-12 text-center text-sm text-[var(--brand-text-secondary)]">
          Nenhum artigo encontrado para este filtro.
        </div>
      )}
    </section>
  );
}
