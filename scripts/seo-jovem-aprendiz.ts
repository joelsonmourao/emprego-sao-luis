/**
 * Lista hubs compactos Jovem Aprendiz (cidade–UF) com contagem e status HTTP opcional.
 * Uso: pnpm seo:jovem-aprendiz
 *      SITE_URL=https://slzcontent.com.br pnpm seo:jovem-aprendiz
 */
import { prisma } from "@/lib/db";
import { jovemAprendizHubOrKeywordsWhere } from "@/lib/jobs/jovem-aprendiz-hub-where";
import { getApprenticeCityUfSitemapRows } from "@/lib/repositories/jobs";
import { buildJovemAprendizCityUfPath } from "@/lib/seo/jovem-aprendiz-city-uf-slug";

const SPOT = [
  { citySlug: "recife", stateCode: "PE", label: "Recife" },
  { citySlug: "sao-paulo", stateCode: "SP", label: "São Paulo" },
  { citySlug: "teresina", stateCode: "PI", label: "Teresina" },
  { citySlug: "fortaleza", stateCode: "CE", label: "Fortaleza" },
  { citySlug: "sao-luis", stateCode: "MA", label: "São Luís" }
] as const;

async function main() {
  const base = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000").replace(/\/?$/, "");
  const rows = await getApprenticeCityUfSitemapRows();
  const sorted = [...rows].sort((a, b) => a.stateCode.localeCompare(b.stateCode) || a.citySlug.localeCompare(b.citySlug));

  console.log("Cidade | UF | Qtd vagas (hub) | URL | HTTP");
  console.log("-".repeat(100));

  for (const row of sorted) {
    const city = await prisma.city.findFirst({
      where: { slug: row.citySlug, state: { code: row.stateCode } },
      select: { name: true }
    });
    const cityName = city?.name ?? row.citySlug;
    const count = await prisma.job.count({
      where: {
        AND: [
          { isActive: true, city: { slug: row.citySlug }, state: { code: row.stateCode } },
          jovemAprendizHubOrKeywordsWhere()
        ]
      }
    });
    const path = buildJovemAprendizCityUfPath(row.citySlug, row.stateCode);
    let http = "—";
    try {
      const res = await fetch(new URL(path, `${base}/`).toString(), { redirect: "manual" });
      http = String(res.status);
    } catch {
      http = "erro";
    }
    console.log(`${cityName} | ${row.stateCode} | ${count} | ${path} | ${http}`);
  }

  console.log("\n--- Verificação manual (cidades pedidas) ---\n");
  for (const s of SPOT) {
    const match = rows.find((r) => r.citySlug === s.citySlug && r.stateCode === s.stateCode);
    if (match) {
      console.log(`${s.label}: no sitemap (${buildJovemAprendizCityUfPath(s.citySlug, s.stateCode)})`);
    } else {
      const count = await prisma.job.count({
        where: {
          AND: [
            { isActive: true, city: { slug: s.citySlug }, state: { code: s.stateCode } },
            jovemAprendizHubOrKeywordsWhere()
          ]
        }
      });
      console.log(`${s.label}: fora do hub (${count} vaga(s) com critério expandido) → 404 esperado se 0 no hub`);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
