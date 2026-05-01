import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


import { upsertBlogPostFromForm } from "@/lib/admin/blog";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { revalidatePublicSurfacesAfterBlogChange } from "@/lib/public-revalidate";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await requireApiRole("EDITOR");
    const { id } = await context.params;
    const payload = await request.json();
    const post = await upsertBlogPostFromForm(payload, id);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.UPDATE,
      entityType: "post",
      entityId: post.id,
      entityLabel: post.title,
      summary: "Post atualizado",
      after: { id: post.id, slug: post.slug, title: post.title }
    });
    revalidatePublicSurfacesAfterBlogChange(post.slug);

    return NextResponse.json({ ok: true, postId: post.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel atualizar o post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await requireApiRole("ADMIN");
    const { id } = await context.params;
    const post = await prisma.blogPost.findUnique({ where: { id }, select: { id: true, title: true, slug: true } });
    await prisma.blogPost.delete({
      where: { id }
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.DELETE,
      entityType: "post",
      entityId: id,
      entityLabel: post?.title,
      summary: "Post excluido",
      before: post ?? { id }
    });
    revalidatePublicSurfacesAfterBlogChange(post?.slug);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel excluir o post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
