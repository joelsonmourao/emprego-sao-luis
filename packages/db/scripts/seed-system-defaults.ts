import { createDatabase, settings } from "../src/index.js";

export const structuralDefaults = {
  key: "job_structural_options",
  value: {
    workplaceTypes: [
      { value: "presencial", label: "Presencial" },
      { value: "remoto", label: "Remoto" },
      { value: "hibrido", label: "Híbrido" }
    ],
    employmentTypes: ["CLT", "Temporário", "Estágio", "Aprendiz", "Autônomo", "PJ", "Intermitente", "Outro"],
    publicationStatuses: ["DRAFT", "PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "PAUSED", "ARCHIVED"]
  }
} as const;

export async function seedSystemDefaults() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [existing] = await connection.db.select({ key: settings.key }).from(settings).where((await import("drizzle-orm")).eq(settings.key, structuralDefaults.key)).limit(1);
    await connection.db.insert(settings).values({ key: structuralDefaults.key, value: structuralDefaults.value, public: true }).onConflictDoUpdate({
      target: settings.key,
      set: { value: structuralDefaults.value, public: true, updatedAt: new Date() }
    });
    const result = { created: existing ? 0 : 1, updated: existing ? 1 : 0 };
    process.stdout.write(`Seed de padrões estruturais concluído: ${JSON.stringify(result)}\n`);
    return result;
  } finally { await connection.close(); }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}` || process.argv[1]?.includes("seed-system-defaults")) {
  seedSystemDefaults().catch((error) => { console.error(error instanceof Error ? error.message : "Falha no seed de padrões estruturais."); process.exit(1); });
}
