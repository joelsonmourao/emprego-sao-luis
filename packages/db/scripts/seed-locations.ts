import { eq } from "drizzle-orm";
import { cities, createDatabase, states } from "../src/index.js";

const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const brazilianStates = [
  ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"], ["BA", "Bahia"],
  ["CE", "Ceará"], ["DF", "Distrito Federal"], ["ES", "Espírito Santo"], ["GO", "Goiás"],
  ["MA", "Maranhão"], ["MT", "Mato Grosso"], ["MS", "Mato Grosso do Sul"], ["MG", "Minas Gerais"],
  ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"], ["PE", "Pernambuco"], ["PI", "Piauí"],
  ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"], ["RS", "Rio Grande do Sul"], ["RO", "Rondônia"],
  ["RR", "Roraima"], ["SC", "Santa Catarina"], ["SP", "São Paulo"], ["SE", "Sergipe"], ["TO", "Tocantins"]
] as const;

export const maranhaoCities = [
  { name: "São Luís", ibgeCode: "2111300", metropolitanRegion: true, featured: true },
  { name: "Paço do Lumiar", ibgeCode: "2107506", metropolitanRegion: true, featured: false },
  { name: "São José de Ribamar", ibgeCode: "2111201", metropolitanRegion: true, featured: false },
  { name: "Raposa", ibgeCode: "2109452", metropolitanRegion: true, featured: false },
  { name: "Santa Rita", ibgeCode: "2110005", metropolitanRegion: false, featured: false },
  { name: "Imperatriz", ibgeCode: "2105302", metropolitanRegion: false, featured: true },
  { name: "Caxias", ibgeCode: "2103000", metropolitanRegion: false, featured: false },
  { name: "Timon", ibgeCode: "2112209", metropolitanRegion: false, featured: false }
] as const;

export async function seedLocations() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const existingStates = new Set((await connection.db.select({ code: states.code }).from(states)).map((item) => item.code));
    let statesCreated = 0;
    let statesUpdated = 0;
    for (const [code, name] of brazilianStates) {
      await connection.db.insert(states).values({ code, name, slug: slugify(name) }).onConflictDoUpdate({
        target: states.code,
        set: { name, slug: slugify(name), updatedAt: new Date() }
      });
      if (existingStates.has(code)) statesUpdated += 1; else statesCreated += 1;
    }

    const [maranhao] = await connection.db.select().from(states).where(eq(states.code, "MA")).limit(1);
    if (!maranhao) throw new Error("Estado MA não disponível após o seed.");
    const existingCities = new Set((await connection.db.select({ slug: cities.slug }).from(cities).where(eq(cities.stateId, maranhao.id))).map((item) => item.slug));
    let citiesCreated = 0;
    let citiesUpdated = 0;
    for (const city of maranhaoCities) {
      const slug = slugify(city.name);
      await connection.db.insert(cities).values({
        stateId: maranhao.id,
        name: city.name,
        normalizedName: slugify(city.name),
        slug,
        ibgeCode: city.ibgeCode,
        metropolitanRegion: city.metropolitanRegion,
        featured: city.featured,
        active: true
      }).onConflictDoUpdate({
        target: [cities.stateId, cities.slug],
        set: {
          name: city.name,
          normalizedName: slugify(city.name),
          ibgeCode: city.ibgeCode,
          metropolitanRegion: city.metropolitanRegion,
          featured: city.featured,
          active: true,
          updatedAt: new Date()
        }
      });
      if (existingCities.has(slug)) citiesUpdated += 1; else citiesCreated += 1;
    }
    const result = { statesCreated, statesUpdated, citiesCreated, citiesUpdated };
    process.stdout.write(`Seed de localidades concluído: ${JSON.stringify(result)}\n`);
    return result;
  } finally {
    await connection.close();
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}` || process.argv[1]?.includes("seed-locations")) {
  seedLocations().catch((error) => { console.error(error instanceof Error ? error.message : "Falha no seed de localidades."); process.exit(1); });
}
