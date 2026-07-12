import { commercialPlans, createDatabase } from "@es/db";
import { eq } from "drizzle-orm";

const SEED_PLANS = [
  {
    slug: "vaga-individual",
    name: "Vaga individual",
    shortDescription: "Publicação de uma vaga no portal.",
    description: "Plano estrutural para uma vaga no site. Configure preço e regras antes de ativar.",
    jobCredits: 1,
    durationDays: 30,
    sortOrder: 0
  },
  {
    slug: "vaga-destacada",
    name: "Vaga destacada",
    shortDescription: "Vaga com destaque no portal.",
    description: "Inclui período de destaque configurável. Defina valores no painel.",
    jobCredits: 1,
    durationDays: 30,
    highlightDays: 7,
    sortOrder: 1
  },
  {
    slug: "pacote-vagas",
    name: "Pacote de vagas",
    shortDescription: "Múltiplos créditos para várias vagas.",
    description: "Pacote com quantidade de vagas configurável pelo administrador.",
    jobCredits: 5,
    durationDays: 60,
    sortOrder: 2
  },
  {
    slug: "site-instagram",
    name: "Site + Instagram",
    shortDescription: "Portal e divulgação no @empregosaoluis.",
    description: "Combina publicação no site com stories/feed conforme configuração.",
    jobCredits: 1,
    durationDays: 30,
    publishStories: true,
    publishFeed: true,
    sortOrder: 3
  }
] as const;

export async function seedCommercialPlans() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    let created = 0;
    for (const plan of SEED_PLANS) {
      const [existing] = await connection.db.select({ id: commercialPlans.id }).from(commercialPlans).where(eq(commercialPlans.slug, plan.slug)).limit(1);
      if (existing) continue;
      await connection.db.insert(commercialPlans).values({
        slug: plan.slug,
        name: plan.name,
        shortDescription: plan.shortDescription,
        description: plan.description,
        price: "0",
        jobCredits: plan.jobCredits,
        durationDays: plan.durationDays,
        highlightDays: "highlightDays" in plan ? plan.highlightDays : 0,
        publishStories: "publishStories" in plan ? plan.publishStories : false,
        publishFeed: "publishFeed" in plan ? plan.publishFeed : false,
        active: false,
        setupRequired: true,
        archived: false,
        recommended: false,
        sortOrder: plan.sortOrder,
        benefits: [],
        limitations: ["Configuração de preço e regras necessária no painel administrativo."]
      });
      created++;
    }
    process.stdout.write(`Planos comerciais: ${created} criado(s), demais já existiam.\n`);
  } finally {
    await connection.close();
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}` || process.argv[1]?.includes("seed-commercial-plans")) {
  seedCommercialPlans().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
