export type AdminIcon =
  | "home"
  | "content"
  | "publish"
  | "quality"
  | "search"
  | "adsense"
  | "operation"
  | "business"
  | "system";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: AdminIcon;
  description: string;
  permission?: string;
};
export type AdminNavGroup = { title: string; icon: AdminIcon; items: AdminNavItem[] };

/**
 * Arquitetura de informação do painel Astro ativo.
 * As rotas existentes são preservadas; query strings e âncoras apenas abrem o recorte correto.
 */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Visão geral",
    icon: "home",
    items: [
      { label: "Dashboard", href: "/admin", icon: "home", description: "Resumo operacional e prioridades do dia" }
    ]
  },
  {
    title: "Conteúdo",
    icon: "content",
    items: [
      { label: "Vagas", href: "/admin/vagas", icon: "content", description: "Cadastrar, revisar e administrar vagas", permission: "jobs.read" },
      { label: "Blog", href: "/admin/conteudo?tipo=blog", icon: "content", description: "Guias e análises editoriais", permission: "content.manage" },
      { label: "Notícias", href: "/admin/conteudo?tipo=noticias", icon: "content", description: "Conteúdo noticioso e atualizações", permission: "content.manage" },
      { label: "Empresas", href: "/admin/empresas", icon: "business", description: "Empresas e perfis públicos", permission: "companies.manage" },
      { label: "Categorias", href: "/admin/categorias", icon: "content", description: "Taxonomia das oportunidades", permission: "settings.manage" },
      { label: "Cidades", href: "/admin/localidades", icon: "content", description: "Cidades e bairros cadastrados", permission: "settings.manage" },
      { label: "Pilares e clusters", href: "/admin/conteudo/pilares", icon: "content", description: "Arquitetura editorial e links internos", permission: "content.manage" }
    ]
  },
  {
    title: "Publicação",
    icon: "publish",
    items: [
      { label: "Importações", href: "/admin/vagas/importar", icon: "publish", description: "Planilhas, links e pré-validação", permission: "imports.manage" },
      { label: "Agendamentos", href: "/admin/programacao", icon: "publish", description: "Fila de publicação programada", permission: "jobs.publish" },
      { label: "Histórico", href: "/admin/auditoria?entidade=JOB", icon: "publish", description: "Alterações e publicações registradas", permission: "audit.read" },
      { label: "Filas", href: "/admin/operacao", icon: "operation", description: "Jobs assíncronos e reprocessamento", permission: "queues.manage" }
    ]
  },
  {
    title: "Qualidade",
    icon: "quality",
    items: [
      { label: "Qualidade das vagas", href: "/admin/qualidade-vagas", icon: "quality", description: "Fontes, canais, salários e localização", permission: "jobs.read" },
      { label: "Qualidade editorial", href: "/admin/qualidade-editorial", icon: "quality", description: "Profundidade, confiança e utilidade local", permission: "content.manage" },
      { label: "Duplicidades", href: "/admin/qualidade-vagas#duplicidades", icon: "quality", description: "Vagas e conteúdo possivelmente repetidos", permission: "jobs.read" },
      { label: "Vagas expiradas", href: "/admin/qualidade-vagas#expiradas", icon: "quality", description: "Validade e inconsistências de status", permission: "jobs.read" },
      { label: "Links com problemas", href: "/admin/qualidade-vagas#links", icon: "quality", description: "Canais fechados, inválidos ou inconclusivos", permission: "jobs.read" },
      { label: "Dados inconsistentes", href: "/admin/qualidade-vagas#inconsistencias", icon: "quality", description: "Campos críticos que exigem revisão", permission: "jobs.read" }
    ]
  },
  {
    title: "SEO & Google",
    icon: "search",
    items: [
      { label: "Visão geral SEO", href: "/admin/seo", icon: "search", description: "Configurações e estado técnico", permission: "seo.manage" },
      { label: "Google Jobs", href: "/admin/seo/auditoria#google-jobs", icon: "search", description: "Validade do schema JobPosting", permission: "seo.manage" },
      { label: "Indexação Google", href: "/admin/integracoes#indexacao-google", icon: "search", description: "Eventos da API de indexação", permission: "seo.manage" },
      { label: "Sitemaps", href: "/admin/seo/auditoria#sitemaps", icon: "search", description: "Índice e arquivos filhos", permission: "seo.manage" },
      { label: "Dados estruturados", href: "/admin/seo/auditoria#dados-estruturados", icon: "search", description: "Schemas emitidos pelo portal", permission: "seo.manage" },
      { label: "IndexNow", href: "/admin/integracoes#indexnow", icon: "search", description: "Envios e configuração IndexNow", permission: "seo.manage" }
    ]
  },
  {
    title: "AdSense",
    icon: "adsense",
    items: [
      { label: "Central AdSense", href: "/admin/adsense-readiness", icon: "adsense", description: "Indicador interno e bloqueadores", permission: "seo.manage" },
      { label: "Auditoria de conteúdo", href: "/admin/adsense-readiness#conteudo", icon: "adsense", description: "Artigos, notícias e conteúdo fraco", permission: "seo.manage" },
      { label: "Indexação para AdSense", href: "/admin/urls", icon: "adsense", description: "URLs, robots, canonical, qualidade e sitemap", permission: "seo.manage" },
      { label: "Checklist de aprovação", href: "/admin/adsense-readiness#checklist", icon: "adsense", description: "Requisitos, metas internas e evidências", permission: "seo.manage" },
      { label: "Configurações", href: "/admin/adsense-readiness#configuracoes", icon: "adsense", description: "Modo de revisão e controles", permission: "seo.manage" }
    ]
  },
  {
    title: "Operação",
    icon: "operation",
    items: [
      { label: "Alertas", href: "/admin/audiencia", icon: "operation", description: "Inscrições e alertas de vagas", permission: "audience.manage" },
      { label: "Notificações", href: "/admin/operacao#notificacoes", icon: "operation", description: "Entregas e falhas assíncronas", permission: "queues.manage" },
      { label: "Publicações sociais", href: "/admin/social", icon: "operation", description: "Conteúdo e canais sociais", permission: "social.manage" },
      { label: "Monitoramento", href: "/admin/vagas/monitor-candidaturas", icon: "operation", description: "Disponibilidade das candidaturas", permission: "jobs.read" }
    ]
  },
  {
    title: "Negócio",
    icon: "business",
    items: [
      { label: "Monetização", href: "/admin/comercial/planos", icon: "business", description: "Planos, créditos e pedidos B2B", permission: "commercial.manage" },
      { label: "Clientes / empresas", href: "/admin/perfis-empresariais", icon: "business", description: "Perfis e relacionamento comercial", permission: "commercial.manage" },
      { label: "Publicidade", href: "/admin/publicidade", icon: "business", description: "Campanhas, anunciantes e slots", permission: "commercial.manage" },
      { label: "Pagamentos", href: "/admin/comercial/pagamentos", icon: "business", description: "Pagamentos e revisões", permission: "commercial.manage" }
    ]
  },
  {
    title: "Sistema",
    icon: "system",
    items: [
      { label: "Usuários", href: "/admin/usuarios", icon: "system", description: "Contas e privacidade", permission: "users.manage" },
      { label: "Permissões", href: "/admin/permissoes", icon: "system", description: "Papéis e acessos RBAC", permission: "users.manage" },
      { label: "Auditoria", href: "/admin/auditoria", icon: "system", description: "Trilha de ações administrativas", permission: "audit.read" },
      { label: "Logs e diagnóstico", href: "/admin/saude", icon: "system", description: "Saúde dos serviços e armazenamento" },
      { label: "Configurações", href: "/admin/integracoes", icon: "system", description: "Integrações e parâmetros do portal", permission: "settings.manage" },
      { label: "Aparência", href: "/admin/aparencia", icon: "system", description: "Identidade e apresentação", permission: "settings.manage" },
      { label: "Segurança", href: "/admin/seguranca", icon: "system", description: "MFA e sessões administrativas", permission: "settings.manage" }
    ]
  }
];

