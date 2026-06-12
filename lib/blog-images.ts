export const BLOG_COVER_WIDTH = 800;
export const BLOG_COVER_HEIGHT = 450;

export function getBlogCoverPath(slug: string) {
  return `/images/blog/${slug}.svg`;
}

export function getBlogCoverAlt(title: string) {
  return `Ilustração do artigo: ${title}`;
}

export type BlogPostWithCover = {
  slug: string;
  title: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
};

export function withBlogCoverImages<T extends BlogPostWithCover>(posts: T[]) {
  return posts.map((post) => ({
    ...post,
    coverImageUrl: post.coverImageUrl ?? getBlogCoverPath(post.slug),
    coverImageAlt: post.coverImageAlt ?? getBlogCoverAlt(post.title)
  }));
}
