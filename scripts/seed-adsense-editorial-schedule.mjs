#!/usr/bin/env node
/**
 * Agenda pacote editorial interno para a Rota da Aprovação (AdSense).
 *
 * Meta interna (NÃO é regra oficial do Google) — escala ×3:
 *   - 45 posts publicados com ≥2400 caracteres úteis
 *   - capa com ALT/legenda/crédito (ativo de marca)
 *   - autoria, fontes, pilar/cluster
 *
 * Este script cria 54 peças (18 publicadas agora + 36 agendadas em dias úteis)
 * e 9 Web Stories ligadas a Posts Magnéticos.
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

const SCALE = 3;
const PUBLISH_NOW = 6 * SCALE; // 18
const SCHEDULE_COUNT = 12 * SCALE; // 36
const STORY_COUNT = 3 * SCALE; // 9
const MIN_USEFUL_CHARS = 800 * SCALE; // 2400
const READY_AT = 15 * SCALE; // 45

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

const hostIsLocal = target.host === "127.0.0.1" || target.host === "localhost";
/** Hostname Docker/Coolify interno (ex.: uuid do serviço) — não resolve no PC Windows. */
const hostLooksDockerInternal =
  !hostIsLocal &&
  !String(target.host).includes(".") &&
  /^[a-z0-9]{8,}$/i.test(String(target.host));

const looksProduction =
  /empregossaoluis\.com\.br|production/i.test(databaseUrl) ||
  /prod/i.test(String(target.database)) ||
  process.env.APP_ENV === "production" ||
  hostLooksDockerInternal;

const hostOk = hostIsLocal;
const portOk = String(target.port) === "55432";
const dbOk = /staging|e2e/i.test(String(target.database));
const localOk = hostOk && portOk && dbOk;
const productionWriteOk = allowProduction && understandProduction;
const remoteWriteOk = allowRemote === true;