export const ADMIN_DAY_OPS: AdminNavItem[] = [
  { label: "Importar vagas", href: "/admin/vagas/importar", icon: "publish", description: "Validar planilhas ou contatos", permission: "imports.manage" },
  { label: "Revisar qualidade", href: "/admin/qualidade-vagas", icon: "quality", description: "Resolver bloqueadores antes de publicar", permission: "jobs.read" },
  { label: "Publicar conteúdo", href: "/admin/conteudo", icon: "content", description: "Gerenciar notícias e guias", permission: "content.manage" },
  { label: "Central AdSense", href: "/admin/adsense-readiness", icon: "adsense", description: "Ver preparação e modo de revisão", permission: "seo.manage" }
];

function hasPermission(permissions: string[], permission?: string, roles: string[] = []) {
  if (!permission) return true;
  return roles.includes("SUPER_ADMIN") || permissions.includes(permission);
}

export function filterAdminNav(permissions: string[], roles: string[] = []): AdminNavGroup[] {
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasPermission(permissions, item.permission, roles))
  })).filter((group) => group.items.length > 0);
}

export function filterDayOps(permissions: string[], roles: string[] = []) {
  return ADMIN_DAY_OPS.filter((item) => hasPermission(permissions, item.permission, roles));
}

export function findAdminNavContext(pathname: string, search = "") {
  const current = `${pathname}${search}`;
  const matches = ADMIN_NAV_GROUPS.flatMap((group) =>
    group.items.flatMap((item) => {
      const candidate = item;
      const href = candidate.href.split("#")[0]!;
      const matched = href.includes("?")
        ? current === href
        : pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
      return matched ? [{ group, item, score: href.length + (current === href ? 10_000 : 0) }] : [];
    })
  );
  return matches.sort((left, right) => right.score - left.score)[0] ?? null;
}
