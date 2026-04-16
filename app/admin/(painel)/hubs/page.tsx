import Link from "next/link";

import { prisma } from "@/lib/db";
import { getCompanyHubs } from "@/lib/repositories/jobs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HubCard = {
  type: "state" | "city" | "company";
  slug: string;
  label: string;
  subtitle: string;
};

const typeLabels = {
  state: "Perfil SEO do estado",
  city: "Perfil SEO da cidade",
  company: "Perfil SEO da empresa"
} as const;

export default async function AdminHubsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const q = typeof raw.q === "string" ? raw.q.trim().toLowerCase() : "";

  const [states, cities, companies, profiles] = await Promise.all([
    prisma.state.findMany({ orderBy: { name: "asc" } }),
    prisma.city.findMany({ include: { state: true }, orderBy: [{ name: "asc" }] }),
    getCompanyHubs(),
    prisma.hubProfile.findMany({ select: { type: true, slug: true } })
  ]);

  const profileSet = new Set(profiles.map((item) => `${item.type}:${item.slug}`));
  const cards: HubCard[] = [
    ...states.map((item) => ({
      type: "state" as const,
      slug: item.slug,
      label: item.name,
      subtitle: `${typeLabels.state} - ${profileSet.has(`STATE:${item.slug}`) ? "Personalizado" : "Automatico"}`
    })),
    ...cities.map((item) => {
      const slugKey = `${item.state.slug}__${item.slug}`;
      return {
        type: "city" as const,
        slug: slugKey,
        label: `${item.name}, ${item.state.code}`,
        subtitle: `${typeLabels.city} - ${profileSet.has(`CITY:${slugKey}`) ? "Personalizado" : "Automatico"}`
      };
    }),
    ...companies.map((item) => ({
      type: "company" as const,
      slug: item.slug,
      label: item.name,
      subtitle: `${typeLabels.company} - ${profileSet.has(`COMPANY:${item.slug}`) ? "Personalizado" : "Automatico"}`
    }))
  ].filter((item) => !q || `${item.label} ${item.subtitle}`.toLowerCase().includes(q));

  return (
    <div className="grid gap-6">
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Perfis de SEO por estado, cidade e empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex flex-wrap gap-3">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Buscar estado, cidade ou empresa"
              className="h-12 min-w-[280px] rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
            <Button type="submit">Buscar</Button>
          </form>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((item) => (
              <Link key={`${item.type}-${item.slug}`} href={`/admin/hubs/${item.type}/${item.slug}`} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-sky-200">
                <p className="text-lg font-black text-slate-950">{item.label}</p>
                <p className="mt-2 text-sm text-slate-600">{item.subtitle}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
