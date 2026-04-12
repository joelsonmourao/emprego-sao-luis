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
    featuredTitle: z.string(),
    featuredDescription: z.string(),
    blogTitle: z.string(),
    blogDescription: z.string(),
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
    description: z.string(),
    copyrightText: z.string()
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
    topBarText: "Vagas e dicas para quem esta buscando o primeiro emprego",
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
    heroDescription: "Busque oportunidades, navegue por vagas em destaque e acesse o blog com orientacoes de curriculo, entrevista e primeiro emprego.",
    searchHelperText: "Pesquise por cargo, cidade e estado para chegar mais rapido nas vagas.",
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
    quickBlogDescription: "Veja dicas de curriculo, entrevista e primeiro emprego para se preparar melhor.",
    featuredTitle: "Comece pelas oportunidades mais relevantes",
    featuredDescription: "As vagas aparecem logo no inicio para voce encontrar oportunidades sem precisar rolar demais.",
    blogTitle: "Conteudos para curriculo, entrevista e primeiro emprego",
    blogDescription: "O blog fica separado das vagas para voce saber quando esta lendo dicas e quando esta vendo oportunidades.",
    faqTitle: "Duvidas frequentes sobre Jovem Aprendiz",
    faqDescription: "Perguntas comuns para ajudar quem esta comecando a procurar vaga.",
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
      title: "Um portal feito para ajudar quem procura o primeiro emprego",
      description: "Reunimos vagas, dicas e caminhos mais simples para quem quer encontrar oportunidades de Jovem Aprendiz no Brasil.",
      contentHtml:
        "<p>O Jovem Aprendiz Vagas foi criado para facilitar a busca por oportunidades de primeiro emprego. Reunimos vagas, cidades, empresas e dicas praticas para ajudar voce a encontrar o caminho certo.</p>",
      seoTitle: "Sobre o Jovem Aprendiz Vagas",
      seoDescription: "Conheca o portal Jovem Aprendiz Vagas e entenda como ele ajuda na busca pelo primeiro emprego."
    },
    contact: {
      title: "Fale com a gente",
      description: "Se voce encontrou algum problema no site ou quer enviar uma sugestao, use esta pagina como ponto de contato.",
      contentHtml:
        "<p>Se voce encontrou algum erro, quer sugerir uma melhoria ou precisa falar com a equipe do portal, use os canais de contato informados nesta pagina.</p>",
      seoTitle: "Contato | Jovem Aprendiz Vagas",
      seoDescription: "Entre em contato com a equipe do Jovem Aprendiz Vagas."
    },
    privacy: {
      title: "Politica de Privacidade",
      description: "Saiba como os dados sao tratados no portal.",
      contentHtml:
        "<p>Esta pagina explica como o portal pode tratar dados de navegacao, formularios e contatos enviados pelos usuarios.</p>",
      seoTitle: "Politica de Privacidade | Jovem Aprendiz Vagas",
      seoDescription: "Entenda como o Jovem Aprendiz Vagas trata privacidade e dados dos usuarios."
    },
    cookies: {
      title: "Politica de Cookies",
      description: "Entenda como usamos cookies e como voce pode ajustar suas preferencias.",
      contentHtml:
        "<p>Usamos cookies essenciais para o funcionamento do portal e, quando voce permite, cookies de medicao e publicidade para melhorar a experiencia e entender o desempenho das paginas.</p><p>Voce pode revisar suas preferencias a qualquer momento no banner de cookies.</p>",
      seoTitle: "Politica de Cookies | Jovem Aprendiz Vagas",
      seoDescription: "Veja como o portal usa cookies essenciais, de medicao e de publicidade."
    },
    terms: {
      title: "Termos de Uso",
      description: "Regras basicas para uso do portal.",
      contentHtml:
        "<p>Ao usar o portal, voce concorda com as regras de navegacao, uso das informacoes e responsabilidade sobre candidaturas enviadas em sites externos.</p>",
      seoTitle: "Termos de Uso | Jovem Aprendiz Vagas",
      seoDescription: "Leia os termos de uso do portal Jovem Aprendiz Vagas."
    }
  },
  footer: {
    description: "Um portal feito para ajudar jovens a encontrar vagas e se preparar melhor para o primeiro emprego.",
    copyrightText: "© 2026 Jovem Aprendiz Vagas. Informacoes para quem esta em busca do primeiro emprego."
  }
};

export const defaultSiteSettings: SiteSettings = {
  siteName: "Jovem Aprendiz Vagas",
  legalName: "Jovem Aprendiz Vagas",
  shortDescription: "Vagas, cidades, empresas e dicas para quem esta buscando o primeiro emprego como Jovem Aprendiz.",
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
  supportText: "Precisa de ajuda? Fale com a equipe do portal.",
  consentBanner: {
    bannerEnabled: true,
    title: "Suas preferencias de privacidade",
    description:
      "Usamos cookies essenciais para o portal funcionar e, com a sua permissao, cookies de medicao e publicidade para entender o desempenho das paginas e manter o site no ar.",
    policyHref: "/politica-de-cookies",
    acceptLabel: "Aceitar tudo",
    rejectLabel: "Recusar opcionais",
    manageLabel: "Gerenciar preferencias",
    analyticsLabel: "Permitir Analytics",
    advertisingLabel: "Permitir publicidade"
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
