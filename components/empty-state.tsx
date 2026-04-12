import type { Route } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  href = "/vagas",
  actionLabel = "Ver vagas"
}: {
  title: string;
  description: string;
  href?: Route;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/90 p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
        <SearchX className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-6 flex justify-center">
        <Button asChild>
          <Link href={href}>{actionLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
