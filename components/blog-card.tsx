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
    <article className="es-card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(123,44,40,0.12)] bg-white shadow-[0_14px_36px_-28px_rgba(26,26,26,0.16)]">
      <div className={`relative overflow-hidden ${featured ? "h-44 sm:h-48" : "h-40 sm:h-44"}`}>
        <BlogCoverImage
          slug={post.slug}
          title={post.title}
          coverImageUrl={post.coverImageUrl}
          coverImageAlt={post.coverImageAlt}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-[rgba(123,44,40,0.16)] bg-[var(--brand-beige)] px-2.5 py-1 font-bold uppercase tracking-wide text-[var(--brand-brick)]">
            {post.category.name}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[var(--brand-text-secondary)]">
            <CalendarDays className="h-3.5 w-3.5 text-[var(--brand-brick)]" />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <h3 className={`mt-3 font-extrabold leading-snug text-[var(--brand-charcoal)] ${featured ? "text-xl sm:text-2xl" : "text-lg"}`}>
          <TrackedLink href={`/blog/${post.slug}`} eventName="blog_click" entityType="post" entitySlug={post.slug}>
            {post.title}
          </TrackedLink>
        </h3>

        <p className={`mt-2 flex-1 text-sm leading-6 text-[var(--brand-text-secondary)] ${featured ? "line-clamp-3" : "line-clamp-2"}`}>
          {post.excerpt}
        </p>

        <TrackedLink
          href={`/blog/${post.slug}`}
          eventName="blog_click"
          entityType="post"
          entitySlug={post.slug}
          aria-label={`Ler artigo: ${post.title}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-brick)] transition hover:text-[#65231f]"
        >
          Ler artigo completo
          <ArrowUpRight className="h-4 w-4" />
        </TrackedLink>
      </div>
    </article>
  );
}
