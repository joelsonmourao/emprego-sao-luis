/**
 * Auditoria de cobertura de geo (lat/lon) nas vagas do banco vs base local.
 *
 * Uso: pnpm exec tsx scripts/audit-job-geo.ts
 */

import { PrismaClient } from "@prisma/client";

import { getGeoCoordinatesByCityState } from "@/lib/geo/municipios-coordenadas";
import { getReferencePostalCodeForCity } from "@/lib/seo/br-reference-postal";

const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      city: { select: { name: true, slug: true } },
      state: { select: { code: true, name: true } }
    }
  });

  const total = jobs.length;
  let withCityUf = 0;
  let withPostal = 0;
  let withGeo = 0;
  const missingGeoKeys = new Map<string, number>();

  for (const job of jobs) {
    const city = job.city?.name?.trim();
    const uf = job.state?.code?.trim();
    if (!city || !uf) continue;
    withCityUf += 1;

    const postal = await getReferencePostalCodeForCity({ stateCode: uf, citySlug: job.city.slug });
    if (postal?.trim()) withPostal += 1;

    const coords = getGeoCoordinatesByCityState(city, uf);
    if (coords) {
      withGeo += 1;
    } else {
      const k = `${city}/${uf}`;
      missingGeoKeys.set(k, (missingGeoKeys.get(k) ?? 0) + 1);
    }
  }

  const semGeo = withCityUf - withGeo;
  const pct = withCityUf ? ((withGeo / withCityUf) * 100).toFixed(1) : "0.0";

  console.log(`Total de vagas analisadas: ${total}`);
  console.log(`Com cidade e UF: ${withCityUf}`);
  console.log(`Com CEP (referência): ${withPostal}`);
  console.log(`Com geo: ${withGeo}`);
  console.log(`Sem geo: ${semGeo}`);
  console.log(`Cobertura geo: ${pct}%`);
  console.log("");
  console.log("Cidades/UF sem coordenadas na base (agregado):");
  const sorted = [...missingGeoKeys.entries()].sort((a, b) => b[1] - a[1]);
  for (const [k, c] of sorted.slice(0, 80)) {
    console.log(`- ${k} (${c} vaga(s))`);
  }
  if (sorted.length > 80) {
    console.log(`... e mais ${sorted.length - 80} combinações distintas`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
