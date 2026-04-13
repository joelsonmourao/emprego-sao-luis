import { EmploymentType, LocationType, PrismaClient } from "@prisma/client";

import { hashPassword } from "@/lib/auth";
import { env } from "@/lib/env";
import { defaultSiteContent } from "@/lib/site-content";
import { defaultSiteSettings } from "@/lib/site-settings";

const prisma = new PrismaClient();

async function upsertState(data: { code: string; name: string; slug: string; seoTitle: string; seoIntro: string }) {
  return prisma.state.upsert({
    where: { code: data.code },
    update: data,
    create: data
  });
}

async function upsertCity(stateId: string, data: { name: string; slug: string; seoTitle: string; seoIntro: string }) {
  return prisma.city.upsert({
    where: { stateId_slug: { stateId, slug: data.slug } },
    update: data,
    create: { stateId, ...data }
  });
}

async function upsertCompany(data: {
  name: string;
  slug: string;
  summary: string;
  descriptionHtml: string;
  websiteUrl: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  stateId: string;
  cityId: string;
}) {
  return prisma.company.upsert({
    where: { slug: data.slug },
    update: data,
    create: data
  });
}

async function main() {
  const resetSiteContent = process.env.RESET_SITE_CONTENT === "1";

  const maranhao = await upsertState({
    code: "MA",
    name: "Maranhao",
    slug: "maranhao",
    seoTitle: "Vagas de Jovem Aprendiz no Maranhao",
    seoIntro: "Veja cidades e vagas de Jovem Aprendiz no Maranhao para encontrar oportunidades mais perto de voce."
  });
  const ceara = await upsertState({
    code: "CE",
    name: "Ceara",
    slug: "ceara",
    seoTitle: "Vagas de Jovem Aprendiz no Ceara",
    seoIntro: "Acompanhe vagas de Jovem Aprendiz no Ceara e navegue pelas cidades com mais oportunidades."
  });
  const saoPauloState = await upsertState({
    code: "SP",
    name: "Sao Paulo",
    slug: "sao-paulo",
    seoTitle: "Vagas de Jovem Aprendiz em Sao Paulo",
    seoIntro: "Veja vagas de Jovem Aprendiz em Sao Paulo e encontre cidades e empresas com mais movimento."
  });

  const saoLuis = await upsertCity(maranhao.id, {
    name: "Sao Luis",
    slug: "sao-luis",
    seoTitle: "Vagas de Jovem Aprendiz em Sao Luis",
    seoIntro: "Veja vagas de Jovem Aprendiz em Sao Luis, MA, e acompanhe oportunidades para o primeiro emprego."
  });
  const imperatriz = await upsertCity(maranhao.id, {
    name: "Imperatriz",
    slug: "imperatriz",
    seoTitle: "Vagas de Jovem Aprendiz em Imperatriz",
    seoIntro: "Acompanhe vagas de Jovem Aprendiz em Imperatriz e explore empresas com oportunidades na cidade."
  });
  const fortaleza = await upsertCity(ceara.id, {
    name: "Fortaleza",
    slug: "fortaleza",
    seoTitle: "Vagas de Jovem Aprendiz em Fortaleza",
    seoIntro: "Veja vagas de Jovem Aprendiz em Fortaleza, CE, com caminhos simples para continuar a busca por cidade e empresa."
  });
  const saoPauloCity = await upsertCity(saoPauloState.id, {
    name: "Sao Paulo",
    slug: "sao-paulo",
    seoTitle: "Vagas de Jovem Aprendiz em Sao Paulo, SP",
    seoIntro: "Encontre vagas de Jovem Aprendiz em Sao Paulo, SP, e navegue por empresas com mais oportunidades."
  });

  const companies = await Promise.all([
    upsertCompany({
      name: "Magazine Horizonte",
      slug: "magazine-horizonte",
      summary: "Rede varejista com vagas de atendimento e apoio de loja para quem busca o primeiro emprego.",
      descriptionHtml: "<p>A Magazine Horizonte publica vagas de Jovem Aprendiz em atendimento, loja e apoio operacional.</p>",
      websiteUrl: "https://example.com/magazine-horizonte",
      seoTitle: "Magazine Horizonte e vagas de Jovem Aprendiz",
      seoDescription: "Veja vagas de Jovem Aprendiz ligadas a Magazine Horizonte.",
      featured: true,
      stateId: maranhao.id,
      cityId: saoLuis.id
    }),
    upsertCompany({
      name: "Grupo Norte Servicos",
      slug: "grupo-norte-servicos",
      summary: "Empresa com oportunidades administrativas e rotinas de apoio para jovens em inicio de carreira.",
      descriptionHtml: "<p>O Grupo Norte Servicos abre espaco para vagas administrativas e apoio interno em Imperatriz.</p>",
      websiteUrl: "https://example.com/grupo-norte-servicos",
      seoTitle: "Grupo Norte Servicos e vagas de Jovem Aprendiz",
      seoDescription: "Veja vagas de Jovem Aprendiz ligadas ao Grupo Norte Servicos.",
      featured: true,
      stateId: maranhao.id,
      cityId: imperatriz.id
    }),
    upsertCompany({
      name: "Centro Log CE",
      slug: "centro-log-ce",
      summary: "Operacao logistica com oportunidades para jovens que querem aprender rotina de estoque e apoio operacional.",
      descriptionHtml: "<p>O Centro Log CE publica vagas de Jovem Aprendiz em logistica e apoio operacional.</p>",
      websiteUrl: "https://example.com/centro-log-ce",
      seoTitle: "Centro Log CE e vagas de Jovem Aprendiz",
      seoDescription: "Veja vagas de Jovem Aprendiz em logistica ligadas ao Centro Log CE.",
      featured: true,
      stateId: ceara.id,
      cityId: fortaleza.id
    }),
    upsertCompany({
      name: "Lojas Costa Azul",
      slug: "lojas-costa-azul",
      summary: "Rede de varejo com vagas em vendas e atendimento para quem esta entrando no mercado.",
      descriptionHtml: "<p>As Lojas Costa Azul contratam jovens para apoio de vendas, loja e atendimento.</p>",
      websiteUrl: "https://example.com/lojas-costa-azul",
      seoTitle: "Lojas Costa Azul e vagas de Jovem Aprendiz",
      seoDescription: "Veja vagas de Jovem Aprendiz ligadas as Lojas Costa Azul.",
      featured: false,
      stateId: ceara.id,
      cityId: fortaleza.id
    }),
    upsertCompany({
      name: "Talento Urbano",
      slug: "talento-urbano",
      summary: "Empresa com vagas administrativas e de RH para jovens aprendizes em Sao Paulo.",
      descriptionHtml: "<p>A Talento Urbano publica vagas de apoio administrativo e RH para primeiro emprego.</p>",
      websiteUrl: "https://example.com/talento-urbano",
      seoTitle: "Talento Urbano e vagas de Jovem Aprendiz",
      seoDescription: "Veja vagas de Jovem Aprendiz ligadas a Talento Urbano.",
      featured: true,
      stateId: saoPauloState.id,
      cityId: saoPauloCity.id
    }),
    upsertCompany({
      name: "Nuvem Digital",
      slug: "nuvem-digital",
      summary: "Empresa de tecnologia com oportunidades de suporte e operacao para jovens aprendizes.",
      descriptionHtml: "<p>A Nuvem Digital publica vagas de Jovem Aprendiz em tecnologia e suporte.</p>",
      websiteUrl: "https://example.com/nuvem-digital",
      seoTitle: "Nuvem Digital e vagas de Jovem Aprendiz",
      seoDescription: "Veja vagas de Jovem Aprendiz ligadas a Nuvem Digital.",
      featured: true,
      stateId: saoPauloState.id,
      cityId: saoPauloCity.id
    }),
    upsertCompany({
      name: "Porto Norte",
      slug: "porto-norte",
      summary: "Operacao com vagas de apoio e rotina supervisionada para jovens em Sao Luis.",
      descriptionHtml: "<p>Porto Norte abre vagas para apoio operacional e rotinas simples com aprendizado pratico.</p>",
      websiteUrl: "https://example.com/porto-norte",
      seoTitle: "Porto Norte e vagas de Jovem Aprendiz",
      seoDescription: "Veja vagas de Jovem Aprendiz ligadas a Porto Norte.",
      featured: false,
      stateId: maranhao.id,
      cityId: saoLuis.id
    }),
    upsertCompany({
      name: "Atende Mais",
      slug: "atende-mais",
      summary: "Empresa com vagas de atendimento digital e apoio em canais online.",
      descriptionHtml: "<p>A Atende Mais publica vagas para jovens em atendimento digital e suporte a canais online.</p>",
      websiteUrl: "https://example.com/atende-mais",
      seoTitle: "Atende Mais e vagas de Jovem Aprendiz",
      seoDescription: "Veja vagas de Jovem Aprendiz ligadas a Atende Mais.",
      featured: false,
      stateId: saoPauloState.id,
      cityId: saoPauloCity.id
    })
  ]);

  const companyBySlug = new Map(companies.map((company) => [company.slug, company]));

  const jobs = [
    ["jovem-aprendiz-atendimento-sao-luis-ma", "Jovem Aprendiz em Atendimento", "magazine-horizonte", saoLuis.id, maranhao.id, 700, 900, "4h por dia", "https://example.com/candidatura/jovem-aprendiz-atendimento", "Vaga de Jovem Aprendiz em Atendimento em Sao Luis, MA, com vale-transporte e jornada reduzida.", true],
    ["jovem-aprendiz-administrativo-imperatriz-ma", "Jovem Aprendiz Administrativo", "grupo-norte-servicos", imperatriz.id, maranhao.id, 760, 920, "6h por dia", "https://example.com/candidatura/jovem-aprendiz-administrativo-imperatriz", "Vaga de Jovem Aprendiz Administrativo em Imperatriz, MA, para primeiro emprego com rotina de escritorio.", true],
    ["jovem-aprendiz-logistica-fortaleza-ce", "Jovem Aprendiz em Logistica", "centro-log-ce", fortaleza.id, ceara.id, 780, 950, "6h por dia", "https://example.com/candidatura/jovem-aprendiz-logistica-fortaleza", "Vaga de Jovem Aprendiz em Logistica em Fortaleza, CE, com foco em operacoes e estoque.", true],
    ["jovem-aprendiz-vendas-fortaleza-ce", "Jovem Aprendiz em Vendas", "lojas-costa-azul", fortaleza.id, ceara.id, 750, 900, "4h por dia", "https://example.com/candidatura/jovem-aprendiz-vendas-fortaleza", "Vaga de Jovem Aprendiz em Vendas em Fortaleza, CE, ideal para quem quer entrar no varejo.", false],
    ["jovem-aprendiz-rh-sao-paulo-sp", "Jovem Aprendiz Administrativo em RH", "talento-urbano", saoPauloCity.id, saoPauloState.id, 820, 1020, "6h por dia", "https://example.com/candidatura/jovem-aprendiz-rh-sao-paulo", "Vaga de Jovem Aprendiz Administrativo em RH em Sao Paulo, SP, com rotinas de escritorio e aprendizado pratico.", true],
    ["jovem-aprendiz-tecnologia-sao-paulo-sp", "Jovem Aprendiz em Tecnologia e Suporte", "nuvem-digital", saoPauloCity.id, saoPauloState.id, 850, 1100, "6h por dia", "https://example.com/candidatura/jovem-aprendiz-tecnologia-sao-paulo", "Vaga de Jovem Aprendiz em Tecnologia em Sao Paulo, SP, com apoio em suporte e operacoes de TI.", false],
    ["jovem-aprendiz-operacoes-sao-luis-ma", "Jovem Aprendiz em Operacoes", "porto-norte", saoLuis.id, maranhao.id, 760, 920, "4h por dia", "https://example.com/candidatura/jovem-aprendiz-operacoes-sao-luis", "Vaga de Jovem Aprendiz em Operacoes em Sao Luis, MA, para rotina supervisionada e desenvolvimento profissional.", false],
    ["jovem-aprendiz-atendimento-digital-sao-paulo-sp", "Jovem Aprendiz em Atendimento Digital", "atende-mais", saoPauloCity.id, saoPauloState.id, 820, 980, "6h por dia", "https://example.com/candidatura/jovem-aprendiz-atendimento-digital", "Vaga de Jovem Aprendiz em Atendimento Digital em Sao Paulo, SP, com foco em canais online.", false]
  ] as const;

  for (const [slug, title, companySlug, cityId, stateId, salaryMin, salaryMax, workHours, applyUrl, seoDescription, featured] of jobs) {
    const company = companyBySlug.get(companySlug);
    if (!company) continue;

    await prisma.job.upsert({
      where: { slug },
      update: {
        title,
        companyId: company.id,
        companyName: company.name,
        companyLogoUrl: company.logoUrl,
        companyWebsiteUrl: company.websiteUrl,
        summary: `${title} com foco em primeiro emprego, rotina supervisionada e aprendizado pratico.`,
        descriptionHtml: `<p>${title} com foco em aprendizado pratico, acompanhamento da equipe e rotina organizada para quem esta entrando no mercado.</p>`,
        requirements: ["Ensino medio cursando ou completo", "Vontade de aprender", "Boa organizacao"],
        benefits: ["Vale-transporte", "Capacitacao pratica"],
        salaryMin,
        salaryMax,
        employmentType: EmploymentType.APPRENTICESHIP,
        workHours,
        publishedAt: new Date("2026-04-10T10:00:00.000Z"),
        expiresAt: new Date("2026-05-20T10:00:00.000Z"),
        applyUrl,
        isActive: true,
        sourceName: "Portal Parceiro",
        sourceUrl: "https://example.com",
        locationType: LocationType.ONSITE,
        seoTitle: `${title} | Jovem Aprendiz Vagas`,
        seoDescription,
        featured,
        stateId,
        cityId
      },
      create: {
        title,
        slug,
        companyId: company.id,
        companyName: company.name,
        companyLogoUrl: company.logoUrl,
        companyWebsiteUrl: company.websiteUrl,
        summary: `${title} com foco em primeiro emprego, rotina supervisionada e aprendizado pratico.`,
        descriptionHtml: `<p>${title} com foco em aprendizado pratico, acompanhamento da equipe e rotina organizada para quem esta entrando no mercado.</p>`,
        requirements: ["Ensino medio cursando ou completo", "Vontade de aprender", "Boa organizacao"],
        benefits: ["Vale-transporte", "Capacitacao pratica"],
        salaryMin,
        salaryMax,
        employmentType: EmploymentType.APPRENTICESHIP,
        workHours,
        publishedAt: new Date("2026-04-10T10:00:00.000Z"),
        expiresAt: new Date("2026-05-20T10:00:00.000Z"),
        applyUrl,
        isActive: true,
        sourceName: "Portal Parceiro",
        sourceUrl: "https://example.com",
        locationType: LocationType.ONSITE,
        seoTitle: `${title} | Jovem Aprendiz Vagas`,
        seoDescription,
        featured,
        stateId,
        cityId
      }
    });
  }

  const jovemAprendizCategory = await prisma.blogCategory.upsert({
    where: { slug: "jovem-aprendiz" },
    update: { name: "Jovem Aprendiz", slug: "jovem-aprendiz" },
    create: { name: "Jovem Aprendiz", slug: "jovem-aprendiz" }
  });
  const carreiraCategory = await prisma.blogCategory.upsert({
    where: { slug: "carreira-inicial" },
    update: { name: "Carreira Inicial", slug: "carreira-inicial" },
    create: { name: "Carreira Inicial", slug: "carreira-inicial" }
  });

  const posts = [
    ["como-conseguir-vaga-de-jovem-aprendiz-em-sao-luis", "Como conseguir vaga de Jovem Aprendiz em Sao Luis", "Entenda onde procurar, como montar curriculo e como se preparar para o primeiro emprego em Sao Luis.", jovemAprendizCategory.id],
    ["curriculo-para-jovem-aprendiz-sem-experiencia", "Curriculo para Jovem Aprendiz sem experiencia", "Veja como montar um curriculo simples, forte e honesto para quem ainda nao teve a primeira oportunidade.", carreiraCategory.id],
    ["entrevista-para-jovem-aprendiz-o-que-falar", "Entrevista para Jovem Aprendiz: o que falar", "Dicas simples e profissionais para falar com mais seguranca na entrevista do primeiro emprego.", carreiraCategory.id]
  ] as const;

  for (const [slug, title, excerpt, categoryId] of posts) {
    await prisma.blogPost.upsert({
      where: { slug },
      update: {
        title,
        excerpt,
        contentHtml: `<p>${excerpt}</p>`,
        seoTitle: `${title} | Jovem Aprendiz Vagas`,
        seoDescription: excerpt,
        isPublished: true,
        publishedAt: new Date("2026-04-08T10:00:00.000Z"),
        categoryId
      },
      create: {
        slug,
        title,
        excerpt,
        contentHtml: `<p>${excerpt}</p>`,
        seoTitle: `${title} | Jovem Aprendiz Vagas`,
        seoDescription: excerpt,
        isPublished: true,
        publishedAt: new Date("2026-04-08T10:00:00.000Z"),
        categoryId
      }
    });
  }

  await prisma.adminUser.upsert({
    where: { email: (env.ADMIN_LOGIN_USER || "").toLowerCase() },
    update: { name: "Administrador", passwordHash: await hashPassword(env.ADMIN_SECRET_KEY || ""), isActive: true },
    create: {
      name: "Administrador",
      email: (env.ADMIN_LOGIN_USER || "").toLowerCase(),
      passwordHash: await hashPassword(env.ADMIN_SECRET_KEY || ""),
      isActive: true
    }
  });

  const siteContentSetting = await prisma.siteSetting.findUnique({ where: { key: "site_content" } });
  if (!siteContentSetting) {
    await prisma.siteSetting.create({ data: { key: "site_content", value: defaultSiteContent } });
  } else if (resetSiteContent) {
    await prisma.siteSetting.update({ where: { key: "site_content" }, data: { value: defaultSiteContent } });
  }

  const siteSettingsSetting = await prisma.siteSetting.findUnique({ where: { key: "site_settings" } });
  if (!siteSettingsSetting) {
    await prisma.siteSetting.create({ data: { key: "site_settings", value: defaultSiteSettings } });
  } else if (resetSiteContent) {
    await prisma.siteSetting.update({ where: { key: "site_settings" }, data: { value: defaultSiteSettings } });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
