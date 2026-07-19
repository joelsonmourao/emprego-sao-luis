export type AdminNavItem = { label: string; href: string; permission?: string };
export type AdminNavGroup = { title: string; items: AdminNavItem[] };

/**
 * Menu administrativo visível. Só inclui rotas com tela existente.
 * Princípio: candidato gratuito; receita B2B / AdSense (desativado) / publicidade identificada.
 *
 * Aliases documentados (redirecionam para a rota canônica):
 * /admin/planos → /admin/comercial/planos
 * /admin/pedidos → /admin/comercial/pedidos
 * /admin/pagamentos → /admin/comercial/pagamentos
 * /admin/creditos → /admin/comercial/creditos
 * /admin/filas e /admin/jobs → /admin/operacao
 */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    title: "Visão geral",
    items: [
      { label: "Dashboard", href: "/admin" },
      { label: "Saúde", href: "/admin/saude" }
    ]
  },
  {
    title: "Vagas",
    items: [
      { label: "Todas as vagas", href: "/admin/vagas", permission: "jobs.read" },
      { label: "Cadastrar vaga", href: "/admin/vagas/nova", permission: "jobs.create" },
      { label: "Importar planilha", href: "/admin/vagas/importar", permission: "imports.manage" },
      { label: "Importar por links ou contatos", href: "/admin/vagas/importar-contatos", permission: "imports.manage" },
      { label: "Revisão e aprovação", href: "/admin/vagas/revisao", permission: "jobs.publish" },
      { label: "Monitor de candidaturas", href: "/admin/vagas/monitor-candidaturas", permission: "jobs.read" },
      { label: "Programação", href: "/admin/programacao", permission: "jobs.publish" }
    ]
  },
  {
    title: "Empresas",
    items: [{ label: "Todas as empresas", href: "/admin/empresas", permission: "companies.manage" }]
  },
  {
    title: "Monetização",
    items: [
      { label: "Planos empresariais", href: "/admin/comercial/planos", permission: "commercial.manage" },
      { label: "Pedidos", href: "/admin/comercial/pedidos", permission: "commercial.manage" },
      { label: "Pagamentos", href: "/admin/comercial/pagamentos", permission: "commercial.manage" },
      { label: "Créditos", href: "/admin/comercial/creditos", permission: "commercial.manage" },
      { label: "Reembolsos", href: "/admin/comercial/reembolsos", permission: "commercial.manage" },
      { label: "Vagas patrocinadas", href: "/admin/vagas-patrocinadas", permission: "commercial.manage" },
      { label: "Perfis empresariais", href: "/admin/perfis-empresariais", permission: "commercial.manage" },
      { label: "Publicidade", href: "/admin/publicidade", permission: "commercial.manage" },
      { label: "Campanhas", href: "/admin/campanhas", permission: "commercial.manage" },
      { label: "Conteúdo patrocinado", href: "/admin/conteudo-patrocinado", permission: "content.manage" },
      { label: "Config. pagamentos", href: "/admin/comercial/configuracao-pagamento", permission: "settings.manage" },
      { label: "Contatos comerciais", href: "/admin/contatos", permission: "commercial.manage" }
    ]
  },
  {
    title: "Conteúdo",
    items: [
      { label: "Notícias e guias", href: "/admin/conteudo", permission: "content.manage" },
      { label: "Redação assistida", href: "/admin/conteudo/estrategia", permission: "content.manage" },
      { label: "Pilares e clusters", href: "/admin/conteudo/pilares", permission: "content.manage" },
      { label: "Post Magnético", href: "/admin/conteudo/post-magnetico", permission: "content.manage" },
      { label: "Web Stories", href: "/admin/web-stories", permission: "content.manage" },
      { label: "Calendário editorial", href: "/admin/calendario-editorial", permission: "content.manage" },
      { label: "Autores e revisores", href: "/admin/autores", permission: "content.manage" },
      { label: "Fontes", href: "/admin/fontes", permission: "content.manage" },
      { label: "Regras de classificação", href: "/admin/classificacao", permission: "content.manage" },
      { label: "Páginas institucionais", href: "/admin/paginas", permission: "content.manage" },
      { label: "Mídia", href: "/admin/midia", permission: "media.manage" },
      { label: "Aparência", href: "/admin/aparencia", permission: "settings.manage" }
    ]
  },
  {
    title: "Localização",
    items: [{ label: "Cidades e bairros", href: "/admin/localidades", permission: "companies.manage" }]
  },
  {
    title: "Audiência",
    items: [{ label: "Alertas e inscrições", href: "/admin/audiencia", permission: "audience.manage" }]
  },
  {
    title: "Marketing",
    items: [
      { label: "Social Studio", href: "/admin/social", permission: "social.manage" },
      { label: "Instagram", href: "/admin/instagram", permission: "social.manage" }
    ]
  },
  {
    title: "SEO e indexação",
    items: [
      { label: "Configurações SEO", href: "/admin/seo", permission: "seo.manage" },
      { label: "Auditoria SEO", href: "/admin/seo/auditoria", permission: "seo.manage" },
      { label: "Rota da Aprovação", href: "/admin/adsense-readiness", permission: "seo.manage" },
      { label: "Links internos", href: "/admin/seo/links-internos", permission: "seo.manage" },
      { label: "Conteúdo órfão e canibalização", href: "/admin/seo/canibalizacao", permission: "seo.manage" }
    ]
  },
  {
    title: "Operação",
    items: [
      { label: "Filas e jobs", href: "/admin/operacao", permission: "queues.manage" },
      { label: "Automações editoriais", href: "/admin/automacoes-editoriais", permission: "queues.manage" },
      { label: "Auditoria", href: "/admin/auditoria", permission: "audit.read" }
    ]
  },
  {
    title: "Usuários e segurança",
    items: [
      { label: "Usuários", href: "/admin/usuarios", permission: "users.manage" },
      { label: "Administradores", href: "/admin/administradores", permission: "users.manage" },
      { label: "Permissões", href: "/admin/permissoes", permission: "users.manage" },
      { label: "Segurança", href: "/admin/seguranca", permission: "settings.manage" }
    ]
  },
  {
    title: "Configurações",
    items: [
      { label: "Identidade visual", href: "/admin/configuracoes/identidade-visual", permission: "settings.brand.view" },
      { label: "Categorias", href: "/admin/categorias", permission: "content.manage" }
    ]
  }
];

export function filterAdminNav(permissions: string[]): AdminNavGroup[] {
  const isSuper = permissions.includes("settings.manage") && permissions.length > 8;
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || permissions.includes(item.permission) || isSuper)
  })).filter((group) => group.items.length > 0);
}
