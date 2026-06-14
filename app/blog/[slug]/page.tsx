import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, CalendarDays } from "lucide-react";

import { BlogCard } from "@/components/blog-card";
import { BlogCoverImage } from "@/components/blog-cover-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getPostBySlug, getRelatedPosts } from "@/lib/repositories/blog";
import { formatDate } from "@/lib/utils";

export const revalidate = 7200;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return buildSiteMetadata({
      title: "Post não encontrado",
      description: "O conteúdo solicitado não foi encontrado.",
      pathname: `/blog/${slug}`,
      noIndex: true
    });
  }

  return buildSiteMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    pathname: `/blog/${post.slug}`,
    socialImageUrl: post.coverImageUrl || undefined
  });
}

function extractHeadings(html: string) {
  const matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];
  return matches.map((match) => match[1].replace(/<[^>]+>/g, "").trim()).filter(Boolean);
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts({ slug: post.slug, categoryId: post.categoryId, limit: 3 });
  const toc = extractHeadings(post.contentHtml);

  return (
    <article className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` }
        ])}
      />
      <JsonLd
        data={buildArticleJsonLd({
          title: post.title,
          description: post.excerpt,
          path: `/blog/${post.slug}`,
          publishedAt: post.publishedAt,
          coverImageUrl: post.coverImageUrl
        })}
      />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <header className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full border border-[rgba(123,44,40,0.16)] bg-[var(--brand-beige)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--brand-brick)]">
                {post.category.name}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--brand-text-secondary)]">
                <CalendarDays className="h-4 w-4" />
                {post.publishedAt ? formatDate(post.publishedAt) : "Data não informada"}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-[var(--brand-charcoal)] sm:text-4xl">{post.title}</h1>
            <p className="text-base leading-8 text-[var(--brand-text-secondary)]">{post.excerpt}</p>
          </header>

          <div className="overflow-hidden rounded-3xl border border-[var(--brand-line)]">
            <BlogCoverImage slug={post.slug} title={post.title} category={post.category.name} coverImageUrl={post.coverImageUrl} priority />
          </div>

          {toc.length > 2 ? (
            <nav aria-label="Sumário do artigo" className="brand-chip rounded-2xl p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--brand-green)]">Neste artigo</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {toc.map((heading) => (
                  <li key={heading} className="text-[var(--brand-text-secondary)]">
                    {heading}
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div
            className="prose-content rounded-3xl border border-[var(--brand-line)] bg-white p-6 text-[var(--brand-charcoal)] sm:p-8"
            dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(post.contentHtml) }}
          />

          <aside className="rounded-2xl border border-[rgba(123,44,40,0.2)] bg-[rgba(123,44,40,0.06)] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-brick)]" />
              <div>
                <h2 className="text-lg font-extrabold text-[var(--brand-charcoal)]">Cuidado com golpes em vagas</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--brand-text-secondary)]">
                  O Emprego São Luís divulga oportunidades, mas não solicita pagamento para candidatura. Desconfie de pedidos de PIX, senhas ou documentos fora do processo oficial da empresa. Confira sempre o anunciante antes de enviar dados sensíveis.
                </p>
              </div>
            </div>
          </aside>

          <div className="brand-dark-panel rounded-3xl p-6 text-white sm:p-8">
            <h2 className="text-2xl font-extrabold">Pronto para buscar vagas?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/86">
              Veja oportunidades em São Luís e no Maranhão com filtros por cidade, categoria e empresa.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-5 gap-2">
              <Link href="/vagas">
                Ver vagas disponíveis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <aside className="space-y-6">
          <h2 className="text-lg font-extrabold text-[var(--brand-charcoal)]">Artigos relacionados</h2>
          <div className="space-y-5">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
