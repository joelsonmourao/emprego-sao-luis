import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { normalizeSlug } from "@/lib/admin/content";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: Context) {
  try {
    const session = await requireApiRole("EDITOR");
    const { id } = await context.params;
    const post = await prisma.blogPost.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ ok: false, error: "Post nao encontrado." }, { status: 404 });
    }

    const duplicated = await prisma.blogPost.create({
      data: {
        title: `${post.title} (copia)`,
        slug: normalizeSlug(`${post.slug}-copia-${Date.now()}`),
        excerpt: post.excerpt,
        contentHtml: post.contentHtml,
        coverImageUrl: post.coverImageUrl,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        isPublished: false,
        publishedAt: new Date(),
        categoryId: post.categoryId
      }
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.CREATE,
      entityType: "post",
      entityId: duplicated.id,
      entityLabel: duplicated.title,
      summary: "Post duplicado",
      after: { id: duplicated.id, slug: duplicated.slug, title: duplicated.title }
    });

    return NextResponse.json({ ok: true, postId: duplicated.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel duplicar o post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
