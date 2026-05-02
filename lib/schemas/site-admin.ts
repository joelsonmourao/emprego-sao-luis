import { z } from "zod";

const navItemSchema = z.object({
  href: z.string(),
  label: z.string()
});

const contentCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  iconKey: z.string()
});

const actionCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  href: z.string(),
  iconKey: z.string()
});

const ctaSchema = z.object({
  label: z.string(),
  href: z.string()
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string()
});

const hubCopySchema = z.object({
  introTemplate: z.string(),
  faqTitle: z.string(),
  faqDescription: z.string(),
  faq: z.array(faqSchema)
});

const featuredCollectionSchema = z.object({
  stateSlugs: z.array(z.string()),
  citySlugs: z.array(z.string()),
  companySlugs: z.array(z.string()),
  postSlugs: z.array(z.string()),
  jobSlugs: z.array(z.string())
});

const blockToggleSchema = z.object({
  quickAccess: z.boolean(),
  featuredJobs: z.boolean(),
  blog: z.boolean(),
  howItWorks: z.boolean(),
  citiesAndBenefits: z.boolean(),
  careerCtas: z.boolean(),
  companies: z.boolean(),
  faq: z.boolean(),
  finalCta: z.boolean()
});

export const homeBlockKeys = [
  "quickAccess",
  "featuredJobs",
  "blog",
  "howItWorks",
  "citiesAndBenefits",
  "careerCtas",
  "companies",
  "faq",
  "finalCta"
] as const;

const homeBlockOrderSchema = z.array(z.enum(homeBlockKeys));

const pageContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  contentHtml: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string()
});

const consentBannerSchema = z.object({
  bannerEnabled: z.boolean(),
  title: z.string(),
  description: z.string(),
  policyHref: z.string(),
  acceptLabel: z.string(),
  rejectLabel: z.string(),
  manageLabel: z.string(),
  analyticsLabel: z.string(),
  advertisingLabel: z.string()
});

const googleIntegrationsSchema = z.object({
  consentModeEnabled: z.boolean(),
  analyticsEnabled: z.boolean(),
  ga4MeasurementId: z.string(),
  gtmContainerId: z.string(),
  searchConsoleVerification: z.string(),
  searchConsolePropertyUrl: z.string(),
  adsenseEnabled: z.boolean(),
  adsensePublisherId: z.string(),
  adsenseAutoAds: z.boolean(),
  adsTxtContent: z.string(),
  lookerStudioUrl: z.string(),
  ga4ReportsUrl: z.string(),
  searchConsoleReportsUrl: z.string()
});

export const siteContentSchema = z.object({
  navigation: z.object({
    topBarText: z.string(),
    topBarLinkLabel: z.string(),
    topBarLinkHref: z.string(),
    headerCtaLabel: z.string(),
    headerCtaHref: z.string(),
    main: z.array(navItemSchema)
  }),
  home: z.object({
    heroBadge: z.string(),
    heroTitle: z.string(),
    heroDescription: z.string(),
    searchHelperText: z.string(),
    primaryButton: ctaSchema,
    secondaryButton: ctaSchema,
    quickJobsEyebrow: z.string(),
    quickJobsTitle: z.string(),
    quickJobsDescription: z.string(),
    quickBlogEyebrow: z.string(),
    quickBlogTitle: z.string(),
    quickBlogDescription: z.string(),
    heroHighlights: z.array(actionCardSchema),
    featuredTitle: z.string(),
    featuredDescription: z.string(),
    blogTitle: z.string(),
    blogDescription: z.string(),
    citiesTitle: z.string(),
    citiesDescription: z.string(),
    benefitsTitle: z.string(),
    benefitsDescription: z.string(),
    companiesTitle: z.string(),
    companiesDescription: z.string(),
    faqTitle: z.string(),
    faqDescription: z.string(),
    finalCtaEyebrow: z.string(),
    finalCtaTitle: z.string(),
    finalCtaDescription: z.string(),
    blocks: blockToggleSchema,
    blockOrder: homeBlockOrderSchema,
    featured: featuredCollectionSchema,
    howItWorksSteps: z.array(contentCardSchema),
    benefits: z.array(contentCardSchema),
    careerCtas: z.array(actionCardSchema)
  }),
  faq: z.object({
    home: z.array(faqSchema)
  }),
  hubContent: z.object({
    state: hubCopySchema,
    city: hubCopySchema,
    company: hubCopySchema
  }),
  pages: z.object({
    about: pageContentSchema,
    contact: pageContentSchema,
    privacy: pageContentSchema,
    cookies: pageContentSchema,
    terms: pageContentSchema
  }),
  footer: z.object({
    navigationTitle: z.string(),
    informationTitle: z.string(),
    shortcutsTitle: z.string(),
    description: z.string(),
    copyrightText: z.string(),
    shortcuts: z.array(contentCardSchema)
  })
});

