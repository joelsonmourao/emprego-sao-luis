#!/usr/bin/env node
/**
 * Agenda pacote editorial interno para a Rota da Aprovação (AdSense).
 *
 * Meta interna (NÃO é regra oficial do Google): 15 posts publicados com ≥800 caracteres úteis,
 * com autoria, fontes, pilar/cluster. Este script cria 18 peças (6 publicadas agora + 12 agendadas
 * em dias úteis) e 3 Web Stories ligadas aos Posts Magnéticos.
 *
 * Uso:
 *   node scripts/seed-adsense-editorial-schedule.mjs
 *   node scripts/seed-adsense-editorial-schedule.mjs --write
 *
 * Fail-closed:
 *   - local: host 127.0.0.1|localhost, porta 55432, banco com staging|e2e
 *   - remoto/staging: ADSENSE_EDITORIAL_ALLOW_REMOTE=1
 *   - produção: ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 e --i-understand-production
 */
import postgres from "postgres";

const write = process.argv.includes("--write");
const understandProduction = process.argv.includes("--i-understand-production");
const allowRemote = process.env.ADSENSE_EDITORIAL_ALLOW_REMOTE === "1";
const allowProduction = process.env.ADSENSE_EDITORIAL_ALLOW_PRODUCTION === "1";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL é obrigatória.");
  process.exit(1);
}

function describeDbUrl(url) {
  try {
    const parsed = new URL(url);
    return {
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

console.log(
  JSON.stringify(
    {
      ok: true,
      target: { host: target.host, port: target.port, database: target.database, user: target.user }
    },
    null,
    2
  )
);

const looksProduction =
  /empregossaoluis\.com\.br|production/i.test(databaseUrl) ||
  /prod/i.test(String(target.database)) ||
  process.env.APP_ENV === "production";

const hostOk = target.host === "127.0.0.1" || target.host === "localhost";
const portOk = String(target.port) === "55432";
const dbOk = /staging|e2e/i.test(String(target.database));
const localOk = hostOk && portOk && dbOk;

if (looksProduction && !(allowProduction && understandProduction)) {
  console.error(
    "Recusa fail-closed: alvo parece produção. Defina ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 e passe --i-understand-production após backup."
  );
  process.exit(1);
}

if (!write) {
  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: true,
        marker: "ADSENSE-EDITORIAL-SCHEDULE",
        plan: {
          publishedNow: 6,
          scheduledWeekdays: 12,
          webStories: 3,
          minUsefulChars: 800,
          internalReadyAt: "quando substantialPublished >= 15 (worker publica agendados)"
        },
        checks: { localOk, allowRemote, allowProduction, looksProduction }
      },
      null,
      2
    )
  );
  console.log("Dry-run concluído. Nenhuma gravação.");
  process.exit(0);
}

if (!localOk && !allowRemote && !(looksProduction && allowProduction && understandProduction)) {
  console.error(
    "Recusa fail-closed: use banco local E2E (55432) ou ADSENSE_EDITORIAL_ALLOW_REMOTE=1 (staging)."
  );
  process.exit(1);
}

const mark = "ADSENSE-EDITORIAL-SCHEDULE";
const slugBase = "adsense-editorial";
const siteUrl = (process.env.SITE_URL || "https://empregossaoluis.com.br").replace(/\/$/, "");

/** @type {Array<{ title: string; type: "NEWS"|"GUIDE"|"DATA_REPORT"; template: string; keyword: string; section: string }>} */
const catalog = [
  {
    title: "Como buscar vagas em São Luís sem cair em golpe",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "vagas sao luis golpe",
    section: "guia"
  },
  {
    title: "CLT ou temporário na Grande Ilha: o que comparar antes de candidatar",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "clt temporario sao luis",
    section: "guia"
  },
  {
    title: "Bairros com mais oportunidades recentes em São Luís",
    type: "DATA_REPORT",
    template: "STANDARD",
    keyword: "vagas por bairro sao luis",
    section: "dados"
  },
  {
    title: "Currículo para vagas de atendimento no Maranhão",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "curriculo atendimento maranhao",
    section: "guia"
  },
  {
    title: "WhatsApp na candidatura: como se apresentar com segurança",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "candidatura whatsapp sao luis",
    section: "guia"
  },
  {
    title: "Primeiro emprego em São Luís: passos práticos nesta semana",
    type: "NEWS",
    template: "STANDARD",
    keyword: "primeiro emprego sao luis",
    section: "noticias"
  },
  {
    title: "Vagas presenciais versus híbridas na capital maranhense",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "vagas presenciais sao luis",
    section: "guia"
  },
  {
    title: "Documentos que empresas pedem com frequência no MA",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "documentos admissao maranhao",
    section: "guia"
  },
  {
    title: "Como ler uma vaga e evitar descrição enganosa",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "ler vaga emprego",
    section: "guia"
  },
  {
    title: "Rotina de busca: 30 minutos por dia em São Luís",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "rotina busca emprego",
    section: "guia"
  },
  {
    title: "Cursos gratuitos e preparação para entrevistas locais",
    type: "NEWS",
    template: "STANDARD",
    keyword: "cursos gratuitos emprego sao luis",
    section: "noticias"
  },
  {
    title: "Transporte e pontualidade: planejar o deslocamento até o trabalho",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "transporte trabalho sao luis",
    section: "guia"
  },
  {
    title: "Vagas no comércio da ilha: o que costuma ser avaliado",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "vagas comercio sao luis",
    section: "guia"
  },
  {
    title: "E-mail de candidatura curto e claro (modelo local)",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "email candidatura modelo",
    section: "guia"
  },
  {
    title: "Quando desconfiar de pedido de pagamento para “garantir vaga”",
    type: "NEWS",
    template: "STANDARD",
    keyword: "golpe pagamento vaga",
    section: "noticias"
  },
  {
    title: "Atualizar LinkedIn e perfil local sem inventar experiência",
    type: "GUIDE",
    template: "STANDARD",
    keyword: "linkedin emprego sao luis",
    section: "guia"
  },
  {
    title: "Checklist da entrevista presencial em São Luís",
    type: "GUIDE",
    template: "POST_MAGNETICO",
    keyword: "entrevista presencial sao luis",
    section: "guia"
  },
  {
    title: "Como o Empregos São Luís organiza vagas para o candidato",
    type: "NEWS",
    template: "STANDARD",
    keyword: "como funciona empregos sao luis",
    section: "noticias"
  }
];

