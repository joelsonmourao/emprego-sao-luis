/**
 * Pacote editorial de qualidade para preparação AdSense (evergreen).
 * Lacunas reais vs catálogo sl-local (105).
 * Persistência: scripts/persist-adsense-quality-guides.mjs (requer DATABASE_URL).
 * NÃO usar seed template adsense-editorial-*.
 *
 * publishPlan:
 * - PUBLISH_NOW: até 2 itens — status PUBLISHED na persistência
 * - SCHEDULE_DAY: 1/dia a partir de amanhã (America/Sao_Paulo)
 * - HOLD_REVIEW: FACT_REVIEW — grava como DRAFT, sem agendar
 */
import { qualityGuideBodies } from "./adsense-quality-bodies.mjs";

export const PACKAGE_ID = "adsense-quality-guides-v1";
export const PACKAGE_TZ = "America/Sao_Paulo";
export const COVER_DIR = "/covers/adsense-quality";

const withBody = (guide) => ({
  ...guide,
  contentHtml: qualityGuideBodies[guide.slug]
});

export const qualityGuides = [
  withBody({
    "slug": "objetivo-profissional-curriculo",
    "type": "GUIDE",
    "title": "Como escrever o objetivo profissional no currículo",
    "subtitle": "Uma frase clara que diga o cargo-alvo sem clichê",
    "excerpt": "Objetivo profissional curto, específico e honesto ajuda o recrutador a entender para qual vaga você está se candidatando — sem frases genéricas.",
    "seoTitle": "Objetivo profissional no currículo: como escrever",
    "metaDescription": "Aprenda a escrever um objetivo profissional objetivo, com exemplos práticos e erros comuns a evitar.",
    "primaryKeyword": "objetivo profissional curriculo",
    "searchIntent": "INFORMATIONAL",
    "section": "curriculo",
    "tags": [
      "curriculo",
      "primeiro-emprego",
      "carreira"
    ],
    "clusterHint": "Currículo",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Pessoa jovem organizando anotações ao lado de um notebook para montar o currículo",
    "coverImageCaption": "Ilustração editorial: preparação de objetivo profissional",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Editorial realistic photo, young adult at desk with notebook and paper checklist, soft window light, no text/logos",
    "localHook": "Útil para quem candidata em processos de varejo, clínicas e serviços na capital e no interior do MA.",
    "audience": "Candidatos iniciantes e em transição",
    "directAnswer": "Escreva uma frase com cargo-alvo + tipo de oportunidade + uma prova curta do que você oferece — sem clichês como “em busca de crescimento”.",
    "candidateCta": "Revise também o guia de currículo ATS e o checklist de primeiro emprego.",
    "relatedSlugs": [
      "curriculo-ats-palavras-chave-sao-luis",
      "primeiro-emprego-sao-luis-checklist"
    ],
    "aiAssisted": true,
    "publishPlan": "PUBLISH_NOW",
    "scheduleDayOffset": 0,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Evergreen. Fonte institucional ok (orientação prática, não legislação)."
  }),
  withBody({
    "slug": "perguntas-comuns-entrevista-emprego",
    "type": "GUIDE",
    "title": "Perguntas comuns em entrevista de emprego (e como responder)",
    "subtitle": "Prepare respostas curtas com situação, ação e resultado",
    "excerpt": "Liste das perguntas mais frequentes em entrevistas e um método simples para responder sem decorar texto robótico.",
    "seoTitle": "Perguntas comuns em entrevista de emprego",
    "metaDescription": "Veja perguntas frequentes de entrevista e um roteiro prático para responder com clareza e exemplos reais.",
    "primaryKeyword": "perguntas comuns entrevista emprego",
    "searchIntent": "INFORMATIONAL",
    "section": "entrevistas",
    "tags": [
      "entrevista",
      "carreira",
      "primeiro-emprego"
    ],
    "clusterHint": "Entrevistas",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Candidato e recrutador conversando em entrevista profissional em escritório",
    "coverImageCaption": "Ilustração editorial: entrevista de emprego",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Two people in office interview across desk, natural light, no text/logos",
    "localHook": "Serve para entrevistas presenciais e por vídeo em processos locais de atendimento, operação e administrativo.",
    "audience": "Candidatos em seleção",
    "directAnswer": "Ensaie 5–7 respostas curtas com situação, ação e resultado; não decore discurso — pratique em voz alta.",
    "candidateCta": "Combine com o guia de entrevista comportamental e segurança do candidato.",
    "relatedSlugs": [
      "entrevista-comportamental-exemplos",
      "entrevista-por-video-emprego",
      "golpe-vaga-emprego-sao-luis"
    ],
    "aiAssisted": true,
    "publishPlan": "PUBLISH_NOW",
    "scheduleDayOffset": 0,
    "scheduleTimeLocal": "11:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Evergreen prático; sem afirmações legais."
  }),
  withBody({
    "slug": "pesquisar-empresa-antes-entrevista",
    "type": "GUIDE",
    "title": "Como pesquisar uma empresa antes da entrevista",
    "subtitle": "O que verificar em 20 minutos sem inventar história",
    "excerpt": "Checklist rápido para pesquisar a empresa antes da entrevista: o que faz, canais oficiais, tom do anúncio e sinais de alerta.",
    "seoTitle": "Como pesquisar empresa antes da entrevista",
    "metaDescription": "Checklist prático para pesquisar a empresa antes da entrevista e chegar preparado — sem informações inventadas.",
    "primaryKeyword": "pesquisar empresa antes entrevista",
    "searchIntent": "INFORMATIONAL",
    "section": "entrevistas",
    "tags": [
      "entrevista",
      "seguranca",
      "carreira"
    ],
    "clusterHint": "Entrevistas",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Segurança do candidato — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/seguranca-candidatos"
      }
    ],
    "coverImageAlt": "Pessoa pesquisando informações de uma empresa no notebook antes de uma entrevista",
    "coverImageCaption": "Ilustração editorial: pesquisa pré-entrevista",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Young adult researching on laptop with notebook, focused, no readable screen text",
    "localHook": "Ajuda a filtrar processos improvisados e a preparar perguntas úteis em seleções locais.",
    "audience": "Candidatos em processo seletivo",
    "directAnswer": "Em 20 minutos: confirme o que a empresa faz, o canal oficial do contato, o endereço/horário da entrevista e se o anúncio pede pagamento — se pedir, pare.",
    "candidateCta": "Use junto com o guia de golpes e a página de segurança.",
    "relatedSlugs": [
      "golpe-vaga-emprego-sao-luis",
      "perguntas-comuns-entrevista-emprego"
    ],
    "aiAssisted": true,
    "publishPlan": "SCHEDULE_DAY",
    "scheduleDayOffset": 1,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Liga forte com segurança; não inventar dados de empresas."
  }),
  withBody({
    "slug": "acompanhar-candidatura-emprego",
    "type": "GUIDE",
    "title": "Como acompanhar uma candidatura sem insistir demais",
    "subtitle": "Registro simples, prazo razoável e mensagem curta",
    "excerpt": "Organize candidaturas em uma planilha simples e saiba quando e como pedir retorno sem parecer spam.",
    "seoTitle": "Como acompanhar candidatura de emprego",
    "metaDescription": "Método prático para acompanhar candidaturas: registro, prazos e modelo de mensagem de follow-up.",
    "primaryKeyword": "acompanhar candidatura emprego",
    "searchIntent": "INFORMATIONAL",
    "section": "candidatura",
    "tags": [
      "candidatura",
      "carreira",
      "organizacao"
    ],
    "clusterHint": "Carreira",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Pessoa organizando agenda e anotações para acompanhar candidaturas de emprego",
    "coverImageCaption": "Ilustração editorial: acompanhamento de candidaturas",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Person with notebook tracker and phone calendar, morning light, no readable text",
    "localHook": "Útil quando você se candidata a várias vagas na mesma semana e precisa lembrar canais e datas.",
    "audience": "Candidatos ativos",
    "directAnswer": "Anote data, empresa, canal e status; espere o prazo informado (ou ~5–7 dias úteis) e envie um follow-up curto e educado.",
    "candidateCta": "Combine com organização da busca e segurança contra golpes.",
    "relatedSlugs": [
      "produtividade-busca-emprego-sao-luis",
      "organizar-busca-emprego"
    ],
    "aiAssisted": true,
    "publishPlan": "SCHEDULE_DAY",
    "scheduleDayOffset": 2,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Evergreen operacional."
  }),
  withBody({
    "slug": "linkedin-primeiro-emprego",
    "type": "GUIDE",
    "title": "Como usar o LinkedIn no primeiro emprego",
    "subtitle": "Perfil honesto, headline clara e networking sem spam",
    "excerpt": "Guia para quem está começando: o que colocar no LinkedIn sem inventar experiência e como pedir indicação com respeito.",
    "seoTitle": "LinkedIn para o primeiro emprego",
    "metaDescription": "Monte um LinkedIn útil no primeiro emprego: headline, experiências honestas e mensagens curtas sem spam.",
    "primaryKeyword": "linkedin primeiro emprego",
    "searchIntent": "INFORMATIONAL",
    "section": "primeiro-emprego",
    "tags": [
      "linkedin",
      "primeiro-emprego",
      "curriculo"
    ],
    "clusterHint": "Primeiro emprego",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Jovem adulto montando perfil profissional em notebook para busca do primeiro emprego",
    "coverImageCaption": "Ilustração editorial: LinkedIn para iniciantes",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Young adult creating professional profile on laptop, clean desk, no UI text/logos",
    "localHook": "Complementa o perfil local: use o mesmo nome e telefone do currículo enviado em São Luís/MA.",
    "audience": "Iniciantes",
    "directAnswer": "Headline com cargo-alvo, sobre com provas honestas (estágio, voluntariado, comércio) e mensagens curtas pedindo conversa — não “vaga urgente”.",
    "candidateCta": "Alinhe LinkedIn ao PDF e ao checklist de primeiro emprego.",
    "relatedSlugs": [
      "linkedin-emprego-sao-luis-perfil",
      "primeiro-emprego-sao-luis-checklist",
      "objetivo-profissional-curriculo"
    ],
    "aiAssisted": true,
    "publishPlan": "SCHEDULE_DAY",
    "scheduleDayOffset": 3,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Não confundir com guia LinkedIn já existente (perfil SLZ); foco 1º emprego."
  }),
  withBody({
    "slug": "jovem-aprendiz-como-funciona",
    "type": "GUIDE",
    "title": "Jovem Aprendiz: como funciona (guia prático)",
    "subtitle": "O que é o contrato de aprendizagem e o que conferir na prática",
    "excerpt": "Explicação prática sobre Jovem Aprendiz, com remissão à legislação oficial. Confirme sempre regras atuais em fontes do governo.",
    "seoTitle": "Jovem Aprendiz: como funciona",
    "metaDescription": "Entenda o básico do Jovem Aprendiz e onde consultar a regra oficial. Guia prático para candidatos e famílias.",
    "primaryKeyword": "jovem aprendiz como funciona",
    "searchIntent": "INFORMATIONAL",
    "section": "jovem-aprendiz",
    "tags": [
      "jovem-aprendiz",
      "primeiro-emprego",
      "direitos"
    ],
    "clusterHint": "Jovem Aprendiz",
    "pillarHint": "Carreira",
    "sourceName": "Lei do Aprendiz (Lei 10.097/2000) — Planalto",
    "sourceUrl": "https://www.planalto.gov.br/ccivil_03/leis/l10097.htm",
    "sources": [
      {
        "name": "Lei nº 10.097/2000 (Planalto)",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/l10097.htm"
      },
      {
        "name": "Ministério do Trabalho e Emprego",
        "url": "https://www.gov.br/trabalho-e-emprego/pt-br"
      }
    ],
    "coverImageAlt": "Jovem em ambiente de trabalho aprendendo com supervisão em atividade profissional",
    "coverImageCaption": "Ilustração editorial: aprendizagem profissional",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Young apprentice learning with supervisor in workplace, daylight, no logos/text",
    "localHook": "Candidatos no MA devem confirmar idade, escolaridade e vaga com a empresa e a instituição de ensino parceira.",
    "audience": "Jovens e responsáveis",
    "directAnswer": "Jovem Aprendiz é contrato de aprendizagem previsto em lei: combine trabalho e formação. Confira idade, curso e condições no anúncio e nas fontes oficiais.",
    "candidateCta": "Compare com estágio e prepare documentos de admissão.",
    "relatedSlugs": [
      "estagio-x-jovem-aprendiz",
      "documentos-admissao-emprego-maranhao",
      "primeiro-emprego-sao-luis-checklist"
    ],
    "aiAssisted": true,
    "publishPlan": "HOLD_REVIEW",
    "scheduleDayOffset": null,
    "scheduleTimeLocal": null,
    "editorialStage": "FACT_REVIEW",
    "internalNotes": "Factual: fontes oficiais. Não inventar cotas/%; orientar consulta ao gov.br/planalto. | HOLD: exige revisão humana factual antes de publicar/agendar. Fontes Planalto validadas por URL; não marcar reviewedAt sem humano."
  }),
  withBody({
    "slug": "estagio-x-jovem-aprendiz",
    "type": "GUIDE",
    "title": "Estágio × Jovem Aprendiz: diferenças práticas",
    "subtitle": "Como não confundir os dois caminhos de início de carreira",
    "excerpt": "Compare estágio e Jovem Aprendiz em linguagem simples e saiba o que perguntar antes de aceitar. Consulte fontes oficiais para regras atuais.",
    "seoTitle": "Estágio ou Jovem Aprendiz: diferenças",
    "metaDescription": "Diferenças práticas entre estágio e Jovem Aprendiz, com links para bases legais oficiais.",
    "primaryKeyword": "estagio ou jovem aprendiz",
    "searchIntent": "INFORMATIONAL",
    "section": "jovem-aprendiz",
    "tags": [
      "estagio",
      "jovem-aprendiz",
      "primeiro-emprego"
    ],
    "clusterHint": "Jovem Aprendiz",
    "pillarHint": "Carreira",
    "sourceName": "Lei do Estágio (Lei 11.788/2008) — Planalto",
    "sourceUrl": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11788.htm",
    "sources": [
      {
        "name": "Lei nº 11.788/2008 — Estágio (Planalto)",
        "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11788.htm"
      },
      {
        "name": "Lei nº 10.097/2000 — Aprendiz (Planalto)",
        "url": "https://www.planalto.gov.br/ccivil_03/leis/l10097.htm"
      }
    ],
    "coverImageAlt": "Dois jovens em contextos profissionais distintos, sugerindo caminhos de estágio e aprendizagem",
    "coverImageCaption": "Ilustração editorial: caminhos de início de carreira",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Two young adults in different workplace contexts, natural light, no logos/text",
    "localHook": "Ajuda estudantes e famílias a escolher o caminho certo sem cair em anúncio confuso.",
    "audience": "Estudantes e iniciantes",
    "directAnswer": "Estágio e aprendizagem são regimes diferentes: verifique matrícula/curso, tipo de contrato e direitos no anúncio e na lei oficial.",
    "candidateCta": "Leia o guia do aprendiz e prepare documentos.",
    "relatedSlugs": [
      "jovem-aprendiz-como-funciona",
      "documentos-admissao-emprego-maranhao"
    ],
    "aiAssisted": true,
    "publishPlan": "HOLD_REVIEW",
    "scheduleDayOffset": null,
    "scheduleTimeLocal": null,
    "editorialStage": "FACT_REVIEW",
    "internalNotes": "Factual comparativo; remeter às leis oficiais sem inventar percentuais. | HOLD: exige revisão humana factual antes de publicar/agendar. Fontes Planalto validadas por URL; não marcar reviewedAt sem humano."
  }),
  withBody({
    "slug": "organizar-busca-emprego",
    "type": "GUIDE",
    "title": "Como organizar uma busca de emprego de verdade",
    "subtitle": "Rotina semanal, metas realistas e menos ansiedade",
    "excerpt": "Monte uma rotina semanal de busca de emprego com metas realistas, registro de candidaturas e revisão do que funciona.",
    "seoTitle": "Como organizar a busca de emprego",
    "metaDescription": "Rotina prática para organizar a busca de emprego: blocos de tempo, metas e revisão semanal.",
    "primaryKeyword": "organizar busca de emprego",
    "searchIntent": "INFORMATIONAL",
    "section": "carreira",
    "tags": [
      "organizacao",
      "candidatura",
      "carreira"
    ],
    "clusterHint": "Carreira",
    "pillarHint": "Carreira",
    "sourceName": "Orientação editorial Empregos São Luís",
    "sourceUrl": "https://empregossaoluis.com.br/politica-editorial",
    "sources": [
      {
        "name": "Política editorial — Empregos São Luís",
        "url": "https://empregossaoluis.com.br/politica-editorial"
      }
    ],
    "coverImageAlt": "Pessoa planejando a semana de busca de emprego com anotações em mesa organizada",
    "coverImageCaption": "Ilustração editorial: rotina de busca de emprego",
    "coverImageCredit": "Ilustração editorial Empregos São Luís",
    "coverImageWidth": 1280,
    "coverImageHeight": 720,
    "imagePrompt": "Person organizing weekly job search plan on tidy desk, daylight, no readable text",
    "localHook": "Funciona tanto para quem busca vagas na capital quanto no interior — o método é o mesmo.",
    "audience": "Candidatos ativos",
    "directAnswer": "Defina blocos curtos diários, meta de candidaturas bem lidas (não em massa) e uma revisão semanal do que gerou retorno.",
    "candidateCta": "Use com acompanhamento de candidatura e currículo atualizado.",
    "relatedSlugs": [
      "produtividade-busca-emprego-sao-luis",
      "acompanhar-candidatura-emprego",
      "objetivo-profissional-curriculo"
    ],
    "aiAssisted": true,
    "publishPlan": "SCHEDULE_DAY",
    "scheduleDayOffset": 4,
    "scheduleTimeLocal": "09:00",
    "editorialStage": "EDITORIAL_REVIEW",
    "internalNotes": "Evergreen; diferencia do guia de produtividade já existente pelo foco em sistema semanal."
  })
];

export function coverPathFor(slug) {
  return `${COVER_DIR}/${slug}.webp`;
}

export function isHoldReview(guide) {
  return guide.publishPlan === "HOLD_REVIEW" || guide.editorialStage === "FACT_REVIEW";
}
