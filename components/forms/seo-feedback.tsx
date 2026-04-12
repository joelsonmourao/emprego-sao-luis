"use client";

import { countWords, getSeoStatus } from "@/lib/rich-text";

function toneClasses(tone: "good" | "medium" | "bad") {
  if (tone === "good") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (tone === "medium") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

export function SeoFeedback({
  title,
  description,
  content,
  contentLabel = "Conteudo"
}: {
  title: string;
  description: string;
  content: string;
  contentLabel?: string;
}) {
  const titleStatus = getSeoStatus(title.trim().length, "title");
  const descriptionStatus = getSeoStatus(description.trim().length, "description");
  const words = countWords(content);

  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 lg:grid-cols-3">
      <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{contentLabel}</p>
        <p className="mt-3 text-3xl font-black text-slate-950">{words}</p>
        <p className="mt-2 text-sm text-slate-600">{words < 80 ? "Ainda esta curto. Vale desenvolver melhor." : "Boa base para o leitor entender o conteudo."}</p>
      </div>

      <div className={`rounded-[1.25rem] border p-4 ${toneClasses(titleStatus.tone)}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em]">SEO title</p>
        <p className="mt-3 text-3xl font-black">{title.trim().length}</p>
        <p className="mt-2 text-sm font-semibold">{titleStatus.label}</p>
        <p className="mt-1 text-sm">{titleStatus.message}</p>
      </div>

      <div className={`rounded-[1.25rem] border p-4 ${toneClasses(descriptionStatus.tone)}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em]">SEO description</p>
        <p className="mt-3 text-3xl font-black">{description.trim().length}</p>
        <p className="mt-2 text-sm font-semibold">{descriptionStatus.label}</p>
        <p className="mt-1 text-sm">{descriptionStatus.message}</p>
      </div>
    </div>
  );
}

