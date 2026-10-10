import { asc, eq } from "drizzle-orm";
import { categories, cities, companies, createDatabase, states } from "@es/db";

export const EMPLOYMENT_TYPES = [
  "CLT",
  "Temporário",
  "Estágio",
  "Aprendiz",
  "Autônomo",
  "PJ",
  "Intermitente",
  "Outro"
] as const;

export const WORKPLACE_TYPES = [
  { value: "presencial", label: "Presencial" },
  { value: "hibrido", label: "Híbrido" },
  { value: "remoto", label: "Remoto" }
] as const;

export async function getJobFormOptions() {
  if (!process.env.DATABASE_URL) {
    return { companies: [], cities: [], states: [], categories: [], emptyReason: "Banco indisponível." as const };
  }
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [companyRows, cityRows, stateRows, categoryRows] = await Promise.all([
      connection.db
        .select({ id: companies.id, name: companies.name, cityId: companies.cityId })
        .from(companies)
        .orderBy(asc(companies.name)),
      connection.db
        .select({ id: cities.id, name: cities.name, stateId: cities.stateId })
        .from(cities)
        .where(eq(cities.active, true))
        .orderBy(asc(cities.name)),
      connection.db.select({ id: states.id, name: states.name, code: states.code }).from(states).orderBy(asc(states.name)),
      connection.db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(eq(categories.active, true))
        .orderBy(asc(categories.name))
    ]);
    return {
      companies: companyRows,
      cities: cityRows,
      states: stateRows,
      categories: categoryRows,
      emptyReason: null
    };
  } finally {
    await connection.close();
  }
}
