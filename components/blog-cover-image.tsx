import Image from "next/image";

import { BlogCoverGraphic } from "@/components/blog-cover-graphic";
import { BLOG_COVER_HEIGHT, BLOG_COVER_WIDTH, getBlogCoverAlt } from "@/lib/blog-images";

type BlogCoverImageProps = {
  slug: string;
  title: string;
  category?: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  priority?: boolean;
  className?: string;
};

function isLocalGeneratedCover(src: string) {
  return src.startsWith("/images/blog/") && src.endsWith(".svg");
}

function isRemoteCover(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function BlogCoverImage({
  slug,
  title,
  category,
  coverImageUrl,
  coverImageAlt,
  priority = false,
  className = ""
}: BlogCoverImageProps) {
  const src = coverImageUrl?.trim() || "";
  const alt = coverImageAlt || getBlogCoverAlt(title);

  if (!src || isLocalGeneratedCover(src)) {
    return <BlogCoverGraphic slug={slug} title={title} category={category} className={className} />;
  }

  if (isRemoteCover(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={BLOG_COVER_WIDTH}
        height={BLOG_COVER_HEIGHT}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={`h-full min-h-full w-full object-cover ${className}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={BLOG_COVER_WIDTH}
      height={BLOG_COVER_HEIGHT}
      unoptimized={src.endsWith(".svg")}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className={`h-full min-h-full w-full object-cover ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
