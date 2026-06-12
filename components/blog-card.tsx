import { ArrowUpRight, CalendarDays } from "lucide-react";

import { BlogCoverImage } from "@/components/blog-cover-image";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { formatDate } from "@/lib/utils";

type BlogCardProps = {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: Date;
    coverImageUrl?: string | null;
    coverImageAlt?: string | null;
    category: { name: string };
  };
  featured?: boolean;
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article
      className={`es-card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-white shadow-[0_18px_50px_-36px_rgba(26,26,26,0.2)] ${featured ? "lg:flex-row lg:items-stretch" : ""}`}
    >
      <div className={`relative overflow-hidden bg-[var(--brand-mist)] ${featured ? "lg:w-[42%]" : "aspect-[16/9]"}`}>
        <BlogCoverImage
          slug={post.slug}
          title={post.title}
          category={post.category.name}
          coverImageUrl={post.coverImageUrl}
          coverImageAlt={post.coverImageAlt}
          className="h-full min-h-full transition duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? "lg:justify-center" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-[rgba(242,140,27,0.12)] px-3 py-1 font-bold uppercase tracking-wide text-[var(--brand-orange)]">
            {post.category.name}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[var(--brand-text-secondary)]">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <h3 className={`mt-3 font-extrabold leading-snug text-[var(--brand-charcoal)] ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
          <TrackedLink href={`/blog/${post.slug}`} eventName="blog_click" entityType="post" entitySlug={post.slug}>
            {post.title}
          </TrackedLink>
        </h3>

        <p className={`mt-3 flex-1 text-sm leading-7 text-[var(--brand-text-secondary)] ${featured ? "line-clamp-4" : "line-clamp-3"}`}>
          {post.excerpt}
        </p>

        <TrackedLink
          href={`/blog/${post.slug}`}
          eventName="blog_click"
          entityType="post"
          entitySlug={post.slug}
          aria-label={`Ler artigo: ${post.title}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-brick)] transition hover:text-[var(--brand-orange)]"
        >
          Ler artigo completo
          <ArrowUpRight className="h-4 w-4" />
        </TrackedLink>
      </div>
    </article>
  );
}
