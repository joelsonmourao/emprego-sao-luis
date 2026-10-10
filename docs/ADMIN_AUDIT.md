# Auditoria do painel administrativo

Data: 2026-07-13  
Branch: `codex/reconstrucao-astro`  
Domínio: https://empregossaoluis.com.br

## Resumo executivo

| Métrica | Valor |
|---|---|
| Itens de menu auditados | 28 |
| Páginas administrativas inventariadas | 41+ |
| APIs administrativas inventariadas | 68 |
| Links de menu para `/api` | 0 (corrigido) |
| Rota de importação canônica | `/admin/vagas/importar` |
| Causa do 500 em `/api/admin/imports` | exceção não tratada (S3/R2 ou fila ausente) |

## Causa do erro `/api/admin/imports`

1. O formulário em `/admin/importacao` usava `action="/api/admin/imports"`, fazendo o navegador **navegar** para a API.
2. A API lançava exceção quando `S3_BUCKET`/`REDIS_URL` não estavam configurados (`putPrivateObject`, `createImportQueue`) sem `try/catch` → **HTTP 500** genérico.
3. Respostas de sucesso usavam `redirect()` em vez de JSON, incompatível com submissão direta no navegador.

## Correções aplicadas

### Importação
- Nova página: `/admin/vagas/importar` com etapas, histórico, breadcrumb e estados vazio/erro.
- Redirect 301: `/admin/importacao` → `/admin/vagas/importar`.
- Menu atualizado para `/admin/vagas/importar`.
- APIs de importação retornam JSON estruturado, `GET → 405`, erros de arquivo sem 500.
- Download de rejeitadas via `data-admin-download` (fetch + blob).

### Navegação para API
- `AdminLayout` injeta ponte JS que intercepta `form[action^="/api/"]` e usa `fetch` + redirect JSON.
- Dashboard e Saúde deixaram de abrir `/api/ready` e `/api/health` em nova aba.

## Inventário do menu (28 rotas)

| Módulo | Rota | Status | Permissão | API principal |
|---|---|---|---|---|
| Visão geral | `/admin` | OK | autenticado | métricas internas |
| Visão geral | `/admin/saude` | OK | autenticado | `/api/ready` via fetch |
| Vagas | `/admin/vagas` | OK | `jobs.read` | listagem interna |
| Vagas | `/admin/vagas/nova` | OK | `jobs.create` | `POST /api/admin/jobs` via bridge |
| Vagas | `/admin/vagas/importar` | OK | `imports.manage` | `POST /api/admin/imports` via bridge |
| Vagas | `/admin/programacao` | OK | `jobs.publish` | `POST /api/admin/schedules` via bridge |
| Empresas | `/admin/empresas` | OK | `companies.manage` | `POST /api/admin/companies` via bridge |
| Comercial | `/admin/comercial/planos` | OK | `commercial.manage` | APIs comerciais |
| Comercial | `/admin/comercial/pedidos` | OK | `commercial.manage` | APIs comerciais |
| Comercial | `/admin/comercial/pagamentos` | OK | `commercial.manage` | APIs comerciais |
| Comercial | `/admin/comercial/creditos` | OK | `commercial.manage` | APIs comerciais |
| Comercial | `/admin/comercial/reembolsos` | OK | `commercial.manage` | APIs comerciais |
| Comercial | `/admin/comercial/configuracao-pagamento` | OK | `settings.manage` | API pagamentos |
| Comercial | `/admin/contatos` | OK | `commercial.manage` | leitura interna |
| Conteúdo | `/admin/conteudo` | OK | `content.manage` | `POST /api/admin/authors` via bridge |
| Conteúdo | `/admin/paginas` | OK | `content.manage` | `POST /api/admin/pages` via bridge |
| Conteúdo | `/admin/midia` | OK | `media.manage` | `POST /api/admin/media` via bridge |
| Conteúdo | `/admin/aparencia` | OK | `settings.manage` | `POST /api/admin/appearance` via bridge |
| Localização | `/admin/localidades` | OK | `companies.manage` | APIs de localização via bridge |
| Audiência | `/admin/audiencia` | OK | `audience.manage` | cancelamento via bridge |
| Marketing | `/admin/social` | OK | `social.manage` | `POST /api/admin/social` via bridge |
| Marketing | `/admin/instagram` | OK | `social.manage` | `POST /api/admin/instagram-cta` via bridge |
| Marketing | `/admin/publicidade` | OK | `ads.manage` | APIs de ads via bridge |
| SEO | `/admin/seo` | OK | `seo.manage` | `POST /api/admin/seo` via bridge |
| SEO | `/admin/seo/auditoria` | OK | `seo.manage` | `GET /api/admin/seo/audit` via fetch |
| Operação | `/admin/operacao` | OK | `queues.manage` | filas via bridge |
| Usuários | `/admin/usuarios` | OK | `users.manage` | ações via bridge |
| Usuários | `/admin/administradores` | OK | `users.manage` | `POST /api/admin/admins` via bridge |
| Usuários | `/admin/permissoes` | OK | `users.manage` | permissões via bridge |
| Usuários | `/admin/auditoria` | OK | `audit.read` | export via `data-admin-download` |
| Usuários | `/admin/seguranca` | OK | `settings.manage` | sessões via bridge |
| Configurações | `/admin/configuracoes/identidade-visual` | OK | `settings.brand.view` | brand API via fetch |
| Configurações | `/admin/categorias` | OK | `content.manage` | categorias via bridge |

