import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { BlogAdminForm } from "@/components/admin/blog-admin-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAdminBlogPage({ params }: Props) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id },
      include: { category: true }
    }),
    prisma.blogCategory.findMany({
      orderBy: [{ name: "asc" }]
    })
  ]);

  if (!post) {
    notFound();
  }

  return (
    <BlogAdminForm
      mode="edit"
      postId={post.id}
      categories={categories.map((item) => item.slug)}
      initialValues={{
        title: post.title,
        slug: post.slug,
        categorySlug: post.category.slug,
        excerpt: post.excerpt,
        contentHtml: post.contentHtml,
        coverImageUrl: post.coverImageUrl ?? "",
        seoTitle: post.seoTitle ?? "",
        seoDescription: post.seoDescription ?? "",
        isPublished: post.isPublished,
        publishedAt: post.publishedAt.toISOString().slice(0, 10)
      }}
    />
  );
}

