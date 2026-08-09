import { createDatabase, settings } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { INSTITUTIONAL_DEFAULTS_HTML } from "./institutional-defaults";

export const INSTITUTIONAL_SLUGS = [
  "quem-somos",
  "sobre",
  "contato",
  "privacidade",
  "cookies",
  "termos",
  "lgpd",
  "politica-editorial",
  "politica-correcoes",
  "politica-fontes",
  "redacao",
  "seguranca-candidatos",
  "anunciar-vaga",
  "area-empresas",
  "trabalhe-conosco"
] as const;

export type InstitutionalSlug = (typeof INSTITUTIONAL_SLUGS)[number];

export interface InstitutionalPage {
  slug: InstitutionalSlug;
  title: string;
  contentHtml: string;
  seoTitle: string;
  metaDescription: string;
  canonicalPath: string;
  published: boolean;
}

const pageSchema = z.object({
  slug: z.enum(INSTITUTIONAL_SLUGS),
  title: z.string().min(2),
  contentHtml: z.string().min(1),
  seoTitle: z.string().min(2),
  metaDescription: z.string().min(10),
  canonicalPath: z.string().startsWith("/"),
  published: z.boolean().default(true)
});

const defaults: Record<InstitutionalSlug, InstitutionalPage> = {
  "quem-somos": {
    slug: "quem-somos",
    title: "Quem somos",
    seoTitle: "Quem somos — Empregos São Luís",
    metaDescription: "Conheça o Empregos São Luís, portal de vagas verificadas em São Luís e no Maranhão.",
    canonicalPath: "/quem-somos",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML["quem-somos"]
  },
  sobre: {
    slug: "sobre",
    title: "Sobre",
    seoTitle: "Sobre — Empregos São Luís",
    metaDescription: "Missão e propósito do Empregos São Luís.",
    canonicalPath: "/sobre",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML.sobre
  },
  contato: {
    slug: "contato",
    title: "Contato",
    seoTitle: "Contato — Empregos São Luís",
    metaDescription: "Fale com a equipe do Empregos São Luís.",
    canonicalPath: "/contato",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML.contato
  },
  privacidade: {
    slug: "privacidade",
    title: "Política de privacidade",
    seoTitle: "Privacidade — Empregos São Luís",
    metaDescription: "Como tratamos dados pessoais no Empregos São Luís.",
    canonicalPath: "/privacidade",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML.privacidade
  },
  cookies: {
    slug: "cookies",
    title: "Política de cookies",
    seoTitle: "Cookies — Empregos São Luís",
    metaDescription: "Uso de cookies e tecnologias semelhantes.",
    canonicalPath: "/cookies",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML.cookies
  },
  termos: {
    slug: "termos",
    title: "Termos de uso",
    seoTitle: "Termos — Empregos São Luís",
    metaDescription: "Condições de uso do portal Empregos São Luís.",
    canonicalPath: "/termos",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML.termos
  },
  lgpd: {
    slug: "lgpd",
    title: "LGPD",
    seoTitle: "LGPD — Empregos São Luís",
    metaDescription: "Direitos do titular e canal de atendimento LGPD.",
    canonicalPath: "/lgpd",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML.lgpd
  },
  "politica-editorial": {
    slug: "politica-editorial",
    title: "Política editorial",
    seoTitle: "Política editorial — Empregos São Luís",
    metaDescription: "Critérios editoriais para notícias e conteúdos.",
    canonicalPath: "/politica-editorial",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML["politica-editorial"]
  },
  "politica-correcoes": {
    slug: "politica-correcoes",
    title: "Política de correções",
    seoTitle: "Correções — Empregos São Luís",
    metaDescription: "Como reportar e corrigir informações no portal.",
    canonicalPath: "/politica-correcoes",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML["politica-correcoes"]
  },
  "politica-fontes": {
    slug: "politica-fontes",
    title: "Política de fontes",
    seoTitle: "Fontes — Empregos São Luís",
    metaDescription: "Critérios de verificação de fontes de vagas.",
    canonicalPath: "/politica-fontes",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML["politica-fontes"]
  },
  redacao: {
    slug: "redacao",
    title: "Redação Empregos São Luís",
    seoTitle: "Redação — Empregos São Luís",
    metaDescription: "Conheça os critérios de pauta, revisão, fontes, atualização e correção da Redação Empregos São Luís.",
    canonicalPath: "/redacao",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML.redacao
  },
  "seguranca-candidatos": {
    slug: "seguranca-candidatos",
    title: "Segurança para candidatos",
    seoTitle: "Segurança — Empregos São Luís",
    metaDescription: "Orientações para candidatura segura.",
    canonicalPath: "/seguranca-candidatos",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML["seguranca-candidatos"]
  },
  "anunciar-vaga": {
    slug: "anunciar-vaga",
    title: "Anunciar vaga",
    seoTitle: "Anunciar vaga — Empregos São Luís",
    metaDescription: "Como empresas podem divulgar vagas.",
    canonicalPath: "/anunciar-vaga",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML["anunciar-vaga"]
  },
  "area-empresas": {
    slug: "area-empresas",
    title: "Área para empresas",
    seoTitle: "Empresas — Empregos São Luís",
    metaDescription: "Soluções para empregadores no Empregos São Luís.",
    canonicalPath: "/area-empresas",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML["area-empresas"]
  },
  "trabalhe-conosco": {
    slug: "trabalhe-conosco",
    title: "Trabalhe conosco",
    seoTitle: "Trabalhe conosco — Empregos São Luís",
    metaDescription: "Oportunidades na equipe do portal.",
    canonicalPath: "/trabalhe-conosco",
    published: true,
    contentHtml: INSTITUTIONAL_DEFAULTS_HTML["trabalhe-conosco"]
  }
};

export async function getInstitutionalPages(): Promise<Record<InstitutionalSlug, InstitutionalPage>> {
  if (!process.env.DATABASE_URL) return defaults;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select().from(settings).where(eq(settings.key, "institutional_pages")).limit(1);
    if (!row?.value || typeof row.value !== "object") return defaults;
    const stored = row.value as Record<string, Partial<InstitutionalPage>>;
    const merged = { ...defaults };
    for (const slug of INSTITUTIONAL_SLUGS) {
      const parsed = pageSchema.safeParse({ ...defaults[slug], ...stored[slug] });
      if (parsed.success) merged[slug] = parsed.data;
    }
    return merged;
  } catch {
    return defaults;
  } finally {
    await connection.close();
  }
}

export async function getInstitutionalPage(slug: InstitutionalSlug): Promise<InstitutionalPage> {
  const pages = await getInstitutionalPages();
  return pages[slug];
}

export async function getInstitutionalPagesUpdatedAt(): Promise<Date | null> {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select({ updatedAt: settings.updatedAt }).from(settings).where(eq(settings.key, "institutional_pages")).limit(1);
    return row?.updatedAt ?? null;
  } catch {
    return null;
  } finally {
    await connection.close();
  }
}

export async function saveInstitutionalPages(pages: Partial<Record<InstitutionalSlug, InstitutionalPage>>) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const current = await getInstitutionalPages();
  const next = { ...current };
  for (const [slug, value] of Object.entries(pages)) {
    const parsed = pageSchema.safeParse({ ...current[slug as InstitutionalSlug], ...value });
    if (parsed.success) next[parsed.data.slug] = parsed.data;
  }
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(settings).values({ key: "institutional_pages", value: next, public: true }).onConflictDoUpdate({ target: settings.key, set: { value: next, public: true, updatedAt: new Date() } });
    return next;
  } finally {
    await connection.close();
  }
}
