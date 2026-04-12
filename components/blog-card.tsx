import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type BlogCardProps = {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: Date;
    category: { name: string };
  };
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group h-full overflow-hidden rounded-[2rem] border-slate-200 bg-white/95 shadow-[0_25px_90px_-50px_rgba(34,73,245,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_100px_-45px_rgba(255,107,87,0.28)]">
      <CardHeader className="relative pb-5">
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(135deg,rgba(255,107,87,0.12)_0%,rgba(34,73,245,0.08)_55%,rgba(255,224,103,0.12)_100%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-coral)]">
            {post.category.name}
          </span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--brand-cobalt)] shadow-sm ring-1 ring-slate-200">
            <Sparkles className="h-4 w-4" />
          </span>
        </div>
        <CardTitle className="relative text-[1.7rem] leading-tight">
          <TrackedLink href={`/blog/${post.slug}`} eventName="blog_click" entityType="post" entitySlug={post.slug}>
            {post.title}
          </TrackedLink>
        </CardTitle>
        <CardDescription className="relative inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[var(--brand-cobalt)]" />
          Publicado em {formatDate(post.publishedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="line-clamp-4 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        <Button asChild variant="outline" className="gap-2 rounded-2xl border-[color:rgba(34,73,245,0.2)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(243,233,255,0.58))] text-[var(--brand-cobalt)] hover:bg-[var(--brand-mist)]">
          <TrackedLink href={`/blog/${post.slug}`} eventName="blog_click" entityType="post" entitySlug={post.slug}>
            Ler no blog
            <ArrowUpRight className="h-4 w-4" />
          </TrackedLink>
        </Button>
      </CardContent>
    </Card>
  );
}
