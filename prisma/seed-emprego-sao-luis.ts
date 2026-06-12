import { EmploymentType, JobStatus, LocationType, PrismaClient } from "@prisma/client";

import { empregoSaoLuisBlogPostsAll } from "@/data/blog-posts-all";
import { MARANHAO_CITIES } from "@/lib/emprego-sao-luis-cities";
import { JOB_CATEGORIES } from "@/lib/job-categories";
import { defaultSiteSettings } from "@/lib/schemas/site-admin";

const prisma = new PrismaClient();

const empregoSiteSettings = {
  ...defaultSiteSettings,
  siteName: "Emprego São Luís",
  legalName: "Emprego São Luís",
  shortDescription:
    "Encontre vagas de emprego em São Luís, Região Metropolitana e cidades do Maranhão. Oportunidades atualizadas para diversas áreas.",
  logoUrl: "/emprego-logo-horizontal.svg",
  logoCompactUrl: "/emprego-logo-mark.svg",
  faviconUrl: "/favicon.ico",
  defaultSocialImageUrl: "/og-image.jpg",
  email: "contato@empregossaoluis.com.br",
  socialLinks: {
    ...defaultSiteSettings.socialLinks,
    instagram: "https://instagram.com/empregosaoluis"
  },
  defaultOgAlt: "Emprego São Luís - Vagas em São Luís e Maranhão",
  consentBanner: {
    ...defaultSiteSettings.consentBanner,
    policyHref: "/cookies"
  }
};

