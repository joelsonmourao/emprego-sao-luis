import type { Route } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { JOB_CATEGORIES } from "@/lib/job-categories";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Categorias de Vagas - Emprego São Luís",
    description: "Navegue por categorias de vagas de emprego em São Luís e no Maranhão.",
    pathname: "/categorias"
  });
}

export default function CategoriasPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Categorias", path: "/categorias" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categorias" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 sm:px-8">
        <SectionHeading
          eyebrow="Categorias"
          title="Vagas por área de atuação"
          description="Escolha uma categoria para ver oportunidades em São Luís, Região Metropolitana e cidades do Maranhão."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {JOB_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/vagas/categoria/${category.slug}` as Route}
            className="brand-chip rounded-[1.5rem] p-6 transition hover:-translate-y-0.5"
          >
            <h2 className="text-lg font-black text-[var(--brand-charcoal)]">{category.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)]">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
