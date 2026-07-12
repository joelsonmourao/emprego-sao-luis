# Progresso da implementação

## Visão geral

Branch `codex/reconstrucao-astro`. Arquitetura Astro 7, Drizzle, PostgreSQL, Valkey/BullMQ e Docker preservada. A `main` não é alterada automaticamente.

## Fases concluídas

- Fase 1 — segurança e autenticação administrativa.
- Fase 2 — gestão ampliada de vagas.
- Fase 3 — importação XLSX/CSV com mapeamento e processamento BullMQ.
- Fase 4 — programação em blocos e publicação automática.
- Fase 5 — empresas, categorias, cidades, bairros e redirecionamentos seguros.
- Fase 6 — CMS editorial, autoria, revisões, agendamento e notícias públicas.
- Fase 7 — biblioteca de mídia R2/S3 e configuração visual auditável.
- Fase 8 — SEO técnico, indexação, social studio e página `/instagram`.

## Fase atual

- Fase 9 — alertas multicanal (cadastro, preferências, e-mail, Web Push, painel administrativo).

## Commits principais

- `ba658be` — segurança, recuperação de senha e sessões.
- `c16b268` — identificação do deployment Astro, healthchecks e 404.
- `c9c684a` — edição, duplicação e histórico de vagas.
- `ee9aba3` — ações em lote de vagas.
- `65619eb` — importação administrável de planilhas.
- `d22dc6d` — programação em blocos.
- `535dd46` — empresas, categorias, cidades e bairros.
- `80c8084` — CMS editorial completo.
- `ce3f675` — biblioteca de mídia e aparência.
- `0ffb3ea` — ponto seguro após a Fase 7.
- Commits da Fase 8 — ver `git log --oneline` após os commits desta sessão.

## Migrations

- `0012_public_hex.sql`, `0013_elite_lorna_dane.sql`, `0014_typical_terror.sql` e `0015_abnormal_victor_mancha.sql` aguardam aplicação pelo job de migration no Coolify.
- A Fase 8 não criou novas migrations; usa `es_system_settings` com chave `seo_settings`.
- Migrations são aditivas, versionadas e nunca executadas automaticamente no start do web.

## Testes atuais

- `npm run lint` aprovado.
- `npm run typecheck` aprovado.
- `npm run test` aprovado: 31 testes unitários.
- `npm run migration:check` aprovado.
- `npm run build` aprovado para web e worker.

## Fase 8 — entregas

### SEO geral

- Configurações globais em `es_system_settings` (`seo_settings`): título, description, robots, Open Graph, Twitter, Organization, tipos de conteúdo e links do Instagram.
- Painel `/admin/seo` com formulário real, preview, auditoria e permissão `seo.manage`.
- `BaseLayout` aplica meta tags, canonical, JSON-LD Organization/WebSite/BreadcrumbList.

### JobPosting

- `buildJobPosting` com `identifier` (código ES), `canonicalUrl`, `directApply` condicional e salário somente quando visível.
- `validateJobPosting` indica campos ausentes.

### Sitemaps

- `/sitemap.xml` como índice dinâmico.
- `/sitemaps/{categoria}.xml` para static, jobs, companies, cities, categories, blog (com paginação quando necessário).
- `/sitemap-news.xml` mantido.
- `robots.txt` referencia sitemap principal e news.

### Indexação

- Painel com histórico, contadores, reprocessamento e status de integrações.
- APIs: `/api/admin/indexing`, `/api/admin/indexing/[id]/retry`, `/api/admin/indexing/status`.
- Triggers corrigidos em bulk publish e close/archive.
- Worker respeita `GOOGLE_INDEXING_ENABLED=false`.

### Social studio

- Histórico de publicações, status, erros Meta e preview de PNG.
- Feedback após criação (`?created=1`).

### Página `/instagram`

- Links administráveis via SEO settings.
- Vagas em destaque e recentes.
- Rastreamento de cliques em `/i/:code` via `es_short_links`.

## Bloqueios externos

- Domínio oficial pode ainda estar vinculado ao deployment legado.
- Credenciais Meta, Google Indexing, IndexNow, Resend, R2/S3, Sentry e AdSense apenas no Coolify.
- Migrations 0012–0015 pendentes no Coolify (não bloqueiam dev local).

## Configurações pendentes

- `GOOGLE_INDEXING_CLIENT_EMAIL`, `GOOGLE_INDEXING_PRIVATE_KEY` para Google Indexing API.
- `INDEXNOW_KEY`, `SITE_URL` para IndexNow.
- `META_INSTAGRAM_ACCOUNT_ID`, `META_PAGE_ACCESS_TOKEN` para publicação automática.
- `S3_*` para preview de PNG no painel social.

## Próximos itens internos (Fase 9)

- Painel `/admin/audiencia` com backend real.
- Cadastro opcional, alertas por filtros, frequência, e-mail e Web Push.
- Fila BullMQ `notifications` com templates e fallback sem Resend.
- Histórico, cancelamento e descadastro LGPD.

## Instruções de deploy

1. Backup do PostgreSQL.
2. Aplicar migrations 0012–0015 pelo job `Dockerfile.migrate`.
3. Redeploy web e worker.
4. Validar `/api/health`, `/api/ready`, `X-ES-App: astro`.
5. Validar `/sitemap.xml`, `/admin/seo`, `/admin/social`, `/instagram`.
6. Configurar credenciais externas no Coolify conforme ativação de cada integração.
