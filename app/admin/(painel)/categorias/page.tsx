import Link from "next/link";

import { JOB_CATEGORIES } from "@/lib/job-categories";
import { prisma } from "@/lib/db";

export default async function AdminCategoriasPage() {
  const dbCategories = await prisma.jobCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--brand-charcoal)]">Categorias de vagas</h1>
        <p className="mt-2 text-sm text-[var(--brand-text-secondary)]">Categorias usadas nas listagens públicas e na importação de planilhas.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(dbCategories.length ? dbCategories.map((c) => ({ slug: c.slug, name: c.name, description: "" })) : JOB_CATEGORIES).map((category) => (
          <div key={category.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-[var(--brand-charcoal)]">{category.name}</h2>
            <p className="mt-1 text-xs text-[var(--brand-text-secondary)]">/{category.slug}</p>
            {"description" in category && category.description ? (
              <p className="mt-2 text-sm text-[var(--brand-text-secondary)]">{category.description}</p>
            ) : null}
            <Link href={`/vagas/categoria/${category.slug}`} className="mt-3 inline-block text-sm font-medium text-[var(--brand-brick)] hover:underline">
              Ver página pública
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