const socialLinksSchema = z.object({
  instagram: z.string(),
  facebook: z.string(),
  linkedin: z.string(),
  youtube: z.string(),
  tiktok: z.string()
});

export const siteSettingsSchema = z.object({
  siteName: z.string(),
  legalName: z.string(),
  shortDescription: z.string(),
  logoUrl: z.string(),
  logoCompactUrl: z.string(),
  faviconUrl: z.string(),
  defaultSocialImageUrl: z.string(),
  email: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  socialLinks: socialLinksSchema,
  defaultOgAlt: z.string(),
  supportText: z.string(),
  consentBanner: consentBannerSchema,
  google: googleIntegrationsSchema
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type SiteFaqEntry = z.infer<typeof faqSchema>;

export const defaultSiteContent: SiteContent = {
  navigation: {
    topBarText: "Vagas e dicas para quem está buscando o primeiro emprego",
    topBarLinkLabel: "Ler dicas do blog",
    topBarLinkHref: "/blog",
    headerCtaLabel: "Buscar vagas",
    headerCtaHref: "/busca",
    main: [
      { href: "/vagas", label: "Vagas" },
      { href: "/cidades", label: "Cidades" },
      { href: "/empresas", label: "Empresas" },
      { href: "/blog", label: "Blog" },
      { href: "/sobre", label: "Sobre" },
      { href: "/contato", label: "Contato" }
    ]
  },
  home: {
    heroBadge: "Portal de vagas para primeiro emprego",
    heroTitle: "Encontre vagas de Jovem Aprendiz por cargo, estado e cidade.",
    heroDescription: "Busque oportunidades, navegue por vagas em destaque e acesse o blog com orientações de currículo, entrevista e primeiro emprego.",
    searchHelperText: "Pesquise por cargo, cidade e estado para chegar mais rápido nas vagas.",
    primaryButton: {
      label: "Ver vagas",
      href: "/vagas"
    },
    secondaryButton: {
      label: "Acessar blog",
      href: "/blog"
    },
    quickJobsEyebrow: "Acesso rapido",
    quickJobsTitle: "Ver vagas",
    quickJobsDescription: "Entre direto na lista principal e filtre por cidade e estado da vaga.",
    quickBlogEyebrow: "Acesso rapido",
    quickBlogTitle: "Acessar blog",
    quickBlogDescription: "Veja dicas de currículo, entrevista e primeiro emprego para se preparar melhor.",
    heroHighlights: [
      {
        title: "Ver vagas agora",
        description: "Entre direto nas listagens com filtros por cidade, estado e empresa.",
        href: "/vagas",
        iconKey: "briefcase"
      },
      {
        title: "Ir para o blog",
        description: "Leia dicas de curriculo, entrevista e primeiros passos no mercado.",
        href: "/blog",
        iconKey: "file-text"
      },
      {
        title: "Buscar por cidade",
        description: "Descubra em quais cidades estao aparecendo mais vagas perto de voce.",
        href: "/cidades",
        iconKey: "compass"
      },
      {
        title: "Empresas que contratam",
        description: "Acompanhe empresas com vagas abertas para Jovem Aprendiz no portal.",
        href: "/empresas",
        iconKey: "handshake"
      }
    ],
    featuredTitle: "Comece pelas oportunidades mais relevantes",
    featuredDescription: "As vagas aparecem logo no inicio para voce encontrar oportunidades sem precisar rolar demais.",
    blogTitle: "Conteudos para curriculo, entrevista e primeiro emprego",
    blogDescription: "O blog fica separado das vagas para voce saber quando esta lendo dicas e quando esta vendo oportunidades.",
    citiesTitle: "Navegue por cidade e estado",
    citiesDescription: "Escolha a localidade que faz sentido para sua rotina e veja oportunidades mais perto de voce.",
    benefitsTitle: "Por que o Jovem Aprendiz vale a pena",
    benefitsDescription: "O programa pode abrir a porta do primeiro emprego com experiencia real, aprendizado e chance de crescimento.",
    companiesTitle: "Empresas com vagas para acompanhar",
    companiesDescription: "Veja empresas que costumam abrir oportunidades e acompanhe as publicacoes mais recentes.",
    faqTitle: "Duvidas frequentes sobre Jovem Aprendiz",
    faqDescription: "Respostas curtas para ajudar na busca por vaga, curriculo e primeiro emprego.",
    finalCtaEyebrow: "Proximo passo",
    finalCtaTitle: "Entre pelas vagas ou continue pelo blog",
    finalCtaDescription: "Escolha o caminho que faz mais sentido agora: buscar vagas ou ler dicas para se preparar melhor.",
    blocks: {
      quickAccess: true,
      featuredJobs: true,
      blog: true,
      howItWorks: true,
      citiesAndBenefits: true,
      careerCtas: true,
      companies: true,
      faq: true,
      finalCta: true
    },
    blockOrder: [
      "quickAccess",
      "featuredJobs",
      "blog",
      "howItWorks",
      "citiesAndBenefits",
      "careerCtas",
      "companies",
      "faq",
      "finalCta"
    ],
    featured: {
      stateSlugs: [],
      citySlugs: [],
      companySlugs: [],
      postSlugs: [],
      jobSlugs: []
    },
    howItWorksSteps: [
      {
        title: "Busque por cidade e estado",
        description: "Encontre oportunidades por estado, cidade e empresa de forma simples.",
        iconKey: "compass"
      },
      {
        title: "Leia os detalhes da vaga",
        description: "Veja rotina, requisitos, beneficios e o link oficial para candidatura.",
        iconKey: "file-text"
      },
      {
        title: "Se prepare melhor",
        description: "Use as dicas do blog para curriculo, entrevista e primeiro emprego.",
        iconKey: "messages"
      }
    ],
    benefits: [
      {
        title: "Primeiro emprego com carteira",
        description: "Entrada mais segura no mercado formal, com jornada adaptada e aprendizado estruturado.",
        iconKey: "briefcase"
      },
      {
        title: "Capacitacao pratica",
        description: "Experiencia real em empresas, com rotina profissional e acompanhamento.",
        iconKey: "graduation"
      },
      {
        title: "Crescimento de carreira",
        description: "Base ideal para construir experiencia, networking e o proximo passo profissional.",
        iconKey: "trending"
      }
    ],
    careerCtas: [
      {
        title: "Curriculo para primeiro emprego",
        description: "Veja como montar um curriculo simples, claro e honesto para comecar bem.",
        href: "/blog",
        iconKey: "file-text"
      },
      {
        title: "Como ir bem na entrevista",
        description: "Entenda como se apresentar melhor e responder perguntas com mais seguranca.",
        href: "/blog",
        iconKey: "handshake"
      },
      {
        title: "Primeiro emprego com mais foco",
        description: "Navegue por cidades e empresas com mais chances de abrir oportunidades.",
        href: "/vagas",
        iconKey: "target"
      }
    ]
  },
  faq: {
    home: [
      {
        question: "O que e uma vaga de Jovem Aprendiz?",
        answer: "E uma oportunidade de primeiro emprego com jornada reduzida, aprendizado pratico e contrato formal."
      },
      {
        question: "Posso me candidatar sem experiencia?",
        answer: "Sim. O programa existe justamente para quem esta entrando no mercado de trabalho."
      },
      {
        question: "As vagas sao atualizadas com frequencia?",
        answer: "Sim. O portal pode receber novas vagas com frequencia, por cidade, empresa e estado."
      },
      {
        question: "Como conseguir a primeira vaga de Jovem Aprendiz mais rapido?",
        answer: "Vale montar um curriculo simples, acompanhar as vagas da sua cidade com frequencia e ler as dicas do blog para entrevista e candidatura."
      },
      {
        question: "Quais empresas costumam contratar Jovem Aprendiz na minha cidade?",
        answer: "As paginas de cidade e empresa ajudam a descobrir onde aparecem mais vagas, quais companhias contratam com frequencia e quais links vale acompanhar primeiro."
      },
      {
        question: "Onde encontrar vagas de Jovem Aprendiz perto de mim?",
        answer: "Use a busca por cargo, estado e cidade para encontrar vagas mais proximas e depois acompanhe as paginas de empresa e o blog para se preparar melhor."
      },
      {
        question: "O que colocar no curriculo para Jovem Aprendiz?",
        answer: "O ideal e mostrar dados corretos, escolaridade, cursos, disponibilidade e atividades que demonstrem responsabilidade. O blog do portal traz orientacoes praticas para isso."
      },
      {
        question: "Como se sair melhor na entrevista de Jovem Aprendiz?",
        answer: "Vale estudar a vaga, treinar respostas simples e honestas, chegar no horario e mostrar vontade de aprender. Pequenos cuidados fazem muita diferenca."
      }
    ]
  },
  hubContent: {
    state: {
      introTemplate:
        "Veja cidades e vagas de Jovem Aprendiz em {{stateName}}. Hoje o portal mostra {{totalJobs}} oportunidade(s) ligadas a este estado.",
      faqTitle: "Perguntas frequentes sobre Jovem Aprendiz em {{stateName}}",
      faqDescription: "Respostas curtas para ajudar quem esta procurando a primeira vaga no estado.",
      faq: [
        {
          question: "Como encontrar vagas de Jovem Aprendiz em {{stateName}}?",
          answer:
            "O melhor caminho e navegar pelas cidades do estado, comparar as empresas que mais publicam vagas e acompanhar as oportunidades mais recentes."
        },
        {
          question: "Vale buscar por cidade dentro de {{stateName}}?",
          answer:
            "Sim. Quando voce entra na cidade, a busca fica mais clara e ajuda a ver vagas mais proximas da sua rotina."
        },
        {
          question: "O que ajuda a conseguir a primeira vaga em {{stateName}}?",
          answer:
            "Curriculo simples, disponibilidade organizada e leitura atenta da vaga costumam fazer diferenca na candidatura."
        }
      ]
    },
    city: {
      introTemplate:
        "Veja vagas de Jovem Aprendiz em {{cityName}}, {{stateCode}}, com foco nas oportunidades que fazem sentido para quem busca o primeiro emprego em {{stateName}}. Hoje temos {{totalJobs}} vaga(s) nesta pagina.",
      faqTitle: "Perguntas frequentes sobre Jovem Aprendiz em {{cityName}}",
      faqDescription: "Informacoes uteis para quem quer encontrar uma vaga mais perto de casa.",
      faq: [
        {
          question: "Como conseguir vaga de Jovem Aprendiz em {{cityName}}, {{stateCode}}?",
          answer:
            "Vale acompanhar as vagas mais novas, ver as empresas que costumam contratar e ler as orientacoes antes de se candidatar."
        },
        {
          question: "Quais tipos de vaga costumam aparecer mais em {{cityName}}?",
          answer:
            "Atendimento, administrativo, operacoes, vendas e suporte costumam abrir espaco para quem esta comecando."
        },
        {
          question: "Esta pagina ajuda quem procura o primeiro emprego?",
          answer:
            "Sim. Ela junta vagas locais, links relacionados e conteudos que ajudam voce a se preparar melhor."
        }
      ]
    },
    company: {
      introTemplate:
        "{{companyName}} aparece nesta pagina com vagas de Jovem Aprendiz e informacoes para quem quer acompanhar novas oportunidades. Hoje existem {{totalJobs}} vaga(s) relacionada(s) a essa empresa no portal.",
      faqTitle: "Perguntas frequentes sobre vagas na {{companyName}}",
      faqDescription: "Respostas curtas para ajudar antes de se candidatar.",
      faq: [
        {
          question: "Como acompanhar vagas de Jovem Aprendiz na {{companyName}}?",
          answer:
            "Vale salvar esta pagina, acompanhar as novas publicacoes e visitar tambem as cidades onde a empresa costuma abrir oportunidades."
        },
        {
          question: "Por que existe uma pagina por empresa?",
          answer:
            "Porque assim voce consegue ver as vagas reunidas, entender o perfil das oportunidades e navegar sem depender de busca solta."
        },
        {
          question: "O que fazer antes de se candidatar na {{companyName}}?",
          answer:
            "Revisar requisitos, atualizar o curriculo e confirmar o link oficial de candidatura ajuda a evitar erros."
        }
      ]
    }
  },
  pages: {
    about: {
      title: "Um portal para organizar a busca por vagas de Jovem Aprendiz",
      description: "O Jovem Aprendiz Vagas ajuda a reunir oportunidades, empresas e orientacoes praticas para quem esta entrando no mercado de trabalho.",
      contentHtml:
        "<p>O Jovem Aprendiz Vagas existe para facilitar uma etapa que costuma ser cansativa: encontrar oportunidades reais de primeiro emprego sem precisar se perder entre paginas confusas, links soltos e filtros que nao ajudam.</p><h2>O que o portal faz</h2><p>Nosso trabalho e reunir e organizar vagas de Jovem Aprendiz por cidade, estado e empresa, deixando a busca mais clara para quem quer entrar no mercado de trabalho com mais foco.</p><h2>Para quem o portal foi criado</h2><p>O portal foi pensado para jovens em busca da primeira oportunidade, familias que ajudam nesse processo e tambem empresas que querem aparecer de forma mais organizada para quem esta procurando vaga.</p><h2>Como a plataforma ajuda</h2><p>Aqui voce encontra listagens de vagas, paginas de empresas, hubs por localidade e conteudos do blog com orientacoes sobre curriculo, candidatura e entrevista. A ideia e economizar tempo e deixar o caminho mais simples.</p><h2>Nosso compromisso</h2><p>Queremos que o portal seja util de verdade: com leitura facil no celular, informacoes claras, navegacao objetiva e uma experiencia confiavel para quem esta comparando oportunidades.</p>",
      seoTitle: "Sobre o portal Jovem Aprendiz Vagas",
      seoDescription: "Entenda como o Jovem Aprendiz Vagas organiza oportunidades, empresas e conteudos para ajudar na busca pelo primeiro emprego."
    },
    contact: {
      title: "Fale com a equipe do portal",
      description: "Use esta pagina para tirar duvidas, avisar sobre algum problema no site ou falar sobre vagas, empresas e conteudo publicado.",
      contentHtml:
        "<p>Se voce encontrou um erro em alguma pagina, percebeu link quebrado, quer sugerir melhoria ou precisa falar com a equipe do portal, este e o melhor ponto de contato.</p><h2>Quando vale falar com a gente</h2><ul><li>Para avisar sobre informacoes desatualizadas em vagas ou empresas</li><li>Para relatar problema de navegacao, busca ou candidatura</li><li>Para sugerir novos conteudos do blog e temas que ajudem quem busca o primeiro emprego</li><li>Para assuntos institucionais, parcerias e atualizacao de dados de empresa</li></ul><h2>Como funciona o atendimento</h2><p>Os canais exibidos nesta pagina sao definidos nas configuracoes do portal. Quando houver e-mail, telefone ou WhatsApp cadastrados, eles aparecem aqui para facilitar o contato direto.</p>",
      seoTitle: "Contato | Jovem Aprendiz Vagas",
      seoDescription: "Veja como entrar em contato com a equipe do Jovem Aprendiz Vagas para suporte, correcao de informacoes e assuntos institucionais."
    },
    privacy: {
      title: "Politica de Privacidade",
      description: "Entenda quais dados podem ser tratados no portal, em quais situacoes isso acontece e quais escolhas o usuario pode fazer.",
      contentHtml:
        "<p>Esta Politica de Privacidade explica como o Jovem Aprendiz Vagas pode tratar dados pessoais e informacoes de navegacao durante o uso do portal.</p><h2>Quais dados podem ser coletados</h2><p>O portal pode tratar dados informados em contatos enviados voluntariamente, dados tecnicos de navegacao, preferencias de cookies e informacoes ligadas ao uso do admin quando houver acesso autenticado.</p><h2>Quando isso acontece</h2><p>Esse tratamento pode acontecer quando voce navega pelo site, utiliza a busca, interage com o banner de cookies, acessa paginas estrategicas, entra em contato pelos canais exibidos no portal ou, no caso da equipe interna, faz login no painel administrativo.</p><h2>Para que essas informacoes podem ser usadas</h2><ul><li>Manter o portal funcionando com seguranca</li><li>Melhorar paginas, busca, filtros e navegacao</li><li>Entender desempenho do site quando houver consentimento para medicao</li><li>Responder contatos enviados pelos canais do portal</li><li>Proteger o painel administrativo e registrar acoes internas basicas</li></ul><h2>Compartilhamento e terceiros</h2><p>O portal pode usar servicos de terceiros para medicao, verificacao e publicidade, como ferramentas do Google, sempre de acordo com as configuracoes ativas e com o consentimento aplicavel. As candidaturas podem levar o usuario para paginas externas da empresa anunciante ou da fonte da vaga.</p><h2>Armazenamento e seguranca</h2><p>Adotamos medidas tecnicas para proteger o acesso ao admin, reduzir exposicao desnecessaria de dados e limitar o tratamento ao que faz sentido para o funcionamento do portal. Ainda assim, nenhum ambiente online pode prometer risco zero.</p><h2>Direitos do usuario</h2><p>Voce pode pedir esclarecimentos sobre dados enviados voluntariamente, solicitar atualizacao de informacoes de contato e revisar suas preferencias de cookies a qualquer momento pelo controle exibido no site.</p>",
      seoTitle: "Politica de Privacidade | Jovem Aprendiz Vagas",
      seoDescription: "Saiba quais dados podem ser tratados no portal, para que servem, quando isso acontece e como a privacidade do usuario e respeitada."
    },
    cookies: {
      title: "Politica de Cookies",
      description: "Veja quais cookies podem ser usados no portal, para que servem e como aceitar, recusar ou ajustar suas preferencias.",
      contentHtml:
        "<p>O Jovem Aprendiz Vagas usa cookies e tecnologias semelhantes para manter o portal funcionando, lembrar escolhas de privacidade e, quando houver consentimento, apoiar medicao e publicidade.</p><h2>Cookies necessarios</h2><p>Sao os cookies ligados ao funcionamento basico do site, como seguranca, manutencao da sessao administrativa e armazenamento da escolha de consentimento. Eles nao podem ser desligados porque fazem parte da operacao essencial do portal.</p><h2>Cookies analiticos</h2><p>Quando a medicao estiver ativa e o usuario autorizar, esses cookies ajudam a entender quais paginas recebem mais acesso, quais buscas sao mais usadas e como melhorar a experiencia geral do portal.</p><h2>Cookies de marketing e publicidade</h2><p>Quando o portal usar publicidade e o usuario permitir, esses cookies podem apoiar a entrega e a medicao de anuncios. Se publicidade nao estiver ativa, essa categoria permanece apenas como estrutura preparada para uso futuro.</p><h2>Como gerenciar preferencias</h2><p>No primeiro acesso, o portal mostra um banner para aceitar, recusar ou personalizar as categorias opcionais. Depois da escolha, o controle continua disponivel para reabrir as preferencias quando voce quiser.</p><h2>Ferramentas de terceiros</h2><p>Quando configuradas, integracoes como Google Analytics, Tag Manager e AdSense so devem ser carregadas conforme as regras de consentimento definidas no portal.</p>",
      seoTitle: "Politica de Cookies | Jovem Aprendiz Vagas",
      seoDescription: "Entenda como o portal trata cookies necessarios, analiticos e de publicidade, e veja como ajustar suas preferencias."
    },
    terms: {
      title: "Termos de Uso",
      description: "Conheca as regras gerais de uso do portal, as responsabilidades do usuario e os limites de funcionamento da plataforma.",
      contentHtml:
        "<p>Estes Termos de Uso explicam as regras gerais para navegar, consultar vagas, acessar conteudos e utilizar os recursos do Jovem Aprendiz Vagas.</p><h2>Objetivo do portal</h2><p>O portal existe para reunir e organizar vagas de Jovem Aprendiz, empresas, cidades, estados e conteudos de apoio para quem busca o primeiro emprego.</p><h2>Uso permitido</h2><p>Voce pode usar o portal para pesquisar vagas, ler conteudos, comparar empresas e acompanhar paginas publicas de forma pessoal, informativa e licita.</p><h2>Responsabilidades do usuario</h2><ul><li>Usar informacoes verdadeiras quando houver envio voluntario de contato</li><li>Nao tentar acessar areas restritas sem autorizacao</li><li>Nao automatizar uso abusivo do site, nem copiar conteudo de forma indevida</li><li>Conferir as informacoes da vaga antes de enviar candidatura em site externo</li></ul><h2>Vagas e links externos</h2><p>O portal organiza oportunidades e pode direcionar o usuario para paginas de candidatura fora do dominio principal. O envio final da candidatura depende das regras e do funcionamento da empresa anunciante ou da fonte da vaga.</p><h2>Limites de responsabilidade</h2><p>Embora o portal trabalhe para manter as informacoes organizadas e claras, disponibilidade, prazos, salario, etapas de selecao e detalhes finais de candidatura podem mudar conforme a empresa ou a fonte original da vaga.</p><h2>Propriedade intelectual</h2><p>Marca, identidade visual, textos originais do portal, estrutura de navegacao e demais elementos proprios nao podem ser reproduzidos de forma indevida sem autorizacao.</p>",
      seoTitle: "Termos de Uso | Jovem Aprendiz Vagas",
      seoDescription: "Leia as regras gerais de uso do portal, entenda responsabilidades do usuario e veja como funcionam vagas, links externos e conteudos."
    }
  },
  footer: {
    navigationTitle: "Navegação",
    informationTitle: "Informações",
    shortcutsTitle: "Atalhos úteis",
    description: "Um portal feito para ajudar jovens a encontrar vagas, conhecer empresas e se preparar melhor para o primeiro emprego.",
    copyrightText: "© 2026 Jovem Aprendiz Vagas. Informações para quem está em busca do primeiro emprego.",
    shortcuts: [
      {
        title: "Buscar por cidade e estado",
        description: "Veja onde as oportunidades estão aparecendo mais perto de você.",
        iconKey: "compass"
      },
      {
        title: "Acompanhar empresas",
        description: "Descubra companhias que publicam vagas para Jovem Aprendiz com frequência.",
        iconKey: "handshake"
      },
      {
        title: "Ler dicas de currículo e entrevista",
        description: "Use o blog para se preparar melhor antes de se candidatar.",
        iconKey: "file-text"
      }
    ]
  }
};

export const defaultSiteSettings: SiteSettings = {
  siteName: "Jovem Aprendiz Vagas",
  legalName: "Jovem Aprendiz Vagas",
  shortDescription: "Vagas, cidades, empresas e dicas para quem está buscando o primeiro emprego como Jovem Aprendiz.",
  logoUrl: "/brand-logo.svg",
  logoCompactUrl: "/brand-mark.svg",
  faviconUrl: "/icon.svg",
  defaultSocialImageUrl: "/brand-logo.svg",
  email: "",
  phone: "",
  whatsapp: "",
  socialLinks: {
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    tiktok: ""
  },
  defaultOgAlt: "Jovem Aprendiz Vagas",
  supportText: "Use os canais desta página para relatar erros, pedir atualização de informações ou falar com a equipe responsável pelo portal.",
  consentBanner: {
    bannerEnabled: true,
    title: "Seu uso do portal pode ser mais bem ajustado com suas preferencias",
    description:
      "Usamos cookies necessários para o portal funcionar e, quando você autoriza, recursos de medição e publicidade para entender o desempenho das páginas e melhorar a experiência.",
    policyHref: "/politica-de-cookies",
    acceptLabel: "Aceitar",
    rejectLabel: "Recusar",
    manageLabel: "Gerenciar preferencias",
    analyticsLabel: "Cookies analiticos",
    advertisingLabel: "Cookies de marketing"
  },
  google: {
    consentModeEnabled: true,
    analyticsEnabled: false,
    ga4MeasurementId: "",
    gtmContainerId: "",
    searchConsoleVerification: "",
    searchConsolePropertyUrl: "",
    adsenseEnabled: false,
    adsensePublisherId: "",
    adsenseAutoAds: false,
    adsTxtContent: "",
    lookerStudioUrl: "",
    ga4ReportsUrl: "",
    searchConsoleReportsUrl: ""
  }
};