## Rotas administrativas adicionais (fora do menu)

| Rota | Função |
|---|---|
| `/admin/vagas/[id]/editar` | Edição de vaga |
| `/admin/vagas/[id]/historico` | Histórico da vaga |
| `/admin/conteudo/novo` | Novo artigo |
| `/admin/conteudo/[id]/editar` | Editar artigo |
| `/admin/comercial/pedidos/[code]` | Detalhe do pedido |
| `/admin/login` | Login público |
| `/admin/esqueci-senha` | Recuperação |
| `/admin/redefinir-senha` | Redefinição |
| `/admin/importacao` | Redirect legado |

## APIs administrativas (68 arquivos)

Todas exigem autenticação via middleware, exceto `/api/admin/login`.

Prioridade de padronização aplicada nas APIs de **importação**:
- `GET` → `405` + `Allow`
- erros → JSON `{ ok: false, error, details? }`
- sucesso com navegação → JSON `{ ok: true, redirect }`

Demais APIs administrativas continuam usando `redirect(303)` mas **não são mais abertas diretamente** graças à ponte de formulários no layout.

## Links diretos para `/api` encontrados (antes da correção)

| Arquivo | Tipo | Tratamento |
|---|---|---|
| `admin/importacao.astro` | `action` upload | substituído por `/admin/vagas/importar` + bridge |
| `admin/index.astro` | `href` readiness | → `/admin/saude` |
| `admin/saude.astro` | `href` health | → botão com fetch |
| `admin/usuarios.astro` | `href` export CSV | bridge download |
| `admin/publicidade.astro` | `href` reports CSV | bridge download |
| `admin/importacao.astro` | `href` rejected.csv | bridge download |
| demais páginas admin | `action="/api/..."` | bridge global no layout |

## Migrations

Nenhuma migration corretiva necessária nesta rodada. `npm run migration:check` validado contra schema existente até `0020`.

## Testes

- `apps/web/src/lib/admin-panel-audit.test.ts` — inventário estático
- `tests/e2e/admin-panel-smoke.spec.ts` — percorre menu autenticado (requer `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD`)

## Pendências conhecidas

1. Padronizar **todas** as 68 APIs admin para JSON + `GET 405` (hoje priorizado importação).
2. Converter exportações CSV restantes para `data-admin-download`.
3. Página dedicada `/admin/sem-permissao` para 403 RBAC (hoje redirect com query string).

## Passos no Coolify

1. Redeploy da aplicação web na branch `codex/reconstrucao-astro`.
2. Confirmar variáveis: `DATABASE_URL`, `AUTH_SECRET`, `S3_*` (importação), `REDIS_URL` (fila).
3. Testar `/admin/vagas/importar` após login — não deve abrir `/api/admin/imports` no navegador.
4. Se importação falhar com mensagem de armazenamento, configurar S3/R2 antes de novo teste.
