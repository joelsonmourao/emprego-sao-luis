"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
  isPublished: boolean;
  publishedAt: string;
};

export function AdminPostsTable({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function deletePost(postId: string) {
    const confirmed = window.confirm("Deseja excluir este post?");
    if (!confirmed) return;

    setBusyId(postId);
    await fetch(`/api/admin/posts/${postId}`, {
      method: "DELETE"
    });
    setBusyId(null);
    router.refresh();
  }

  async function duplicatePost(postId: string) {
    setBusyId(postId);
    await fetch(`/api/admin/posts/${postId}/duplicate`, {
      method: "POST"
    });
    setBusyId(null);
    router.refresh();
  }

  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Post</th>
                <th className="px-6 py-4 font-semibold">Categoria</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Publicacao</th>
                <th className="px-6 py-4 font-semibold text-right">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-slate-100">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-950">{post.title}</p>
                      <p className="text-xs text-slate-500">{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{post.categoryName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        post.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {post.isPublished ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{post.publishedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/blog/${post.id}/editar`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === post.id} onClick={() => duplicatePost(post.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === post.id} onClick={() => deletePost(post.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
