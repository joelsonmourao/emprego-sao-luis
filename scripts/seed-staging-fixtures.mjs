#!/usr/bin/env node
/**
 * Fixtures sintéticos para staging/E2E (nunca produção).
 * Idempotente: usa marker fixo E2E-ADMIN-FIXTURE e limpa/recria.
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

function describeDbUrl(url) {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(":", ""),
      host: parsed.hostname,
      port: parsed.port || "(default)",
      database: parsed.pathname.replace(/^\//, ""),
      user: parsed.username || "(none)"
    };
  } catch {
    return { error: "URL inválida" };
  }
}

const target = describeDbUrl(databaseUrl);
if (target.error) {
  console.error("Recusa: DATABASE_URL inválida.");
  process.exit(1);
}

// Nunca imprimir senha — apenas metadados seguros.
console.log(
  JSON.stringify(
    {
      ok: true,
      target: {
        host: target.host,
        port: target.port,
        database: target.database,
        user: target.user
      }
    },
    null,
    2
  )
);

if (/empregossaoluis\.com\.br|production|coolify/i.test(databaseUrl)) {
  console.error("Recusa fail-closed: DATABASE_URL aponta para produção/Coolify.");
  process.exit(1);
}

const hostOk = target.host === "127.0.0.1" || target.host === "localhost";
const portOk = String(target.port) === "55432";
const dbOk = /staging|e2e/i.test(String(target.database));

if (!write) {
  const plan = {
    dryRun: true,
    marker: "E2E-ADMIN-FIXTURE",
    note: "Passe --write apenas após confirmar host/porta/banco locais."
  };
  console.log(JSON.stringify({ ok: true, ...plan, checks: { hostOk, portOk, dbOk } }, null, 2));
  console.log("Dry-run concluído. Nenhuma gravação.");
  process.exit(0);
}

// Fail-closed para --write (sem ALLOW bypass silencioso para host remoto)
if (!hostOk) {
  console.error("Recusa fail-closed: host deve ser 127.0.0.1 ou localhost. Recebido:", target.host);
  process.exit(1);
}
if (!portOk) {
  console.error("Recusa fail-closed: porta deve ser 55432. Recebido:", target.port);
  process.exit(1);
}
if (!dbOk) {
  console.error("Recusa fail-closed: nome do banco deve conter staging ou e2e. Recebido:", target.database);
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });
const mark = "E2E-ADMIN-FIXTURE";
const slugBase = "e2e-admin-fixture";

const plan = {
  dryRun: false,
  marker: mark,
  idempotent: true,
  jobs: ["url-only", "whatsapp-only", "email-only", "all-channels", "featured", "pending-review"],
  extras: ["pillar", "clusters", "post-magnetico", "web-stories", "classification-rule", "import-batch", "plan", "campaign", "adsense-history"]
};
console.log(JSON.stringify({ ok: true, ...plan }, null, 2));

try {
  const [state] = await sql`select id from es_states where code = 'MA' limit 1`;
  const [city] = await sql`select id, name from es_cities where state_id = ${state.id} order by name asc limit 1`;
  if (!state || !city) throw new Error("Seed de localidades ausente.");

  // Limpeza idempotente por slug/marker
  await sql`delete from es_web_stories where slug like ${`${slugBase}%`}`;
  await sql`delete from es_articles where slug like ${`${slugBase}%`}`;
  await sql`delete from es_jobs where slug like ${`${slugBase}%`}`;
  await sql`delete from es_content_clusters where slug like ${`${slugBase}%`}`;
  await sql`delete from es_content_pillars where slug like ${`${slugBase}%`}`;
  await sql`delete from es_authors where slug like ${`${slugBase}%`}`;
  await sql`delete from es_companies where slug like ${`${slugBase}%`}`;
  await sql`delete from es_classification_rules where category_slug = ${`${slugBase}-analista`}`;
  await sql`delete from es_import_batches where file_name like ${`${mark}%`}`;
  await sql`delete from es_commercial_plans where slug = ${`${slugBase}-plano`}`;
  await sql`delete from es_campaigns where name like ${`${mark}%`}`;
  await sql`delete from es_advertisers where name like ${`${mark}%`}`;
  await sql`delete from es_adsense_readiness_history where stage_snapshot::text like ${`%${mark}%`}`;

  const [companyActive] = await sql`
    insert into es_companies (name, slug, active, sponsored, featured)
    values (${`${mark} Empresa Ativa`}, ${`${slugBase}-ativa`}, true, true, true)
    returning id
  `;

  const cases = [
    { slug: `${slugBase}-url`, url: "https://example.invalid/vaga", email: null, wa: null, status: "PUBLISHED" },
    { slug: `${slugBase}-wa`, url: null, email: null, wa: "5598900001001", status: "PUBLISHED" },
    { slug: `${slugBase}-mail`, url: null, email: "staging-candidato@example.invalid", wa: null, status: "PUBLISHED" },
    {
      slug: `${slugBase}-all`,
      url: "https://example.invalid/vaga",
      email: "staging-rh@example.invalid",
      wa: "5598900001004",
      status: "PUBLISHED"
    },
    { slug: `${slugBase}-review`, url: "https://example.invalid/vaga", email: null, wa: null, status: "PENDING_REVIEW" }
  ];

  for (const item of cases) {
    const code = `ES-${String(Math.floor(Math.random() * 900000) + 100000)}`;
    const hash = createHash("sha256").update(item.slug).digest("hex");
    const published = item.status === "PUBLISHED" ? sql`now()` : sql`null`;
    await sql`
      insert into es_jobs (
        public_code, slug, original_title, normalized_title, company_id, city_id, state_id,
        employment_type, workplace_type, summary, description, description_html,
        application_url, application_email, application_whatsapp, application_whatsapp_valid, application_email_valid,
        source_name, origin_type, duplicate_hash, verification_status, publication_status,
        published_at, expires_at, application_type
      ) values (
        ${code}, ${item.slug}, ${`Analista ${mark}`}, ${`Analista ${mark}`},
        ${companyActive.id}, ${city.id}, ${state.id},
        ${"CLT"}, ${"presencial"},
        ${"Resumo sintético E2E."},
        ${"Descrição sintética E2E com mais de cento e vinte caracteres para validar listagem, SEO e canais sem gerar candidatura real."},
        ${"<p>Descrição sintética E2E com mais de cento e vinte caracteres.</p>"},
        ${item.url}, ${item.email}, ${item.wa}, ${Boolean(item.wa)}, ${Boolean(item.email)},
        ${"E2E fixture"}, ${"MANUAL"}, ${hash},
        ${item.status === "PUBLISHED" ? "SOURCE_CONFIRMED" : "NEEDS_REVIEW"}, ${item.status},
        ${published}, now() + interval '14 days',
        ${item.url && item.email && item.wa ? "MULTIPLE" : item.url ? "URL" : item.wa ? "WHATSAPP" : item.email ? "EMAIL" : "NONE"}
      )
    `;
  }

  await sql`
    insert into es_jobs (
      public_code, slug, original_title, normalized_title, company_id, city_id, state_id,
      employment_type, workplace_type, summary, description, description_html,
      application_url, source_name, origin_type, duplicate_hash, verification_status, publication_status,
      published_at, expires_at, application_type, featured, sponsored
    ) values (
      ${`ES-${String(Math.floor(Math.random() * 900000) + 100000)}`},
      ${`${slugBase}-featured`},
      ${`Vaga Destacada ${mark}`}, ${`Vaga Destacada ${mark}`},
      ${companyActive.id}, ${city.id}, ${state.id},
      ${"CLT"}, ${"presencial"},
      ${"Vaga destacada sintética."},
      ${"Descrição sintética de vaga destacada com mais de cento e vinte caracteres."},
      ${"<p>Descrição sintética de vaga destacada.</p>"},
      ${"https://example.invalid/vaga-destaque"}, ${"E2E fixture"}, ${"MANUAL"},
      ${createHash("sha256").update(`${slugBase}-featured`).digest("hex")},
      ${"SOURCE_CONFIRMED"}, ${"PUBLISHED"}, now(), now() + interval '14 days', ${"URL"}, true, true
    )
  `;

  const [pillar] = await sql`
    insert into es_content_pillars (name, slug, description, audience, active)
    values (${`${mark} Vagas na Grande Ilha`}, ${`${slugBase}-pilar`}, ${"Pilar sintético."}, ${"CANDIDATE"}, true)
    returning id
  `;
  await sql`
    insert into es_content_clusters (pillar_id, name, slug, description, active)
    values
      (${pillar.id}, ${`${mark} Cluster A`}, ${`${slugBase}-cluster-a`}, ${"Cluster A"}, true),
      (${pillar.id}, ${`${mark} Cluster B`}, ${`${slugBase}-cluster-b`}, ${"Cluster B"}, true)
  `;

  const [author] = await sql`
    insert into es_authors (name, slug, bio)
    values (${`${mark} Autor`}, ${`${slugBase}-autor`}, ${"Autor sintético"})
    returning id
  `;

  await sql`
    insert into es_articles (
      type, title, slug, excerpt, content_html, author_id, status, editorial_template,
      direct_answer, local_hook, candidate_cta, primary_keyword, pillar_id
    ) values (
      ${"GUIDE"}, ${`Post Magnético ${mark}`}, ${`${slugBase}-post-magnetico`},
      ${"Resumo sintético do Post Magnético."},
      ${"<p>Conteúdo sintético com mais de vinte caracteres para seed E2E.</p>"},
      ${author.id}, ${"DRAFT"}, ${"POST_MAGNETICO"},
      ${"Resposta principal sintética."}, ${"Gancho local São Luís."},
      ${"Buscar vagas gratuitas"}, ${"vagas sao luis"}, ${pillar.id}
    )
  `;

  await sql`
    insert into es_web_stories (title, slug, status, pages, author_id, published_at)
    values
      (${`Story Draft ${mark}`}, ${`${slugBase}-story-draft`}, ${"DRAFT"}, ${sql.json([{ title: "P1", bodyHtml: "<p>t</p>", alt: "a" }])}, ${author.id}, null),
      (${`Story Pub ${mark}`}, ${`${slugBase}-story-pub`}, ${"PUBLISHED"}, ${sql.json([{ title: "P1", bodyHtml: "<p>t</p>", alt: "a" }])}, ${author.id}, now())
  `;

  await sql`
    insert into es_classification_rules (category_slug, category_name, keywords, synonyms, priority, active)
    values (
      ${`${slugBase}-analista`},
      ${"Analista E2E"},
      ${sql.json(["analista", "assistente administrativo"])},
      ${sql.json(["auxiliar"])},
      10,
      true
    )
  `;

  await sql`
    insert into es_import_batches (file_hash, file_name, status, total_rows, valid_rows, rejected_rows, settings)
    values (
      ${createHash("sha256").update(`${mark}-import`).digest("hex")},
      ${`${mark}-modelo.xlsx`},
      ${"COMPLETED"},
      3, 2, 1,
      ${sql.json({ fixture: true, marker: mark })}
    )
  `;

  await sql`
    insert into es_commercial_plans (
      name, slug, short_description, description, price, job_credits, duration_days, active, recommended
    ) values (
      ${`${mark} Plano Empresa`},
      ${`${slugBase}-plano`},
      ${"Plano sintético E2E"},
      ${"Plano empresarial sintético para testes locais. Candidato permanece gratuito."},
      ${"99.00"}, 5, 30, true, true
    )
  `;

  const [advertiser] = await sql`
    insert into es_advertisers (name, contact_email, active)
    values (${`${mark} Anunciante`}, ${"anunciante@example.invalid"}, true)
    returning id
  `;
  await sql`
    insert into es_campaigns (advertiser_id, name, status, disclosure, internal_notes)
    values (${advertiser.id}, ${`${mark} Campanha`}, ${"DRAFT"}, ${"Publicidade"}, ${"Fixture E2E"})
  `;

  await sql`
    insert into es_adsense_readiness_history (classification, stage_snapshot)
    values (${"PENDENTE"}, ${sql.json({ note: "Fixture E2E", marker: mark })})
  `;

  const proof = {
    jobs: (await sql`select slug, application_type, featured from es_jobs where slug like ${`${slugBase}%`} order by slug`).length,
    pillars: (await sql`select id from es_content_pillars where slug like ${`${slugBase}%`}`).length,
    clusters: (await sql`select id from es_content_clusters where slug like ${`${slugBase}%`}`).length,
    articles: (await sql`select id from es_articles where slug like ${`${slugBase}%`}`).length,
    stories: (await sql`select id from es_web_stories where slug like ${`${slugBase}%`}`).length,
    rules: (await sql`select id from es_classification_rules where category_slug = ${`${slugBase}-analista`}`).length,
    imports: (await sql`select id from es_import_batches where file_name like ${`${mark}%`}`).length,
    plans: (await sql`select id from es_commercial_plans where slug = ${`${slugBase}-plano`}`).length,
    campaigns: (await sql`select id from es_campaigns where name like ${`${mark}%`}`).length,
    adsenseHistory: (await sql`select id from es_adsense_readiness_history where stage_snapshot::text like ${`%${mark}%`}`).length
  };

  console.log(JSON.stringify({ ok: true, written: true, marker: mark, target, proof }, null, 2));
} finally {
  await sql.end({ timeout: 5 });
}