export async function seedEmpregoSaoLuis(options?: { purgeLegacy?: boolean }) {
  if (options?.purgeLegacy) {
    await prisma.job.deleteMany({
      where: {
        OR: [{ state: { code: { not: "MA" } } }, { city: { state: { code: { not: "MA" } } } }]
      }
    });
    await prisma.company.deleteMany({
      where: { OR: [{ state: { code: { not: "MA" } } }, { city: { state: { code: { not: "MA" } } } }] }
    });
    await prisma.city.deleteMany({
      where: { state: { code: { not: "MA" } } }
    });
    await prisma.state.deleteMany({
      where: { code: { not: "MA" } }
    });
    const keepPostSlugs = empregoSaoLuisBlogPostsAll.map((post) => post.slug);
    await prisma.blogPost.deleteMany({
      where: { slug: { notIn: keepPostSlugs } }
    });
  }

  const maranhao = await prisma.state.upsert({
    where: { code: "MA" },
    update: {
      name: "Maranhão",
      slug: "maranhao",
      seoTitle: "Vagas de Emprego no Maranhão",
      seoIntro: "Veja vagas de emprego no Maranhão, com foco em São Luís e Região Metropolitana."
    },
    create: {
      code: "MA",
      name: "Maranhão",
      slug: "maranhao",
      seoTitle: "Vagas de Emprego no Maranhão",
      seoIntro: "Veja vagas de emprego no Maranhão, com foco em São Luís e Região Metropolitana."
    }
  });

  const cityMap = new Map<string, string>();
  for (const city of MARANHAO_CITIES) {
    const row = await prisma.city.upsert({
      where: { stateId_slug: { stateId: maranhao.id, slug: city.slug } },
      update: {
        name: city.name,
        seoTitle: `Vagas de Emprego em ${city.name}, MA`,
        seoIntro: `Oportunidades de trabalho divulgadas em ${city.name}, Maranhão.`
      },
      create: {
        stateId: maranhao.id,
        name: city.name,
        slug: city.slug,
        seoTitle: `Vagas de Emprego em ${city.name}, MA`,
        seoIntro: `Oportunidades de trabalho divulgadas em ${city.name}, Maranhão.`
      }
    });
    cityMap.set(city.slug, row.id);
  }

  const categoryMap = new Map<string, string>();
  for (const category of JOB_CATEGORIES) {
    const row = await prisma.jobCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { name: category.name, slug: category.slug }
    });
    categoryMap.set(category.slug, row.id);
  }

  const blogCategoryMap = new Map<string, string>();
  const blogCategories = [
    "Busca de Emprego",
    "Currículo",
    "Entrevista",
    "Mercado de Trabalho",
    "Primeiro Emprego",
    "Jovem Aprendiz",
    "Segurança Digital",
    "Tipos de Contrato",
    "Comércio",
    "Atendimento",
    "Administrativo",
    "Logística",
    "Portal"
  ];
  for (const name of blogCategories) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const row = await prisma.blogCategory.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    });
    blogCategoryMap.set(name, row.id);
  }

  for (const post of empregoSaoLuisBlogPostsAll) {
    const categoryId = blogCategoryMap.get(post.category) ?? [...blogCategoryMap.values()][0];
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        contentHtml: post.contentHtml,
        coverImageUrl: post.coverImageUrl ?? null,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        isPublished: true,
        publishedAt: new Date(post.publishedAt),
        categoryId
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        contentHtml: post.contentHtml,
        coverImageUrl: post.coverImageUrl ?? null,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        isPublished: true,
        publishedAt: new Date(post.publishedAt),
        categoryId
      }
    });
  }

  const companies = [
    ["comercial-sao-luis", "Comercial São Luís", "sao-luis", "Rede comercial com vagas em atendimento e vendas."],
    ["grupo-nordeste-servicos", "Grupo Nordeste Serviços", "sao-luis", "Empresa de serviços com oportunidades administrativas e operacionais."],
    ["logma-express", "LogMA Express", "sao-jose-de-ribamar", "Operação logística com vagas em expedição e apoio."],
    ["imperatriz-retail", "Imperatriz Retail", "imperatriz", "Varejo com oportunidades em loja e estoque."],
    ["timon-alimentos", "Timon Alimentos", "timon", "Indústria alimentícia com vagas operacionais e administrativas."]
  ] as const;

  const companyMap = new Map<string, { id: string; name: string }>();
  for (const [slug, name, citySlug, summary] of companies) {
    const cityId = cityMap.get(citySlug);
    if (!cityId) continue;
    const row = await prisma.company.upsert({
      where: { slug },
      update: { name, summary, stateId: maranhao.id, cityId, isActive: true, featured: true },
      create: {
        name,
        slug,
        summary,
        descriptionHtml: `<p>${summary}</p>`,
        websiteUrl: null,
        seoTitle: `${name} - Vagas Emprego São Luís`,
        seoDescription: summary,
        featured: true,
        stateId: maranhao.id,
        cityId
      }
    });
    companyMap.set(slug, { id: row.id, name: row.name });
  }

  const validThrough = new Date();
  validThrough.setDate(validThrough.getDate() + 30);

  const sampleJobs = [
    ["assistente-administrativo-sao-luis-ma", "Assistente Administrativo", "grupo-nordeste-servicos", "sao-luis", "administrativo", EmploymentType.FULL_TIME, "A combinar", "CLT", "https://forms.gle/exemplo-assistente-administrativo"],
    ["atendente-loja-sao-luis-ma", "Atendente de Loja", "comercial-sao-luis", "sao-luis", "atendimento", EmploymentType.FULL_TIME, "R$ 1.512,00 a R$ 1.800,00", "CLT", "rh@comercialsaoluis.com.br"],
    ["auxiliar-logistica-sao-jose-de-ribamar-ma", "Auxiliar de Logística", "logma-express", "sao-jose-de-ribamar", "logistica", EmploymentType.FULL_TIME, "A combinar", "CLT", "5598999887766"],
    ["jovem-aprendiz-comercial", "Jovem Aprendiz Comercial", "comercial-sao-luis", "sao-luis", "jovem-aprendiz", EmploymentType.APPRENTICESHIP, "A combinar", "Jovem Aprendiz", "https://wa.me/5598999776655"],
    ["estagio-administrativo-imperatriz-ma", "Estágio Administrativo", "imperatriz-retail", "imperatriz", "estagio", EmploymentType.INTERNSHIP, "Bolsa auxílio", "Estágio", "mailto:estagio@imperatrizretail.com.br"],
    ["operador-producao-timon-ma", "Operador de Produção", "timon-alimentos", "timon", "operacional", EmploymentType.FULL_TIME, "A combinar", "CLT", "https://timon-alimentos.gupy.io/"]
  ] as const;

  for (const [slug, title, companySlug, citySlug, categorySlug, employmentType, salaryDisplay, typeLabel, applyUrl] of sampleJobs) {
    const company = companyMap.get(companySlug);
    const cityId = cityMap.get(citySlug);
    const categoryId = categoryMap.get(categorySlug);
    const category = JOB_CATEGORIES.find((c) => c.slug === categorySlug);
    if (!cityId) continue;

    await prisma.job.upsert({
      where: { slug },
      update: {
        title,
        companyId: company?.id,
        companyName: company?.name ?? "Empresa Confidencial",
        categoryId,
        categoryName: category?.name ?? "Geral",
        summary: `Oportunidade de ${title} divulgada em ${citySlug.replace(/-/g, " ")}, MA.`,
        descriptionHtml: `<p>Vaga divulgada de <strong>${title}</strong> em ${citySlug.replace(/-/g, " ")}, Maranhão. A empresa informa que candidatos interessados devem acessar o link de candidatura para mais detalhes sobre requisitos, benefícios e etapas do processo seletivo.</p><h2>Informações da oportunidade</h2><p>Tipo de vaga: ${typeLabel}. Salário: ${salaryDisplay}. Esta é uma oportunidade divulgada pelo portal Emprego São Luís — a contratação é de responsabilidade da empresa anunciante.</p>`,
        requirements: ["Documentação em dia", "Disponibilidade para a jornada informada", "Interesse na área"],
        benefits: ["Vale-transporte", "Oportunidade de crescimento"],
        salaryDisplay,
        employmentType,
        publishedAt: new Date(),
        validThrough,
        applyUrl,
        isActive: true,
        status: JobStatus.PUBLISHED,
        sourceName: "Emprego São Luís",
        locationType: LocationType.ONSITE,
        seoTitle: `${title} em ${citySlug.replace(/-/g, " ")} MA - Emprego São Luís`,
        seoDescription: `Vaga de ${title} divulgada em ${citySlug.replace(/-/g, " ")}, MA. Confira detalhes e candidature-se pelo link oficial.`,
        featured: slug.includes("sao-luis") || slug === "jovem-aprendiz-comercial",
        stateId: maranhao.id,
        cityId
      },
      create: {
        slug,
        title,
        companyId: company?.id,
        companyName: company?.name ?? "Empresa Confidencial",
        categoryId,
        categoryName: category?.name ?? "Geral",
        summary: `Oportunidade de ${title} divulgada em ${citySlug.replace(/-/g, " ")}, MA.`,
        descriptionHtml: `<p>Vaga divulgada de <strong>${title}</strong> em ${citySlug.replace(/-/g, " ")}, Maranhão. A empresa informa que candidatos interessados devem acessar o link de candidatura para mais detalhes.</p>`,
        requirements: ["Documentação em dia", "Disponibilidade para a jornada informada"],
        benefits: ["Vale-transporte"],
        salaryDisplay,
        employmentType,
        publishedAt: new Date(),
        validThrough,
        applyUrl,
        isActive: true,
        status: JobStatus.PUBLISHED,
        sourceName: "Emprego São Luís",
        locationType: LocationType.ONSITE,
        seoTitle: `${title} em ${citySlug.replace(/-/g, " ")} MA - Emprego São Luís`,
        seoDescription: `Vaga de ${title} divulgada em ${citySlug.replace(/-/g, " ")}, MA.`,
        featured: slug.includes("sao-luis") || slug === "jovem-aprendiz-comercial",
        stateId: maranhao.id,
        cityId
      }
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "site_settings" },
    update: { value: empregoSiteSettings },
    create: { key: "site_settings", value: empregoSiteSettings }
  });
}
