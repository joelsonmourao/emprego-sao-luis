import Link from "next/link";
import { MapPinned } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getCities } from "@/lib/repositories/geo";

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Cidades com vagas de Jovem Aprendiz",
    description: "Escolha a cidade para ver vagas de Jovem Aprendiz mais perto de voce.",
    pathname: "/cidades"
  });
}

export default async function CitiesPage() {
  const cities = await getCities();

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Cidades", path: "/cidades" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cidades" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(34,73,245,0.45)] sm:px-8">
        <SectionHeading
          eyebrow="Cidades"
          title="Cidades com vagas abertas"
          description="Escolha a cidade para ver as vagas que estao mais perto de voce."
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cities.map((city) => (
          <Link
            key={city.id}
            href={`/vagas/estado/${city.state.slug}/${city.slug}`}
            className="brand-chip rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1"
          >
            <MapPinned className="h-7 w-7 text-[var(--brand-cobalt)]" />
            <h2 className="mt-4 text-2xl font-black text-slate-950">
              {city.name}, {city.state.code}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{city._count.jobs} vaga(s) ativas mapeadas nesta localidade.</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
