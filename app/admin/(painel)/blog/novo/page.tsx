import { prisma } from "@/lib/db";
import { BlogAdminForm } from "@/components/admin/blog-admin-form";

export default async function NewAdminBlogPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: [{ name: "asc" }]
  });

  return <BlogAdminForm mode="create" categories={categories.map((item) => item.slug)} />;
}

