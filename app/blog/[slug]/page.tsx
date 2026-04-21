import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { getCompanyJobsPath } from "@/lib/seo/jobs-pages";
import { getPostBySlug, getRelatedPosts } from "@/lib/repositories/blog";
import { getCompanyHubs } from "@/lib/repositories/jobs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return buildSiteMetadata({
      title: "Post nao encontrado",
      description: "O conteudo solicitado nao foi encontrado.",
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

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, companies] = await Promise.all([
    getRelatedPosts({ slug: post.slug, categoryId: post.categoryId, limit: 3 }),
    getCompanyHubs()
  ]);

  return (
    <article className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
            <SectionHeading eyebrow={post.category.name} title={post.title} description={post.excerpt} />
          </div>
          <div className="prose-content rounded-3xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(post.contentHtml) }} />
          <div className="brand-panel rounded-[2rem] border border-slate-200 p-8 shadow-[0_25px_80px_-50px_rgba(26,43,76,0.2)]">
            <h2 className="text-2xl font-black text-[var(--brand-navy)]">Continue lendo</h2>
            <p className="mt-3 text-base leading-8 text-[var(--brand-text-secondary)]">
              Se este conteudo te ajudou, aproveite para ver empresas com vagas e mais textos sobre curriculo, entrevista e primeiro emprego.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {companies.slice(0, 4).map((company) => (
                <Link key={company.slug} href={getCompanyJobsPath(company.slug)} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.24)] hover:text-[var(--brand-orange)]">
                  {company.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <h2 className="text-lg font-black text-[var(--brand-navy)]">Posts relacionados</h2>
          {relatedPosts.map((relatedPost) => (
            <BlogCard key={relatedPost.id} post={relatedPost} />
          ))}
        </aside>
      </div>
    </article>
  );
}
