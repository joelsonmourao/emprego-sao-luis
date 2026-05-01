import Link from "next/link";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { AdminPostsTable } from "@/components/admin/admin-posts-table";
import { PaginationNav } from "@/components/pagination-nav";

type AdminBlogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const raw = await searchParams;
  const q = typeof raw.q === "string" ? raw.q.trim() : "";
  const status = typeof raw.status === "string" ? raw.status : "all";
  const page = Math.max(1, Number(typeof raw.page === "string" ? raw.page : "1") || 1);

  const where: Prisma.BlogPostWhereInput = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } }
    ];
  }

  if (status === "published") {
    where.isPublished = true;
  } else if (status === "draft") {
    where.isPublished = false;
  }

  const posts = await prisma.blogPost.findMany({
    where,
    include: { category: true },
    orderBy: [{ updatedAt: "desc" }],
    take: 12,
    skip: (page - 1) * 12
  });

  const total = await prisma.blogPost.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / 12));

  if (!posts.length) {
    return (
      <div className="grid gap-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/blog/novo">Novo post</Link>
          </Button>
        </div>
        <EmptyState
          title="Nenhum post cadastrado ainda"
          description="Publique o primeiro conteudo editorial para fortalecer o cluster organico do portal."
          href={"/admin/blog/novo" as never}
          actionLabel="Criar primeiro post"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">Gerencie artigos, rascunhos e conteudo de apoio para SEO e carreira.</p>
        <Button asChild>
          <Link href="/admin/blog/novo">Novo post</Link>
        </Button>
      </div>

      <form className="flex flex-wrap gap-3 rounded-[2rem] border border-slate-200 bg-white/90 p-4">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por titulo, slug ou resumo"
          className="h-12 min-w-[280px] rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        >
          <option value="all">Todos</option>
          <option value="published">Publicados</option>
          <option value="draft">Rascunhos</option>
        </select>
        <Button type="submit">Filtrar</Button>
      </form>

      <AdminPostsTable
        posts={posts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          categoryName: post.category.name,
          isPublished: post.isPublished,
          publishedAt: (() => {
            const rawIso = post.publishedAt instanceof Date ? post.publishedAt.toISOString() : String(post.publishedAt);
            const asDate = post.publishedAt instanceof Date ? post.publishedAt : new Date(post.publishedAt as unknown as string);
            const isValid = !Number.isNaN(asDate.getTime());

            return isValid ? new Intl.DateTimeFormat("pt-BR").format(asDate) : "Data invalida";
          })()
        }))}
      />

      <PaginationNav
        page={page}
        totalPages={totalPages}
        buildHref={(pageNumber) => {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          if (status !== "all") params.set("status", status);
          if (pageNumber > 1) params.set("page", String(pageNumber));
          const query = params.toString();
          return query ? `/admin/blog?${query}` : "/admin/blog";
        }}
      />
    </div>
  );
}
