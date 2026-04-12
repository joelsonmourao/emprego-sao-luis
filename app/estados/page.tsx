import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getStates } from "@/lib/repositories/geo";

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Estados com vagas de Jovem Aprendiz",
    description: "Veja os estados com vagas de Jovem Aprendiz e escolha a regiao onde voce quer procurar oportunidades.",
    pathname: "/estados"
  });
}

export default async function StatesPage() {
  const states = await getStates();
  type StateItem = (typeof states)[number];

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Estados", path: "/estados" }])} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Estados" }]} />
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading
          eyebrow="Por estado"
          title="Estados monitorados"
          description="Escolha um estado para ver as cidades com vagas e encontrar oportunidades mais perto de voce."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {states.map((state: StateItem) => (
          <Link
            key={state.id}
            href={`/estados/${state.slug}`}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
          >
            <h2 className="text-xl font-semibold text-slate-950">{state.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{state._count.jobs} vaga(s) ativas</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
