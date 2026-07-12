import { asc } from "drizzle-orm";
import { categories, cities, companies, createDatabase, states } from "@es/db";

export async function getJobFormOptions() {
  if (!process.env.DATABASE_URL) return { companies: [], cities: [], states: [], categories: [] };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [companyRows, cityRows, stateRows, categoryRows] = await Promise.all([
      connection.db.select({ id: companies.id, name: companies.name }).from(companies).orderBy(asc(companies.name)),
      connection.db.select({ id: cities.id, name: cities.name }).from(cities).orderBy(asc(cities.name)),
      connection.db.select({ id: states.id, name: states.name, code: states.code }).from(states).orderBy(asc(states.name)),
      connection.db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name))
    ]);
    return { companies: companyRows, cities: cityRows, states: stateRows, categories: categoryRows };
  } finally { await connection.close(); }
}
