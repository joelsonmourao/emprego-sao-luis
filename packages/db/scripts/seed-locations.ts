import { eq } from "drizzle-orm";
import { categories, cities, createDatabase, states } from "../src/index.js";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const metroCities = [
  { name: "São Luís", ibgeCode: "2111300", metropolitanRegion: true, featured: true },
  { name: "Paço do Lumiar", ibgeCode: "2107506", metropolitanRegion: true },
  { name: "São José de Ribamar", ibgeCode: "2111201", metropolitanRegion: true },
  { name: "Raposa", ibgeCode: "2109452", metropolitanRegion: true },
  { name: "Santa Rita", ibgeCode: "2110005", metropolitanRegion: false },
  { name: "Imperatriz", ibgeCode: "2105302", metropolitanRegion: false, featured: true },
  { name: "Caxias", ibgeCode: "2103000", metropolitanRegion: false },
  { name: "Timon", ibgeCode: "2112209", metropolitanRegion: false }
];

const baseCategories = [
  "Administrativo",
  "Comercial e Vendas",
  "Tecnologia",
  "Saúde",
  "Educação",
  "Indústria e Produção",
  "Logística",
  "Serviços Gerais",
  "Construção Civil",
  "Alimentação e Hotelaria"
];

export async function seedLocations() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");

  const connection = createDatabase(databaseUrl);
  try {
    let [state] = await connection.db.select().from(states).where(eq(states.code, "MA")).limit(1);
    if (!state) {
      [state] = await connection.db
        .insert(states)
        .values({ code: "MA", name: "Maranhão", slug: "maranhao" })
        .returning();
    }
    if (!state) throw new Error("Estado MA não disponível.");
    await seedCities(connection, state.id);

    for (const name of baseCategories) {
      const slug = slugify(name);
      await connection.db
        .insert(categories)
        .values({ name, slug, active: true })
        .onConflictDoNothing();
    }

    process.stdout.write("Seed de localidades e categorias concluído.\n");
  } finally {
    await connection.close();
  }
}

async function seedCities(connection: ReturnType<typeof createDatabase>, stateId: string) {
  for (const city of metroCities) {
    const slug = slugify(city.name);
    await connection.db
      .insert(cities)
      .values({
        stateId,
        name: city.name,
        normalizedName: slugify(city.name),
        slug,
        ibgeCode: city.ibgeCode,
        metropolitanRegion: city.metropolitanRegion,
        featured: city.featured ?? false,
        active: true
      })
      .onConflictDoNothing();
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}` || process.argv[1]?.includes("seed-locations")) {
  seedLocations().catch((error) => {
    console.error(error instanceof Error ? error.message : "Falha ao executar seed de localidades.");
    process.exit(1);
  });
}
