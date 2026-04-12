export type BlogCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  categoryName: string;
  categorySlug: string;
};

export type BlogDetail = BlogCard & {
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
};