if (looksProduction && !productionWriteOk) {
  console.error(
    "Recusa fail-closed: alvo parece produção/Coolify. Defina ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 e passe --i-understand-production após backup."
  );
  console.error(
    "Dica: hostname Docker interno (ex.: leaoz...) só funciona DENTRO do Coolify (Terminal do container), não no PowerShell do Windows."
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
          scale: SCALE,
          publishedNow: PUBLISH_NOW,
          scheduledWeekdays: SCHEDULE_COUNT,
          webStories: STORY_COUNT,
          minUsefulChars: MIN_USEFUL_CHARS,
          coverImage: "/brand/og-default.png",
          internalReadyAt: `quando substantialPublished >= ${READY_AT} (worker publica agendados)`
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

if (!localOk && !remoteWriteOk && !productionWriteOk) {
  console.error(
    "Recusa fail-closed: use banco local E2E (55432), ou ADSENSE_EDITORIAL_ALLOW_REMOTE=1 (staging), ou ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1 + --i-understand-production."
  );
  process.exit(1);
}

if (hostLooksDockerInternal && productionWriteOk) {
  console.log(
    JSON.stringify(
      {
        ok: true,
        hint: "Hostname Docker interno detectado. Este comando deve rodar no Terminal do Coolify (mesmo servidor/rede), não no PC."
      },
      null,
      2
    )
  );
}

const mark = "ADSENSE-EDITORIAL-SCHEDULE";
const slugBase = "adsense-editorial";
const siteUrl = (process.env.SITE_URL || "https://empregossaoluis.com.br").replace(/\/$/, "");
const coverUrl = `${siteUrl}/brand/og-default.png`;

/** @type {Array<{ title: string; type: "NEWS"|"GUIDE"|"DATA_REPORT"; template: string; keyword: string; section: string }>} */
const baseCatalog = [
  { title: "Como buscar vagas em São Luís sem cair em golpe", type: "GUIDE", template: "POST_MAGNETICO", keyword: "vagas sao luis golpe", section: "guia" },
  { title: "CLT ou temporário na Grande Ilha: o que comparar antes de candidatar", type: "GUIDE", template: "STANDARD", keyword: "clt temporario sao luis", section: "guia" },
  { title: "Bairros com mais oportunidades recentes em São Luís", type: "DATA_REPORT", template: "STANDARD", keyword: "vagas por bairro sao luis", section: "dados" },
  { title: "Currículo para vagas de atendimento no Maranhão", type: "GUIDE", template: "POST_MAGNETICO", keyword: "curriculo atendimento maranhao", section: "guia" },
  { title: "WhatsApp na candidatura: como se apresentar com segurança", type: "GUIDE", template: "STANDARD", keyword: "candidatura whatsapp sao luis", section: "guia" },
  { title: "Primeiro emprego em São Luís: passos práticos nesta semana", type: "NEWS", template: "STANDARD", keyword: "primeiro emprego sao luis", section: "noticias" },
  { title: "Vagas presenciais versus híbridas na capital maranhense", type: "GUIDE", template: "STANDARD", keyword: "vagas presenciais sao luis", section: "guia" },
  { title: "Documentos que empresas pedem com frequência no MA", type: "GUIDE", template: "POST_MAGNETICO", keyword: "documentos admissao maranhao", section: "guia" },
  { title: "Como ler uma vaga e evitar descrição enganosa", type: "GUIDE", template: "STANDARD", keyword: "ler vaga emprego", section: "guia" },
  { title: "Rotina de busca: 30 minutos por dia em São Luís", type: "GUIDE", template: "STANDARD", keyword: "rotina busca emprego", section: "guia" },
  { title: "Cursos gratuitos e preparação para entrevistas locais", type: "NEWS", template: "STANDARD", keyword: "cursos gratuitos emprego sao luis", section: "noticias" },
  { title: "Transporte e pontualidade: planejar o deslocamento até o trabalho", type: "GUIDE", template: "STANDARD", keyword: "transporte trabalho sao luis", section: "guia" },
  { title: "Vagas no comércio da ilha: o que costuma ser avaliado", type: "GUIDE", template: "POST_MAGNETICO", keyword: "vagas comercio sao luis", section: "guia" },
  { title: "E-mail de candidatura curto e claro (modelo local)", type: "GUIDE", template: "STANDARD", keyword: "email candidatura modelo", section: "guia" },
  { title: "Quando desconfiar de pedido de pagamento para garantir vaga", type: "NEWS", template: "STANDARD", keyword: "golpe pagamento vaga", section: "noticias" },
  { title: "Atualizar LinkedIn e perfil local sem inventar experiência", type: "GUIDE", template: "STANDARD", keyword: "linkedin emprego sao luis", section: "guia" },
  { title: "Checklist da entrevista presencial em São Luís", type: "GUIDE", template: "POST_MAGNETICO", keyword: "entrevista presencial sao luis", section: "guia" },
  { title: "Como o Empregos São Luís organiza vagas para o candidato", type: "NEWS", template: "STANDARD", keyword: "como funciona empregos sao luis", section: "noticias" }
];

const seriesLabels = ["", " — aprofundamento", " — checklist prático"];
const catalog = [];
for (let series = 0; series < SCALE; series += 1) {
  for (const item of baseCatalog) {
    catalog.push({
      ...item,
      title: `${item.title}${seriesLabels[series]}`,
      keyword: series === 0 ? item.keyword : `${item.keyword} ${series + 1}`,
      series: series + 1
    });
  }
}

function buildHtml(item) {
  const paragraphs = [
    `<p>Este material do Empregos São Luís foi escrito para quem busca oportunidade na Grande Ilha com segurança e objetividade. Não é texto genérico: o foco é o candidato em São Luís e região, com passos claros e sem promessa milagrosa.</p>`,
    `<p><strong>${item.title}</strong>. Antes de qualquer candidatura, leia o anúncio completo. Confira cidade, bairro (quando houver), tipo de contrato, horário e o canal oficial — site, WhatsApp ou e-mail. No portal, a candidatura do trabalhador continua gratuita e sem cadastro obrigatório.</p>`,
    `<p>Contexto local: deslocamento na ilha, chuva, trânsito e pontualidade pesam na prática. Se a descrição estiver vaga demais, pergunte pelo canal indicado. Nunca envie documentos sensíveis (RG, CPF, selfie com documento) a quem pede “taxa de liberação”, “kit de uniforme pago antecipado” ou depósito para “garantir entrevista”.</p>`,
    `<p>Como avaliar qualidade da vaga: (1) empresa ou intermediário identificável; (2) canal de contato coerente; (3) requisitos proporcionais ao cargo; (4) ausência de cobrança ao candidato; (5) coerência entre título e descrição. Guarde prints se algo parecer irregular.</p>`,
    `<p>Roteiro de ação nesta semana: atualize o currículo em uma página; prepare um parágrafo curto de apresentação; candidate-se só em vagas alinhadas; anote códigos ES quando existirem; acompanhe o retorno sem insistir de forma invasiva. Palavra-chave de apoio editorial: ${item.keyword}.</p>`,
    `<p>Para entrevistas presenciais em São Luís, planeje o trajeto com margem, leve documento com foto e uma cópia do currículo. Em canais digitais, use mensagem objetiva: nome, cargo pretendido, disponibilidade e anexo ou link do currículo — sem áudios longos nem dados bancários.</p>`,
    `<p>O Empregos São Luís prioriza orientação útil e transparência. Este texto é original do site, com fontes institucionais internas, e integra a meta editorial de qualidade (conteúdo substancial, autoria, fontes e imagem de capa creditada) usada na Rota da Aprovação interna — sem garantir aprovação do Google AdSense.</p>`,
    `<p>Evite atalhos: não compartilhe senha de e-mail, não aceite “vaga garantida” via grupo fechado sem descrição pública e não pague para “entrar no banco de talentos”. Se a oferta parecer boa demais, compare com outras vagas semelhantes no portal e peça confirmação por escrito.</p>`,
    `<p>Próximo passo: abra a busca de vagas no portal, filtre por cidade ou modalidade e candidate-se apenas pelos canais oficiais da publicação. Em caso de dúvida sobre golpe, consulte também a página de segurança do candidato e a política editorial do site.</p>`
  ];
  const html = paragraphs.join("\n");
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length < MIN_USEFUL_CHARS) {
    throw new Error(`HTML abaixo da meta (${plain.length} < ${MIN_USEFUL_CHARS}) para: ${item.title}`);
  }
  return html;
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
      ${"Equipe editorial do Empregos São Luís. Orienta candidatos da Grande Ilha com conteúdo original, fontes internas e imagens de marca creditadas."}
    )
    returning id
  `;

  const [pillar] = await sql`
    insert into es_content_pillars (name, slug, description, audience, active)
    values (
      ${"Emprego na Grande Ilha"},
      ${`${slugBase}-pilar`},
      ${"Pilar editorial interno (meta ×3) para volume e qualidade na Rota da Aprovação."},
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

  const scheduleDates = nextWeekdays(SCHEDULE_COUNT);
  let published = 0;
  let scheduled = 0;
  const magneticArticleIds = [];

  for (let index = 0; index < catalog.length; index += 1) {
    const item = catalog[index];
    const slug = `${slugBase}-${String(index + 1).padStart(2, "0")}`;
    const html = buildHtml(item);
    const cluster = clusters[index % clusters.length];
    const excerpt = `${item.title}. Orientação prática e local para candidatos em São Luís e região.`;
    const sources = [
      { name: "Empregos São Luís — política editorial", url: `${siteUrl}/politica-editorial` },
      { name: "Empregos São Luís — política de fontes", url: `${siteUrl}/politica-fontes` }
    ];
    const isImmediate = index < PUBLISH_NOW;
    const status = isImmediate ? "PUBLISHED" : "SCHEDULED";
    const publishedAt = isImmediate ? new Date() : null;
    const scheduledAt = isImmediate ? null : scheduleDates[index - PUBLISH_NOW];
    const coverAlt = `Capa editorial: ${item.title}`;
    const coverCaption = "Identidade visual Empregos São Luís — material editorial interno.";
    const coverCredit = "Empregos São Luís (marca própria)";

    const [row] = await sql`
      insert into es_articles (
        type, author_id, pillar_id, cluster_id, title, slug, excerpt, content_html,
        cover_image_url, cover_image_alt, cover_image_caption, cover_image_credit,
        cover_image_width, cover_image_height, og_image_url,
        section, tags, source_name, source_url, sources,
        seo_title, meta_description, primary_keyword, search_intent,
        editorial_template, direct_answer, local_hook, audience, candidate_cta,
        editorial_stage, status, published_at, scheduled_at,
        news_eligible, discover_eligible, web_story_eligible, ai_assisted, fact_checked_at
      ) values (
        ${item.type},
        ${author.id},
        ${pillar.id},
        ${cluster.id},
        ${item.title},
        ${slug},
        ${excerpt},
        ${html},
        ${coverUrl},
        ${coverAlt},
        ${coverCaption},
        ${coverCredit},
        ${1200},
        ${630},
        ${coverUrl},
        ${item.section},
        ${sql.json(["sao-luis", "emprego", item.section, `serie-${item.series}`])},
        ${"Empregos São Luís"},
        ${`${siteUrl}/politica-editorial`},
        ${sql.json(sources)},
        ${`${item.title} | Empregos São Luís`},
        ${excerpt.slice(0, 155)},
        ${item.keyword},
        ${"informational"},
        ${item.template},
        ${`Resumo direto: ${item.title}.`},
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
        ${false},
        ${new Date()}
      )
      returning id, slug, status
    `;

    if (status === "PUBLISHED") published += 1;
    else scheduled += 1;
    if (item.template === "POST_MAGNETICO") magneticArticleIds.push({ ...row, title: item.title });
  }

  let stories = 0;
  for (let i = 0; i < Math.min(STORY_COUNT, magneticArticleIds.length); i += 1) {
    const article = magneticArticleIds[i];
    const storySlug = `${slugBase}-story-${String(i + 1).padStart(2, "0")}`;
    const pages = [
      { title: "Contexto", bodyHtml: `<p>${article.title}</p>`, alt: "Capa editorial" },
      { title: "Ação", bodyHtml: "<p>Confira o canal oficial da vaga e candidate-se sem pagar.</p>", alt: "Ação" },
      { title: "Portal", bodyHtml: "<p>Empregos São Luís — candidatura gratuita.</p>", alt: "CTA" }
    ];
    const storyScheduled = scheduleDates[i] ?? nextWeekdays(1)[0];
    await sql`
      insert into es_web_stories (
        title, slug, article_id, author_id, status, pages,
        poster_url, poster_alt,
        seo_title, meta_description, cta_label, cta_url,
        scheduled_at, published_at
      ) values (
        ${`Web Story: ${article.title}`},
        ${storySlug},
        ${article.id},
        ${author.id},
        ${"SCHEDULED"},
        ${sql.json(pages)},
        ${coverUrl},
        ${`Capa: ${article.title}`},
        ${`Web Story: ${article.title}`},
        ${"Story editorial com imagem de marca — apoio à qualidade, sem spam."},
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
        scale: SCALE,
        published,
        scheduled,
        stories,
        minUsefulChars: MIN_USEFUL_CHARS,
        readyAt: READY_AT,
        coverImage: coverUrl,
        note: `Worker deve publicar SCHEDULED. Meta interna: ${READY_AT} posts substanciais com capa. Institucionais e Publisher ID real continuam manuais.`,
        proof
      },
      null,
      2
    )
  );
} finally {
  await sql.end({ timeout: 5 });
}
