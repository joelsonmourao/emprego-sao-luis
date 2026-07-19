#!/usr/bin/env node
/**
 * Fixtures sintéticos para staging.
 * Padrão: dry-run. Grave apenas com --write e DATABASE_URL de staging.
 *
 * node scripts/seed-staging-fixtures.mjs
 * node scripts/seed-staging-fixtures.mjs --write
 */
import { createHash, randomUUID } from "node:crypto";
import postgres from "postgres";

const write = process.argv.includes("--write");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL é obrigatória.");
  process.exit(1);
}
if (/empregossaoluis\.com\.br|production/i.test(databaseUrl) && !process.env.ALLOW_STAGING_SEED_ON_THIS_URL) {
  console.error("Recusa: DATABASE_URL parece de produção. Use banco de staging.");
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });
const mark = `STAGING-${randomUUID().slice(0, 8)}`;

const plan = {
  dryRun: !write,
  marker: mark,
  jobs: [
    "url-only",
    "whatsapp-only",
    "email-only",
    "url+whatsapp",
    "url+email",
    "whatsapp+email",
    "all-channels",
    "expired",
    "pending-review",
    "no-channel-blocked"
  ],
  note: "Telefones/e-mails são fictícios (+559890000XXXX / staging@example.invalid)."
};

console.log(JSON.stringify({ ok: true, ...plan }, null, 2));

if (!write) {
  console.log("Dry-run concluído. Passe --write para gravar no banco de staging.");
  await sql.end({ timeout: 5 });
  process.exit(0);
}

try {
  const [state] = await sql`select id from es_states where code = 'MA' limit 1`;
  const [city] = await sql`select id, name from es_cities where state_id = ${state.id} order by name asc limit 1`;
  if (!state || !city) throw new Error("Seed de localidades ausente.");

  const [companyActive] = await sql`
    insert into es_companies (name, slug, active)
    values (${`${mark} Empresa Ativa`}, ${`${mark.toLowerCase()}-ativa`}, true)
    returning id
  `;
  const [companyIdle] = await sql`
    insert into es_companies (name, slug, active)
    values (${`${mark} Empresa Sem Vaga`}, ${`${mark.toLowerCase()}-idle`}, true)
    returning id
  `;

  const cases = [
    { slug: `${mark.toLowerCase()}-url`, url: "https://example.invalid/vaga", email: null, wa: null, status: "PUBLISHED" },
    { slug: `${mark.toLowerCase()}-wa`, url: null, email: null, wa: "5598900001001", status: "PUBLISHED" },
    { slug: `${mark.toLowerCase()}-mail`, url: null, email: "staging-candidato@example.invalid", wa: null, status: "PUBLISHED" },
    { slug: `${mark.toLowerCase()}-url-wa`, url: "https://example.invalid/vaga", email: null, wa: "5598900001002", status: "PUBLISHED" },
    { slug: `${mark.toLowerCase()}-url-mail`, url: "https://example.invalid/vaga", email: "staging-rh@example.invalid", wa: null, status: "PUBLISHED" },
    { slug: `${mark.toLowerCase()}-wa-mail`, url: null, email: "staging-rh@example.invalid", wa: "5598900001003", status: "PUBLISHED" },
    { slug: `${mark.toLowerCase()}-all`, url: "https://example.invalid/vaga", email: "staging-rh@example.invalid", wa: "5598900001004", status: "PUBLISHED" },
    { slug: `${mark.toLowerCase()}-expired`, url: "https://example.invalid/vaga", email: null, wa: null, status: "PUBLISHED", expired: true },
    { slug: `${mark.toLowerCase()}-review`, url: "https://example.invalid/vaga", email: null, wa: null, status: "PENDING_REVIEW" },
    { slug: `${mark.toLowerCase()}-none`, url: null, email: null, wa: null, status: "DRAFT" }
  ];

  for (const item of cases) {
    const code = `ES-${String(Math.floor(Math.random() * 900000) + 100000)}`;
    const hash = createHash("sha256").update(item.slug).digest("hex");
    const expires = item.expired ? sql`now() - interval '1 day'` : sql`now() + interval '14 days'`;
    const published = item.status === "PUBLISHED" ? sql`now()` : sql`null`;
    await sql`
      insert into es_jobs (
        public_code, slug, original_title, normalized_title, company_id, city_id, state_id,
        employment_type, workplace_type, summary, description, description_html,
        application_url, application_email, application_whatsapp, application_whatsapp_valid, application_email_valid,
        source_name, origin_type, duplicate_hash, verification_status, publication_status,
        published_at, expires_at, application_type
      ) values (
        ${code}, ${item.slug}, ${`Analista Staging ${mark}`}, ${`Analista Staging ${mark}`},
        ${companyActive.id}, ${city.id}, ${state.id},
        ${"CLT"}, ${"presencial"},
        ${"Resumo sintético de staging para homologação segura."},
        ${"Descrição sintética de staging com mais de cento e vinte caracteres para validar listagem, SEO e canais sem gerar candidatura real."},
        ${"<p>Descrição sintética de staging com mais de cento e vinte caracteres para validar listagem, SEO e canais sem gerar candidatura real.</p>"},
        ${item.url}, ${item.email}, ${item.wa}, ${Boolean(item.wa)}, ${Boolean(item.email)},
        ${"Staging fixture"}, ${"MANUAL"}, ${hash},
        ${item.status === "PUBLISHED" ? "SOURCE_CONFIRMED" : "NEEDS_REVIEW"}, ${item.status},
        ${published}, ${expires},
        ${item.url && item.email && item.wa ? "MULTIPLE" : item.url ? "URL" : item.wa ? "WHATSAPP" : item.email ? "EMAIL" : "NONE"}
      )
    `;
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        written: true,
        marker: mark,
        companyActiveId: companyActive.id,
        companyIdleId: companyIdle.id,
        city: city.name
      },
      null,
      2
    )
  );
} finally {
  await sql.end({ timeout: 5 });
}
