export type AdminNavItem = { label: string; href: string; permission?: string };
export type AdminNavGroup = { title: string; items: AdminNavItem[] };

/**
 * Menu administrativo: Operação do dia primeiro; demais ferramentas agrupadas.
 * Candidato sempre gratuito. AdSense só via Rota da Aprovação + flag explícita.
 *
 * Aliases: /admin/planos|pedidos|pagamentos|creditos → comercial/*;
 * /admin/filas|/admin/jobs → /admin/operacao; /admin/campanhas → publicidade.
 */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Operação do dia",
    items: [
      { label: "Dashboard", href: "/admin" },
      { label: "1. Importar vagas", href: "/admin/vagas/importar", permission: "imports.manage" },
      { label: "2. Revisar e publicar", href: "/admin/vagas/revisao", permission: "jobs.publish" },
      { label: "3. Monitor de candidaturas", href: "/admin/vagas/monitor-candidaturas", permission: "jobs.read" },
      { label: "4. Post Magnético", href: "/admin/conteudo/post-magnetico", permission: "content.manage" },
      { label: "5. Rota da Aprovação", href: "/admin/adsense-readiness", permission: "seo.manage" },
      { label: "6. Planos e vagas patrocinadas", href: "/admin/comercial/planos", permission: "commercial.manage" }
    ]
  },
  {
    title: "Vagas",
    items: [
      { label: "Todas as vagas", href: "/admin/vagas", permission: "jobs.read" },
      { label: "Cadastrar vaga", href: "/admin/vagas/nova", permission: "jobs.create" },
      { label: "Importar por links ou contatos", href: "/admin/vagas/importar-contatos", permission: "imports.manage" },
      { label: "Programação", href: "/admin/programacao", permission: "jobs.publish" }
    ]
  },
  {
    title: "Conteúdo (Blog Fantasma)",
    items: [
      { label: "Notícias e guias", href: "/admin/conteudo", permission: "content.manage" },
      { label: "Pilares e clusters", href: "/admin/conteudo/pilares", permission: "content.manage" },
      { label: "Redação assistida", href: "/admin/conteudo/estrategia", permission: "content.manage" },
      { label: "Qualidade editorial", href: "/admin/qualidade-editorial", permission: "content.manage" },
      { label: "Web Stories", href: "/admin/web-stories", permission: "content.manage" },
      { label: "Calendário editorial", href: "/admin/calendario-editorial", permission: "content.manage" },
      { label: "Autores e revisores", href: "/admin/autores", permission: "content.manage" },
      { label: "Fontes", href: "/admin/fontes", permission: "content.manage" },
      { label: "Regras de classificação", href: "/admin/classificacao", permission: "content.manage" }
    ]
  },
  {
    title: "Monetização B2B",
    items: [
      { label: "Vagas patrocinadas", href: "/admin/vagas-patrocinadas", permission: "commercial.manage" },
      { label: "Pedidos", href: "/admin/comercial/pedidos", permission: "commercial.manage" },
      { label: "Pagamentos", href: "/admin/comercial/pagamentos", permission: "commercial.manage" },
      { label: "Créditos", href: "/admin/comercial/creditos", permission: "commercial.manage" },
      { label: "Reembolsos", href: "/admin/comercial/reembolsos", permission: "commercial.manage" },
      { label: "Perfis empresariais", href: "/admin/perfis-empresariais", permission: "commercial.manage" },
      { label: "Publicidade", href: "/admin/publicidade", permission: "commercial.manage" },
      { label: "Campanhas", href: "/admin/campanhas", permission: "commercial.manage" },
      { label: "Conteúdo patrocinado", href: "/admin/conteudo-patrocinado", permission: "content.manage" },
      { label: "Config. pagamentos", href: "/admin/comercial/configuracao-pagamento", permission: "settings.manage" },
      { label: "Contatos comerciais", href: "/admin/contatos", permission: "commercial.manage" }
    ]
  },
  {
    title: "Empresas e local",
    items: [
      { label: "Todas as empresas", href: "/admin/empresas", permission: "companies.manage" },
      { label: "Cidades e bairros", href: "/admin/localidades", permission: "companies.manage" }
    ]
  },
  {
    title: "Mais ferramentas",
    items: [
      { label: "Saúde", href: "/admin/saude" },
      { label: "Páginas institucionais", href: "/admin/paginas", permission: "content.manage" },
      { label: "Mídia", href: "/admin/midia", permission: "media.manage" },
      { label: "Aparência", href: "/admin/aparencia", permission: "settings.manage" },
      { label: "Alertas e inscrições", href: "/admin/audiencia", permission: "audience.manage" },
      { label: "Social Studio", href: "/admin/social", permission: "social.manage" },
      { label: "Instagram", href: "/admin/instagram", permission: "social.manage" },
      { label: "Configurações SEO", href: "/admin/seo", permission: "seo.manage" },
      { label: "Integrações", href: "/admin/integracoes", permission: "seo.manage" },
      { label: "Auditoria SEO", href: "/admin/seo/auditoria", permission: "seo.manage" },
      { label: "Links internos", href: "/admin/seo/links-internos", permission: "seo.manage" },
      { label: "Conteúdo órfão e canibalização", href: "/admin/seo/canibalizacao", permission: "seo.manage" },
      { label: "Filas e jobs", href: "/admin/operacao", permission: "queues.manage" },
      { label: "Automações editoriais", href: "/admin/automacoes-editoriais", permission: "queues.manage" },
      { label: "Auditoria", href: "/admin/auditoria", permission: "audit.read" },
      { label: "Usuários", href: "/admin/usuarios", permission: "users.manage" },
      { label: "Administradores", href: "/admin/administradores", permission: "users.manage" },
      { label: "Permissões", href: "/admin/permissoes", permission: "users.manage" },
      { label: "Segurança", href: "/admin/seguranca", permission: "settings.manage" },
      { label: "Identidade visual", href: "/admin/configuracoes/identidade-visual", permission: "settings.brand.view" },
      { label: "Categorias", href: "/admin/categorias", permission: "content.manage" }
    ]
  }
];

/** Atalhos do dashboard — ordem fixa da operação diária. */
export const ADMIN_DAY_OPS: AdminNavItem[] = [
  {
    label: "Importar vagas",
    href: "/admin/vagas/importar",
    permission: "imports.manage"
  },
  {
    label: "Revisar e publicar",
    href: "/admin/vagas/revisao",
    permission: "jobs.publish"
  },
  {
    label: "Monitor de candidaturas",
    href: "/admin/vagas/monitor-candidaturas",
    permission: "jobs.read"
  },
  {
    label: "Post Magnético",
    href: "/admin/conteudo/post-magnetico",
    permission: "content.manage"
  },
  {
    label: "Rota da Aprovação",
    href: "/admin/adsense-readiness",
    permission: "seo.manage"
  },
  {
    label: "Planos e patrocínios",
    href: "/admin/comercial/planos",
    permission: "commercial.manage"
  }
];

export function filterAdminNav(permissions: string[]): AdminNavGroup[] {
  const isSuper = permissions.includes("settings.manage") && permissions.length > 8;
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || permissions.includes(item.permission) || isSuper)
  })).filter((group) => group.items.length > 0);
}

export function filterDayOps(permissions: string[]): AdminNavItem[] {
  const isSuper = permissions.includes("settings.manage") && permissions.length > 8;
  return ADMIN_DAY_OPS.filter((item) => !item.permission || permissions.includes(item.permission) || isSuper);
}