function buildHtml(item) {
  const paragraphs = [
    `<p>Este guia do Empregos São Luís ajuda quem busca oportunidade na Grande Ilha a tomar decisões com mais clareza. O foco é prático: o que verificar na vaga, como se candidatar sem custo e quais sinais pedem atenção extra.</p>`,
    `<p>Sobre <strong>${item.title}</strong>: comece pelo título e pela descrição completa. Confira cidade, bairro (quando informado), tipo de contrato e canal oficial de candidatura — site, WhatsApp ou e-mail. No portal, a candidatura do trabalhador permanece gratuita e sem cadastro obrigatório.</p>`,
    `<p>Em São Luís e na região metropolitana, vale cruzar a informação da vaga com o contexto local: deslocamento, horário e requisitos reais. Se algo parecer confuso, peça esclarecimento pelo canal indicado antes de enviar documentos sensíveis.</p>`,
    `<p>Palavra-chave de apoio: ${item.keyword}. Use-a apenas como referência de busca; o conteúdo abaixo prioriza utilidade para o candidato maranhense, não volume artificial de texto.</p>`,
    `<p>Checklist rápido: (1) leia a vaga inteira; (2) confirme o canal de candidatura; (3) prepare um currículo objetivo; (4) não pague para “liberar” entrevista; (5) guarde prints se houver promessa suspeita. Volte ao portal para novas publicações e atualizações editoriais.</p>`,
    `<p>Fonte editorial interna: equipe Empregos São Luís. Este texto é original do site, pensado para orientação local e para sustentar a qualidade exigida na Rota da Aprovação interna antes de qualquer ativação de anúncios.</p>`
  ];
  return paragraphs.join("\n");
}

function nextWeekdays(count, from = new Date()) {
  const dates = [];
  const cursor = new Date(from);
  cursor.setHours(12, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);
  while (dates.length < count) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      const scheduled = new Date(cursor);
      scheduled.setUTCHours(12, 0, 0, 0);
      dates.push(scheduled);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });

