import type { SiteContent } from "@/lib/schemas/site-admin";

/** Conteúdo padrão do portal Emprego São Luís (sem referências ao projeto anterior). */
export const empregoSaoLuisSiteContent: SiteContent = {
  navigation: {
    topBarText: "Conectando talentos às oportunidades de São Luís.",
    topBarLinkLabel: "Ver blog",
    topBarLinkHref: "/blog",
    headerCtaLabel: "Publicar vaga",
    headerCtaHref: "/anunciar-vaga",
    main: [
      { href: "/vagas", label: "Vagas" },
      { href: "/empresas", label: "Empresas" },
      { href: "/categorias", label: "Categorias" },
      { href: "/blog", label: "Blog" },
      { href: "/contato", label: "Contato" }
    ]
  },
  home: {
    heroBadge: "Emprego São Luís",
    heroTitle: "Encontre vagas de emprego em São Luís e no Maranhão",
    heroDescription:
      "O Emprego São Luís conecta candidatos a oportunidades divulgadas em São Luís, Região Metropolitana e cidades do Maranhão.",
    searchHelperText: "Pesquise por cargo ou palavra-chave e filtre por cidade.",
    primaryButton: { label: "Ver vagas disponíveis", href: "/vagas" },
    secondaryButton: { label: "Publicar uma vaga", href: "/anunciar-vaga" },
    quickJobsEyebrow: "Vagas",
    quickJobsTitle: "Ver vagas em São Luís e Maranhão",
    quickJobsDescription: "Acesse a listagem completa com filtros por cidade, categoria e empresa.",
    quickBlogEyebrow: "Blog",
    quickBlogTitle: "Dicas de emprego e carreira",
    quickBlogDescription: "Artigos sobre currículo, entrevista e mercado de trabalho no Maranhão.",
    heroHighlights: [
      { title: "Buscar vagas", description: "Filtre por cidade e categoria.", href: "/vagas", iconKey: "briefcase" },
      { title: "Ler o blog", description: "Conteúdos úteis para candidatos.", href: "/blog", iconKey: "file-text" },
      { title: "Vagas por cidade", description: "São Luís, Imperatriz, Timon e mais.", href: "/vagas/cidade/sao-luis", iconKey: "compass" },
      { title: "Empresas", description: "Veja quem está divulgando vagas.", href: "/empresas", iconKey: "handshake" }
    ],
    featuredTitle: "Vagas recentes",
    featuredDescription: "Oportunidades divulgadas recentemente no portal.",
    blogTitle: "Conteúdo útil para sua carreira",
    blogDescription: "Artigos sobre emprego, currículo e mercado de trabalho no Maranhão.",
    citiesTitle: "Cidades em destaque",
    citiesDescription: "Explore vagas nas principais cidades do Maranhão.",
    benefitsTitle: "Por que usar o Emprego São Luís",
    benefitsDescription: "Portal gratuito, focado em São Luís e Maranhão, com vagas organizadas por cidade e categoria.",
    companiesTitle: "Empresas que divulgam vagas",
    companiesDescription: "Acompanhe empresas com oportunidades publicadas no portal.",
    faqTitle: "Dúvidas frequentes",
    faqDescription: "Respostas sobre como usar o portal e se candidatar com segurança.",
    finalCtaEyebrow: "Para empresas",
    finalCtaTitle: "Sua empresa tem vagas abertas?",
    finalCtaDescription: "Divulgue oportunidades para candidatos de São Luís, Região Metropolitana e Maranhão.",
    blocks: {
      quickAccess: true,
      featuredJobs: true,
      blog: true,
      howItWorks: true,
      citiesAndBenefits: true,
      careerCtas: false,
      companies: true,
      faq: true,
      finalCta: true
    },
    blockOrder: ["quickAccess", "featuredJobs", "citiesAndBenefits", "howItWorks", "companies", "blog", "faq", "finalCta"],
    featured: { stateSlugs: [], citySlugs: [], companySlugs: [], postSlugs: [], jobSlugs: [] },
    howItWorksSteps: [
      { title: "Busque por cargo ou cidade", description: "Use os filtros para encontrar vagas relevantes.", iconKey: "compass" },
      { title: "Leia os detalhes", description: "Confira descrição, requisitos e link de candidatura.", iconKey: "file-text" },
      { title: "Candidate-se com segurança", description: "Acesse sempre o link oficial informado pela empresa.", iconKey: "messages" }
    ],
    benefits: [
      { title: "Vagas atualizadas", description: "Oportunidades reunidas e organizadas.", iconKey: "briefcase" },
      { title: "Gratuito para candidatos", description: "Consulte vagas e conteúdos sem custo.", iconKey: "graduation" },
      { title: "Foco regional", description: "Prioridade para São Luís e Maranhão.", iconKey: "trending" }
    ],
    careerCtas: []
  },
  faq: {
    home: [
      {
        question: "O Emprego São Luís contrata diretamente?",
        answer: "Não. O portal atua como divulgador de oportunidades. A contratação é de responsabilidade da empresa anunciante."
      },
      {
        question: "As vagas são gratuitas para candidatos?",
        answer: "Sim. Você pode buscar vagas, ler o blog e acessar links de candidatura sem pagar pelo portal."
      },
      {
        question: "Como me candidato a uma vaga?",
        answer: "Leia os detalhes da vaga e clique no botão de candidatura, que leva ao link oficial informado pela empresa."
      },
      {
        question: "Posso divulgar uma vaga da minha empresa?",
        answer: "Sim. Acesse a página Anunciar Vaga e envie as informações da oportunidade."
      }
    ]
  },
  hubContent: {
    state: {
      introTemplate: "Veja vagas de emprego em {{stateName}}. Hoje o portal mostra {{totalJobs}} oportunidade(s) neste estado.",
      faqTitle: "Perguntas frequentes sobre vagas em {{stateName}}",
      faqDescription: "Informações para quem busca emprego no Maranhão.",
      faq: [
        { question: "Como encontrar vagas em {{stateName}}?", answer: "Navegue por cidade e categoria para ver oportunidades mais perto de você." }
      ]
    },
    city: {
      introTemplate: "Veja vagas de emprego em {{cityName}}, {{stateCode}}. Hoje temos {{totalJobs}} vaga(s) nesta página.",
      faqTitle: "Perguntas frequentes sobre vagas em {{cityName}}",
      faqDescription: "Dicas para buscar oportunidades na cidade.",
      faq: [
        { question: "Como conseguir vaga em {{cityName}}?", answer: "Acompanhe as vagas mais recentes e candidate-se pelos links oficiais das empresas." }
      ]
    },
    company: {
      introTemplate: "{{companyName}} divulga vagas no Emprego São Luís. Hoje existem {{totalJobs}} vaga(s) relacionada(s).",
      faqTitle: "Perguntas sobre vagas na {{companyName}}",
      faqDescription: "Informações antes de se candidatar.",
      faq: [
        { question: "Como acompanhar vagas na {{companyName}}?", answer: "Salve esta página e acompanhe novas publicações no portal." }
      ]
    }
  },
  pages: {
    about: {
      title: "Sobre o Emprego São Luís",
      description: "Portal de vagas de emprego em São Luís e Maranhão.",
      contentHtml: "<p>O Emprego São Luís é um portal de divulgação de oportunidades de trabalho em São Luís, Região Metropolitana e cidades do Maranhão.</p>",
      seoTitle: "Sobre - Emprego São Luís",
      seoDescription: "Conheça o portal Emprego São Luís e como ele ajuda candidatos a encontrar vagas no Maranhão."
    },
    contact: {
      title: "Contato",
      description: "Fale com a equipe do Emprego São Luís.",
      contentHtml: "<p>Envie sua mensagem pelo formulário ou use os canais diretos.</p>",
      seoTitle: "Contato - Emprego São Luís",
      seoDescription: "Entre em contato com o Emprego São Luís."
    },
    privacy: {
      title: "Política de Privacidade",
      description: "Como tratamos seus dados.",
      contentHtml: "<p>Consulte a página /privacidade para o texto completo.</p>",
      seoTitle: "Política de Privacidade - Emprego São Luís",
      seoDescription: "Política de privacidade do Emprego São Luís."
    },
    cookies: {
      title: "Política de Cookies",
      description: "Como usamos cookies.",
      contentHtml: "<p>Consulte a página /cookies para o texto completo.</p>",
      seoTitle: "Política de Cookies - Emprego São Luís",
      seoDescription: "Política de cookies do Emprego São Luís."
    },
    terms: {
      title: "Termos de Uso",
      description: "Regras de uso do portal.",
      contentHtml: "<p>Consulte a página /termos para o texto completo.</p>",
      seoTitle: "Termos de Uso - Emprego São Luís",
      seoDescription: "Termos de uso do Emprego São Luís."
    }
  },
  footer: {
    navigationTitle: "Navegação",
    informationTitle: "Informações",
    shortcutsTitle: "Atalhos",
    description:
      "O Emprego São Luís divulga vagas de emprego em São Luís, Região Metropolitana e cidades do Maranhão, conectando candidatos a oportunidades reais.",
    copyrightText: "© Emprego São Luís. Portal de divulgação de vagas em São Luís e Maranhão.",
    shortcuts: [
      { title: "Vagas por cidade", description: "São Luís, Imperatriz, Timon e mais.", iconKey: "compass" },
      { title: "Anunciar vaga", description: "Divulgue oportunidades para candidatos da região.", iconKey: "handshake" },
      { title: "Blog", description: "Dicas de currículo, entrevista e carreira.", iconKey: "file-text" }
    ]
  }
};
