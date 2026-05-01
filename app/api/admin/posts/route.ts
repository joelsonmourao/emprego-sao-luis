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
export async function POST(request: Request) {
  try {
    const session = await requireApiRole("EDITOR");
    const payload = await request.json();
    const post = await upsertBlogPostFromForm(payload);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.CREATE,
      entityType: "post",
      entityId: post.id,
      entityLabel: post.title,
      summary: "Post criado",
      after: { id: post.id, slug: post.slug, title: post.title }
    });
    revalidatePublicSurfacesAfterBlogChange(post.slug);

    return NextResponse.json({ ok: true, postId: post.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar o post.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function GET() {
  await requireApiRole("EDITOR");
  const posts = await prisma.blogPost.findMany({
    include: { category: true },
    orderBy: [{ updatedAt: "desc" }]
  });

  return NextResponse.json({ ok: true, posts });
}
