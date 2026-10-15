import { categories, createDatabase } from "../src/index.js";

const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const baseCategories = [
  "Administrativo", "Comercial e Vendas", "Tecnologia", "Saúde", "Educação",
  "Indústria e Produção", "Logística", "Serviços Gerais", "Construção Civil", "Alimentação e Hotelaria"
] as const;

export async function seedCategories() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const existing = new Set((await connection.db.select({ slug: categories.slug }).from(categories)).map((item) => item.slug));
    let created = 0;
    let updated = 0;
    for (const [sortOrder, name] of baseCategories.entries()) {
      const slug = slugify(name);
      await connection.db.insert(categories).values({ name, slug, active: true, sortOrder }).onConflictDoUpdate({
        target: categories.slug,
        set: { name, active: true, sortOrder, updatedAt: new Date() }
      });
      if (existing.has(slug)) updated += 1; else created += 1;
    }
    const result = { created, updated };
    process.stdout.write(`Seed de categorias concluído: ${JSON.stringify(result)}\n`);
    return result;
  } finally { await connection.close(); }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}` || process.argv[1]?.includes("seed-categories")) {
  seedCategories().catch((error) => { console.error(error instanceof Error ? error.message : "Falha no seed de categorias."); process.exit(1); });
}