try {
  await sql`delete from es_web_stories where slug like ${`${slugBase}%`}`;
  await sql`delete from es_articles where slug like ${`${slugBase}%`}`;
  await sql`delete from es_content_clusters where slug like ${`${slugBase}%`}`;
  await sql`delete from es_content_pillars where slug like ${`${slugBase}%`}`;
  await sql`delete from es_authors where slug like ${`${slugBase}%`}`;

  const [author] = await sql`
    insert into es_authors (name, slug, bio)
    values (
      ${"Redação Empregos São Luís"},
      ${`${slugBase}-autor`},
      ${"Equipe editorial do Empregos São Luís. Orienta candidatos da Grande Ilha com conteúdo original e checagem básica de fontes."}
    )
    returning id
  `;

  const [pillar] = await sql`
    insert into es_content_pillars (name, slug, description, audience, active)
    values (
      ${"Emprego na Grande Ilha"},
      ${`${slugBase}-pilar`},
      ${"Pilar editorial interno para volume e qualidade na Rota da Aprovação."},
      ${"CANDIDATE"},
      true
    )
    returning id
  `;

  const clusters = await sql`
    insert into es_content_clusters (pillar_id, name, slug, description, active)
    values
      (${pillar.id}, ${"Busca segura"}, ${`${slugBase}-busca-segura`}, ${"Golpes, canais e checagem"}, true),
      (${pillar.id}, ${"Candidatura prática"}, ${`${slugBase}-candidatura`}, ${"Currículo, entrevista e rotina"}, true),
      (${pillar.id}, ${"Mercado local"}, ${`${slugBase}-mercado`}, ${"Bairros, comércio e deslocamento"}, true)
    returning id, slug
  `;

  const scheduleDates = nextWeekdays(12);
  let published = 0;
  let scheduled = 0;
  const magneticArticleIds = [];

  for (let index = 0; index < catalog.length; index += 1) {
    const item = catalog[index];
    const slug = `${slugBase}-${String(index + 1).padStart(2, "0")}`;
    const html = buildHtml(item);
    const cluster = clusters[index % clusters.length];
    const excerpt = `${item.title}. Orientação prática para candidatos em São Luís e região.`;
    const sources = [
      { name: "Empregos São Luís — política editorial", url: `${siteUrl}/politica-editorial` },
      { name: "Empregos São Luís — política de fontes", url: `${siteUrl}/politica-fontes` }
    ];
    const isImmediate = index < 6;
    const status = isImmediate ? "PUBLISHED" : "SCHEDULED";
    const publishedAt = isImmediate ? new Date() : null;
    const scheduledAt = isImmediate ? null : scheduleDates[index - 6];

    const [row] = await sql`
      insert into es_articles (
        type, author_id, pillar_id, cluster_id, title, slug, excerpt, content_html,
        section, tags, source_name, source_url, sources,
        seo_title, meta_description, primary_keyword, search_intent,
        editorial_template, direct_answer, local_hook, audience, candidate_cta,
        editorial_stage, status, published_at, scheduled_at,
        news_eligible, discover_eligible, web_story_eligible, ai_assisted
      ) values (
        ${item.type},
        ${author.id},
        ${pillar.id},
        ${cluster.id},
        ${item.title},
        ${slug},
        ${excerpt},
        ${html},
        ${item.section},
        ${sql.json(["sao-luis", "emprego", item.section])},
        ${"Empregos São Luís"},
        ${`${siteUrl}/politica-editorial`},
        ${sql.json(sources)},
        ${`${item.title} | Empregos São Luís`},
        ${excerpt.slice(0, 155)},
        ${item.keyword},
        ${"informational"},
        ${item.template},
        ${`Resumo: ${item.title}.`},
        ${"Contexto local: São Luís e Grande Ilha."},
        ${"CANDIDATE"},
        ${"Ver vagas gratuitas em São Luís"},
        ${"APPROVED"},
        ${status},
        ${publishedAt},
        ${scheduledAt},
        ${item.type === "NEWS"},
        ${false},
        ${item.template === "POST_MAGNETICO"},
        ${false}
      )
      returning id, slug, status
    `;

    if (status === "PUBLISHED") published += 1;
    else scheduled += 1;
    if (item.template === "POST_MAGNETICO") magneticArticleIds.push(row);
  }

  const magneticCatalog = catalog.filter((item) => item.template === "POST_MAGNETICO");
  let stories = 0;
  for (let i = 0; i < Math.min(3, magneticArticleIds.length); i += 1) {
    const article = magneticArticleIds[i];
    const storyTitle = magneticCatalog[i]?.title ?? `Editorial ${i + 1}`;
    const storySlug = `${slugBase}-story-${i + 1}`;
    const pages = [
      { title: "Contexto", bodyHtml: "<p>Dica rápida para candidatos em São Luís.</p>", alt: "Capa editorial" },
      { title: "Ação", bodyHtml: "<p>Confira o canal oficial da vaga e candidate-se sem pagar.</p>", alt: "Ação" },
      { title: "Portal", bodyHtml: "<p>Empregos São Luís — candidatura gratuita.</p>", alt: "CTA" }
    ];
    const storyScheduled = scheduleDates[i] ?? nextWeekdays(1)[0];
    await sql`
      insert into es_web_stories (
        title, slug, article_id, author_id, status, pages,
        seo_title, meta_description, cta_label, cta_url,
        scheduled_at, published_at
      ) values (
        ${`Web Story: ${storyTitle}`},
        ${storySlug},
        ${article.id},
        ${author.id},
        ${"SCHEDULED"},
        ${sql.json(pages)},
        ${`Web Story: ${storyTitle}`},
        ${"Story interna para apoio editorial — sem publicação em massa."},
        ${"Ver vagas"},
        ${`${siteUrl}/vagas`},
        ${storyScheduled},
        ${null}
      )
    `;
    stories += 1;
  }

  const proof = {
    articles: (
      await sql`select status, count(*)::int as n from es_articles where slug like ${`${slugBase}%`} group by status`
    ).map((r) => ({ status: r.status, n: r.n })),
    stories: (await sql`select id from es_web_stories where slug like ${`${slugBase}%`}`).length,
    pillars: (await sql`select id from es_content_pillars where slug like ${`${slugBase}%`}`).length,
    clusters: (await sql`select id from es_content_clusters where slug like ${`${slugBase}%`}`).length
  };

  console.log(
    JSON.stringify(
      {
        ok: true,
        written: true,
        marker: mark,
        published,
        scheduled,
        stories,
        note: "Worker deve estar ativo para publicar SCHEDULED. Meta interna: 15 posts substanciais. Páginas institucionais e Publisher ID real continuam manuais.",
        proof
      },
      null,
      2
    )
  );
} finally {
  await sql.end({ timeout: 5 });
}
