# Inventário do sistema

> Gerado automaticamente em 2026-07-14 por `scripts/generate-system-inventory.mjs`. Reexecute após mudanças estruturais.

## Resumo

| Métrica | Contagem |
|---|---|
| Páginas públicas (sem api/admin/empresa) | 56 |
| Páginas admin | 43 |
| Páginas empresa | 10 |
| **Total páginas** | **109** |
| Rotas API | 98 |
| Itens menu admin | 33 |
| Tabelas DB | 59 |
| Migrations SQL | 21 |
| Scripts seed | 9 |
| Filas BullMQ | 4 |
| Variáveis .env.example | 49 |
| Formulários HTML (páginas) | 83 |
| Formulários com action /api | 35 |
| Itens com correção pendente | 66 |
| Itens OK (auditoria) | 45 |
| Correções desta sessão (import/bridge/login) | 45 |
| APIs admin pendentes JSON+405 | 63 |

### Auditoria 2026-07-13

Correções marcadas OK nesta sessão: importação (`/admin/vagas/importar`), bridge de formulários no AdminLayout, GET→405 nas APIs de importação/jobs/quick, saúde operacional sem navegação direta para API, separação login admin/empresa.

Pendências globais: padronizar JSON+405 em todas APIs admin (~89 rotas), página `/admin/sem-permissao`, exports CSV restantes via `data-admin-download`.

## Menu administrativo (admin-nav.ts)

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /admin | Visão geral — Dashboard | Staff interno | Autenticado admin | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/saude | Visão geral — Saúde | Staff interno | Autenticado admin | GET /api/ready (fetch) | — | Redis, PostgreSQL | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/vagas | Vagas — Todas as vagas | Staff interno | jobs.read | GET interno + POST /api/admin/jobs/bulk | es_jobs | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/vagas/nova | Vagas — Nova vaga | Staff interno | jobs.create | POST /api/admin/jobs (bridge) | es_jobs, es_companies, es_cities | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/vagas/importar | Vagas — Importar planilha | Staff interno | imports.manage | POST /api/admin/imports (bridge) | es_import_batches, es_import_rows | S3/R2, Redis (job-imports) | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/programacao | Vagas — Programação | Staff interno | jobs.publish | POST /api/admin/schedules | es_publication_schedules | Redis maintenance | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/empresas | Empresas — Todas as empresas | Staff interno | companies.manage | POST /api/admin/companies | es_companies | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/planos | Comercial — Planos | Staff interno | commercial.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/pedidos | Comercial — Pedidos | Staff interno | commercial.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/pagamentos | Comercial — Pagamentos | Staff interno | commercial.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/creditos | Comercial — Créditos | Staff interno | commercial.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/reembolsos | Comercial — Reembolsos | Staff interno | commercial.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/configuracao-pagamento | Comercial — Config. pagamentos | Staff interno | settings.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/contatos | Comercial — Contatos | Staff interno | commercial.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/conteudo | Conteúdo — Notícias e blog | Staff interno | content.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/paginas | Conteúdo — Páginas institucionais | Staff interno | content.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/midia | Conteúdo — Mídia | Staff interno | media.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/aparencia | Conteúdo — Aparência | Staff interno | settings.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/localidades | Localização — Cidades e bairros | Staff interno | companies.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/audiencia | Audiência — Alertas e inscrições | Staff interno | audience.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/social | Marketing — Social Studio | Staff interno | social.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/instagram | Marketing — Instagram | Staff interno | social.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/publicidade | Marketing — Publicidade | Staff interno | ads.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/seo | SEO e indexação — Configurações SEO | Staff interno | seo.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/seo/auditoria | SEO e indexação — Auditoria SEO | Staff interno | seo.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/operacao | Operação — Filas e jobs | Staff interno | queues.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/usuarios | Usuários e segurança — Usuários | Staff interno | users.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/administradores | Usuários e segurança — Administradores | Staff interno | users.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/permissoes | Usuários e segurança — Permissões | Staff interno | users.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/auditoria | Usuários e segurança — Auditoria | Staff interno | audit.read | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/seguranca | Usuários e segurança — Segurança | Staff interno | settings.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/configuracoes/identidade-visual | Configurações — Identidade visual | Staff interno | settings.brand.view | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/categorias | Configurações — Categorias | Staff interno | content.manage | via bridge/fetch | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |

## Páginas públicas

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | Home do portal de vagas | Visitantes | Público | — | jobs, companies, articles | — | Ativo | admin-full-audit.spec.ts (público /) | OK | — |
| /[indexnowKey].txt | Dinâmico.txt | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /404 | 404 | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /acesso | Acesso | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /ads.txt | Ads.txt | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /alertas | Inscrição em alertas de vagas | Visitantes | Público | POST /api/subscriptions | es_subscriptions, es_alerts | Resend | Ativo | — | — | — |
| /anunciar-vaga | Anunciar vaga | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /area-empresas | Area empresas | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /blog | Alias/redirect blog | Visitantes | Público | — | es_articles | — | Ativo | — | — | — |
| /blog/[slug] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /busca | Busca global | Visitantes | Público | — | es_jobs, es_companies, es_articles | — | Ativo | admin-full-audit.spec.ts | — | — |
| /categorias | Categorias | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /categorias/[slug] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /confirmar-alerta | Confirmar alerta | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /contato | Formulário de contato | Visitantes | Público | POST /api/contato | es_contact_submissions | Turnstile (opcional) | Ativo | admin-full-audit.spec.ts | — | — |
| /cookies | Cookies | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /descadastrar | Descadastrar | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /empresas | Diretório de empresas | Visitantes | Público | — | es_companies | — | Ativo | admin-full-audit.spec.ts | — | — |
| /empresas/[slug] | Perfil público da empresa | Visitantes | Público | — | es_companies, es_jobs | — | Ativo | — | — | — |
| /entrar | Login candidato (magic link) | Candidatos | Público | POST /api/account/request-link | es_users, es_magic_link_tokens | Resend | Ativo | — | — | — |
| /feed.xml | Feed.xml | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /i | I | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /i/[code] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /instagram | Instagram | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /lgpd | Lgpd | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /minha-conta | Área do candidato | Candidatos | Sessão candidato | /api/account/logout | es_users, es_saved_jobs | — | Ativo | — | — | Evitar navegação direta /api |
| /noticias | Listagem de notícias/blog | Visitantes | Público | — | es_articles | — | Ativo | admin-full-audit.spec.ts | — | — |
| /noticias/[slug] | Artigo/notícia | Visitantes | Público | — | es_articles | — | Ativo | — | — | — |
| /politica-correcoes | Politica correcoes | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /politica-editorial | Politica editorial | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /politica-fontes | Politica fontes | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /privacidade | Privacidade | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /publicar-vaga | Funil comercial de publicação | Empresas anônimas | Público | — | es_commercial_plans, es_commercial_orders | Gateway pagamento | Ativo | — | — | — |
| /publicar-vaga/cadastro | Cadastro | Visitantes/candidatos | Público | /api/commercial/job-draft | — | — | Ativo | — | — | — |
| /publicar-vaga/confirmacao/[code] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /publicar-vaga/pedido/[code] | Dinâmico | Visitantes/candidatos | Público | /api/commercial/pay | — | — | Ativo | — | — | — |
| /publicar-vaga/plano/[slug] | Dinâmico | Visitantes/candidatos | Público | /api/commercial/order | — | — | Ativo | — | — | — |
| /publicar-vaga/resumo/[code] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /quem-somos | Quem somos | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /recuperar-admin | Recuperar admin | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /redefinir-admin | Redefinir admin | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /robots.txt | Robots.txt | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /seguranca-candidatos | Seguranca candidatos | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /sitemap-news.xml | Sitemap news.xml | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /sitemap.xml | Sitemap.xml | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /sitemaps/[slug].xml | Dinâmico.xml | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /sobre | Sobre | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /termos | Termos | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /trabalhe-conosco | Trabalhe conosco | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /vagas | Listagem de vagas publicadas | Candidatos | Público | — | es_jobs | — | Ativo | admin-full-audit.spec.ts | — | — |
| /vagas/[slug] | Detalhe da vaga | Candidatos | Público | /api/account/saved-jobs | es_jobs, es_companies | Google JobPosting JSON-LD | Ativo | — | — | — |
| /vagas/bairro/[slug] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /vagas/categoria/[slug] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /vagas/cidade/[slug] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /vagas/estado/[uf] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |
| /vagas/indisponivel/[slug] | Dinâmico | Visitantes/candidatos | Público | — | — | — | Ativo | — | — | — |

## Páginas admin (todas)

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /admin | Dashboard administrativo | Staff interno | Autenticado admin | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/[module] | Dinâmico | Staff interno | Autenticado admin | — | — | — | Ativo | admin-panel-audit.test.ts, admin-nav.test.ts | — | — |
| /admin/administradores | Administradores | Staff interno | users.manage | /api/admin/admins | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/aparencia | Aparencia | Staff interno | settings.manage | /api/admin/appearance | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/audiencia | Audiencia | Staff interno | audience.manage | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/auditoria | Auditoria | Staff interno | audit.read | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/categorias | Categorias | Staff interno | content.manage | /api/admin/categories | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/configuracao-pagamento | Configuracao pagamento | Staff interno | settings.manage | /api/admin/commercial/payment-settings | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/creditos | Creditos | Staff interno | commercial.manage | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/pagamentos | Pagamentos | Staff interno | commercial.manage | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/pedidos | Pedidos | Staff interno | commercial.manage | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/pedidos/[code] | Dinâmico | Staff interno | Autenticado admin | — | — | — | Ativo | admin-panel-audit.test.ts, admin-nav.test.ts | — | — |
| /admin/comercial/planos | Planos | Staff interno | commercial.manage | /api/admin/commercial/plans | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/comercial/reembolsos | Reembolsos | Staff interno | commercial.manage | /api/admin/commercial/refunds | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/configuracoes/identidade-visual | Identidade visual | Staff interno | settings.brand.view | /api/admin/brand-identity?history=1 | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/contatos | Contatos | Staff interno | commercial.manage | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/conteudo | Conteudo | Staff interno | content.manage | /api/admin/authors | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/conteudo/[id]/editar | Editar | Staff interno | Autenticado admin | — | — | — | Ativo | admin-panel-audit.test.ts, admin-nav.test.ts | — | — |
| /admin/conteudo/novo | Novo | Staff interno | Autenticado admin | /api/admin/articles | — | — | Ativo | admin-panel-audit.test.ts, admin-nav.test.ts | — | — |
| /admin/empresas | Gestão de empresas | Staff interno | companies.manage | POST /api/admin/companies | es_companies | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/esqueci-senha | Esqueci senha | Staff interno | Autenticado admin | /api/auth/admin-password/request | — | — | Ativo | admin-panel-audit.test.ts, admin-nav.test.ts | — | — |
| /admin/importacao | Redirect legado → importar | Staff interno | imports.manage | — | — | — | OK (301) | admin-panel-audit.test.ts | OK | — |
| /admin/instagram | Instagram | Staff interno | social.manage | /api/admin/instagram-cta | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/localidades | Localidades | Staff interno | companies.manage | /api/admin/locations/cities | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/login | Login administrativo | Staff interno | Público | POST /api/admin/login (fetch JSON) | — | — | OK | auth-routes.test.ts | OK | — |
| /admin/midia | Midia | Staff interno | media.manage | /api/admin/media | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/operacao | Operacao | Staff interno | queues.manage | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/paginas | Paginas | Staff interno | content.manage | /api/admin/pages | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/permissoes | Permissoes | Staff interno | users.manage | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/programacao | Programação de publicações | Staff interno | jobs.publish | POST /api/admin/schedules | es_publication_schedules | Redis maintenance | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/publicidade | Publicidade | Staff interno | ads.manage | /api/admin/ads/settings | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | Evitar navegação direta /api |
| /admin/redefinir-senha | Redefinir senha | Staff interno | Autenticado admin | /api/auth/admin-password/reset | — | — | Ativo | admin-panel-audit.test.ts, admin-nav.test.ts | — | — |
| /admin/saude | Saúde operacional (DB/Redis) | Staff interno | Autenticado admin | GET /api/ready (fetch) | — | Redis, PostgreSQL | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/seguranca | Seguranca | Staff interno | settings.manage | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/seo | Seo | Staff interno | seo.manage | /api/admin/seo | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/seo/auditoria | Auditoria | Staff interno | seo.manage | /api/admin/seo/audit | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/social | Social | Staff interno | social.manage | /api/admin/social | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/usuarios | Usuarios | Staff interno | users.manage | — | — | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | Evitar navegação direta /api |
| /admin/vagas | Gestão de vagas | Staff interno | jobs.read | GET interno + POST /api/admin/jobs/bulk | es_jobs | — | OK | admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/vagas/[id]/editar | Editar vaga existente | Staff interno | jobs.update | POST /api/admin/jobs/[id]/update | es_jobs, es_job_revisions | — | Ativo | admin-panel-audit.test.ts, admin-nav.test.ts | — | — |
| /admin/vagas/[id]/historico | Histórico de revisões | Staff interno | jobs.read | — | es_job_revisions | — | Ativo | admin-panel-audit.test.ts, admin-nav.test.ts | — | — |
| /admin/vagas/importar | Importação por planilha | Staff interno | imports.manage | POST /api/admin/imports (bridge) | es_import_batches, es_import_rows | S3/R2, Redis (job-imports) | OK (corrigido) | admin-full-audit.spec.ts, admin-panel-audit.test.ts | OK | — |
| /admin/vagas/nova | Criar vaga manual | Staff interno | jobs.create | POST /api/admin/jobs (bridge) | es_jobs, es_companies, es_cities | — | OK | admin-full-audit.spec.ts (nova vaga) | OK | — |

## Páginas empresa

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /empresa | Empresa | Contas empresariais | Sessão empresa | — | — | — | Ativo | — | — | — |
| /empresa/convite/[token] | Aceitar convite de equipe | Convidados | Token convite | POST /api/empresa/convite | es_company_accounts | — | Ativo | — | — | — |
| /empresa/creditos | Saldo de créditos | Contas empresariais | Sessão empresa | — | es_company_credits | — | Ativo | — | — | — |
| /empresa/dashboard | Painel da empresa | Contas empresariais | Sessão empresa | — | es_company_accounts, es_company_credits | — | Ativo | — | — | — |
| /empresa/login | Login área empresa | Contas empresariais | Público | POST /api/empresa/login | es_company_accounts | — | OK | auth-routes.test.ts | OK | — |
| /empresa/pagamentos | Histórico de pagamentos | Contas empresariais | Sessão empresa | — | es_commercial_payments | — | Ativo | — | — | — |
| /empresa/pedidos | Pedidos comerciais | Contas empresariais | Sessão empresa | — | es_commercial_orders | — | Ativo | — | — | — |
| /empresa/perfil | Perfil da conta empresa | Contas empresariais | Sessão empresa | — | es_company_accounts, es_companies | — | Ativo | — | — | — |
| /empresa/suporte | Tickets de suporte | Contas empresariais | Sessão empresa | POST /api/empresa/tickets | es_company_tickets | — | Ativo | — | — | — |
| /empresa/vagas | Rascunhos/publicações empresa | Contas empresariais | Sessão empresa | — | es_company_job_drafts, es_jobs | — | Ativo | — | — | — |

## Rotas API

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /api/account/delete | API POST — delete | Visitantes/sistemas | Sessão candidato ou público | /api/account/delete | es_users, es_candidate_sessions | PostgreSQL | Ativo | — | — | — |
| /api/account/export | API GET — export | Visitantes/sistemas | Sessão candidato ou público | /api/account/export | es_users, es_candidate_sessions | PostgreSQL | Ativo | — | — | — |
| /api/account/logout | API POST — logout | Visitantes/sistemas | Sessão candidato ou público | /api/account/logout | es_users, es_candidate_sessions | PostgreSQL | Ativo | — | — | — |
| /api/account/request-link | API POST — request-link | Visitantes/sistemas | Sessão candidato ou público | /api/account/request-link | es_users, es_candidate_sessions | PostgreSQL, Redis/BullMQ | Ativo | — | — | — |
| /api/account/saved-jobs | API POST — saved-jobs | Visitantes/sistemas | Sessão candidato ou público | /api/account/saved-jobs | es_users, es_candidate_sessions | PostgreSQL | Ativo | — | — | — |
| /api/admin/admins | API POST — admins | Staff interno | users.manage | /api/admin/admins | es_users, es_roles | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/admins/[id]/block | API POST — block | Staff interno | users.manage | /api/admin/admins/[id]/block | es_users, es_roles | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/admins/[id]/role | API POST — role | Staff interno | users.manage | /api/admin/admins/[id]/role | es_users, es_roles | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/admins/[id]/sessions/revoke | API POST — revoke | Staff interno | users.manage | /api/admin/admins/[id]/sessions/revoke | es_users, es_roles | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/admins/[id]/unblock | API POST — unblock | Staff interno | users.manage | /api/admin/admins/[id]/unblock | es_users, es_roles | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/ads/advertisers | API POST — advertisers | Staff interno | commercial.manage | /api/admin/ads/advertisers | es_ad_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/ads/campaigns | API POST — campaigns | Staff interno | commercial.manage | /api/admin/ads/campaigns | es_ad_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/ads/reports.csv | API GET — reports.csv | Staff interno | ads.manage | /api/admin/ads/reports.csv | es_ad_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/ads/settings | API POST — settings | Staff interno | commercial.manage | /api/admin/ads/settings | es_ad_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/ads/slots | API POST — slots | Staff interno | commercial.manage | /api/admin/ads/slots | es_ad_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/appearance | API POST — appearance | Staff interno | settings.manage | /api/admin/appearance | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/articles | API POST — articles | Staff interno | content.manage | /api/admin/articles | es_articles | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/articles/[id] | API POST — [id] | Staff interno | content.manage | /api/admin/articles/[id] | es_articles | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/audience/[id]/cancel | API POST — cancel | Staff interno | audience.manage | /api/admin/audience/[id]/cancel | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/audit/export.csv | API GET — export.csv | Staff interno | audit.read | /api/admin/audit/export.csv | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/authors | API POST — authors | Staff interno | content.manage | /api/admin/authors | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/brand-identity | API GET/PUT — brand-identity | Staff interno | settings.brand.view | /api/admin/brand-identity | es_brand_assets | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/brand-identity/upload | API POST/PATCH/DELETE — upload | Staff interno | settings.brand.view | /api/admin/brand-identity/upload | es_brand_assets | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/categories | API POST — categories | Staff interno | settings.manage | /api/admin/categories | es_categories | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/categories/merge | API POST — merge | Staff interno | settings.manage | /api/admin/categories/merge | es_categories | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/categories/quick | API GET/POST — quick | Staff interno | content.manage | /api/admin/categories/quick | es_categories | PostgreSQL | OK (JSON+405) | admin-panel-audit.test.ts, admin-full-audit.spec.ts | OK | — |
| /api/admin/commercial/credits | API GET — credits | Staff interno | commercial.manage | /api/admin/commercial/credits | es_commercial_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/commercial/orders | API GET — orders | Staff interno | commercial.manage | /api/admin/commercial/orders | es_commercial_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/commercial/orders/[code] | API GET/POST — [code] | Staff interno | commercial.manage | /api/admin/commercial/orders/[code] | es_commercial_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/commercial/payment-settings | API GET/PUT — payment-settings | Staff interno | commercial.manage | /api/admin/commercial/payment-settings | es_commercial_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/commercial/payments | API GET — payments | Staff interno | commercial.manage | /api/admin/commercial/payments | es_commercial_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/commercial/payments/[id]/action | API POST — action | Staff interno | commercial.manage | /api/admin/commercial/payments/[id]/action | es_commercial_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/commercial/plans | API GET/POST — plans | Staff interno | commercial.manage | /api/admin/commercial/plans | es_commercial_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/commercial/plans/[id] | API GET/PUT/DELETE — [id] | Staff interno | commercial.manage | /api/admin/commercial/plans/[id] | es_commercial_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/commercial/refunds | API GET/POST — refunds | Staff interno | commercial.manage | /api/admin/commercial/refunds | es_commercial_* | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/companies | API POST — companies | Staff interno | companies.manage | /api/admin/companies | es_companies | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/companies/merge | API POST — merge | Staff interno | companies.manage | /api/admin/companies/merge | es_companies | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/companies/quick | API GET/POST — quick | Staff interno | companies.manage | /api/admin/companies/quick | es_companies | PostgreSQL | OK (JSON+405) | admin-panel-audit.test.ts, admin-full-audit.spec.ts | OK | — |
| /api/admin/imports | Upload de planilha de importação | Staff interno | imports.manage | /api/admin/imports | es_import_batches, es_import_rows | S3/R2, Redis | OK (JSON+405) | admin-panel-audit.test.ts, admin-full-audit.spec.ts | OK | — |
| /api/admin/imports/[id]/configure | API GET/POST — configure | Staff interno | imports.manage | /api/admin/imports/[id]/configure | es_import_batches, es_import_rows | PostgreSQL, Redis/BullMQ | OK (JSON+405) | admin-panel-audit.test.ts, admin-full-audit.spec.ts | OK | — |
| /api/admin/imports/[id]/execute | API GET/POST — execute | Staff interno | imports.manage | /api/admin/imports/[id]/execute | es_import_batches, es_import_rows | PostgreSQL, Redis/BullMQ | OK (JSON+405) | admin-panel-audit.test.ts, admin-full-audit.spec.ts | OK | — |
| /api/admin/imports/[id]/rejected.csv | API GET — rejected.csv | Staff interno | imports.manage | /api/admin/imports/[id]/rejected.csv | es_import_batches, es_import_rows | PostgreSQL | Ativo (redirect 303) | admin-panel-audit.test.ts, admin-full-audit.spec.ts | OK | Padronizar GET→405 + JSON |
| /api/admin/imports/[id]/undo | API GET/POST — undo | Staff interno | imports.manage | /api/admin/imports/[id]/undo | es_import_batches, es_import_rows | PostgreSQL | OK (JSON+405) | admin-panel-audit.test.ts, admin-full-audit.spec.ts | OK | — |
| /api/admin/indexing | API GET — indexing | Staff interno | Autenticado admin | /api/admin/indexing | es_indexing_events | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/indexing/[id]/retry | API POST — retry | Staff interno | seo.manage | /api/admin/indexing/[id]/retry | es_indexing_events | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/indexing/status | API GET — status | Staff interno | Autenticado admin | /api/admin/indexing/status | es_indexing_events | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/instagram-cta | API POST — instagram-cta | Staff interno | Autenticado admin | /api/admin/instagram-cta | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/jobs | Criar vaga (admin) | Staff interno | jobs.create | /api/admin/jobs | es_jobs | PostgreSQL | OK (GET 405) | admin-full-audit.spec.ts | OK | — |
| /api/admin/jobs/[id]/duplicate | API POST — duplicate | Staff interno | jobs.create | /api/admin/jobs/[id]/duplicate | es_jobs | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/jobs/[id]/status | API POST — status | Staff interno | jobs.publish | /api/admin/jobs/[id]/status | es_jobs | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/jobs/[id]/update | API POST — update | Staff interno | jobs.create | /api/admin/jobs/[id]/update | es_jobs | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/jobs/bulk | API POST — bulk | Staff interno | jobs.publish | /api/admin/jobs/bulk | es_jobs | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/jobs/slug | API GET/POST — slug | Staff interno | jobs.create | /api/admin/jobs/slug | es_jobs | PostgreSQL | OK (JSON+405) | admin-panel-audit.test.ts, admin-full-audit.spec.ts | OK | — |
| /api/admin/locations/cities | API POST — cities | Staff interno | settings.manage | /api/admin/locations/cities | es_states, es_cities, es_neighborhoods | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/locations/cities/quick | API GET/POST — quick | Staff interno | settings.manage | /api/admin/locations/cities/quick | es_states, es_cities, es_neighborhoods | PostgreSQL | OK (JSON+405) | admin-panel-audit.test.ts, admin-full-audit.spec.ts | OK | — |
| /api/admin/locations/neighborhoods | API POST — neighborhoods | Staff interno | settings.manage | /api/admin/locations/neighborhoods | es_states, es_cities, es_neighborhoods | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/login | API GET/POST — login | Staff interno | Público | /api/admin/login | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/logout | API POST — logout | Staff interno | Autenticado admin | /api/admin/logout | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/media | API POST — media | Staff interno | media.manage | /api/admin/media | es_media_assets | PostgreSQL, S3/R2 | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/mfa/confirm | API POST — confirm | Staff interno | Autenticado admin | /api/admin/mfa/confirm | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/mfa/setup | API POST — setup | Staff interno | Autenticado admin | /api/admin/mfa/setup | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/operations/jobs/[queue]/[id]/cancel | API POST — cancel | Staff interno | queues.manage | /api/admin/operations/jobs/[queue]/[id]/cancel | es_jobs | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/operations/jobs/[queue]/[id]/retry | API POST — retry | Staff interno | queues.manage | /api/admin/operations/jobs/[queue]/[id]/retry | es_jobs | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/pages | API POST — pages | Staff interno | settings.manage | /api/admin/pages | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/permissions/[roleId] | API POST — [roleId] | Staff interno | users.manage | /api/admin/permissions/[roleId] | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/schedules | API POST — schedules | Staff interno | jobs.publish | /api/admin/schedules | es_publication_schedules | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/schedules/[id]/action | API POST — action | Staff interno | jobs.publish | /api/admin/schedules/[id]/action | es_publication_schedules | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/search | API GET — search | Staff interno | Autenticado admin | /api/admin/search | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/seo | API GET/POST — seo | Staff interno | seo.manage | /api/admin/seo | es_system_settings, es_seo_audit_issues | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/seo/audit | API GET/POST — audit | Staff interno | seo.manage | /api/admin/seo/audit | es_system_settings, es_seo_audit_issues | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/sessions/[id]/revoke | API POST — revoke | Staff interno | Autenticado admin | /api/admin/sessions/[id]/revoke | — | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/social | API POST — social | Staff interno | social.manage | /api/admin/social | es_social_posts | PostgreSQL, Redis/BullMQ | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/users/[id]/anonymize | API POST — anonymize | Staff interno | users.manage | /api/admin/users/[id]/anonymize | es_users | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/users/[id]/block | API POST — block | Staff interno | users.manage | /api/admin/users/[id]/block | es_users | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/users/[id]/sessions/revoke | API POST — revoke | Staff interno | users.manage | /api/admin/users/[id]/sessions/revoke | es_users | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/users/[id]/unblock | API POST — unblock | Staff interno | users.manage | /api/admin/users/[id]/unblock | es_users | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/admin/users/export.csv | API GET — export.csv | Staff interno | users.manage | /api/admin/users/export.csv | es_users | PostgreSQL | Ativo (redirect 303) | admin-full-audit.spec.ts (indireto) | — | Padronizar GET→405 + JSON |
| /api/ads/click | API GET — click | Visitantes/sistemas | Público | /api/ads/click | es_ad_* | PostgreSQL | Ativo | — | — | — |
| /api/ads/impression | API GET — impression | Visitantes/sistemas | Público | /api/ads/impression | es_ad_* | PostgreSQL | Ativo | — | — | — |
| /api/auth/admin-password/request | API GET/POST — request | Visitantes/sistemas | Público | /api/auth/admin-password/request | — | PostgreSQL, Redis/BullMQ | Ativo | — | — | — |
| /api/auth/admin-password/reset | API GET/POST — reset | Visitantes/sistemas | Público | /api/auth/admin-password/reset | — | PostgreSQL | Ativo | — | — | — |
| /api/brand-assets/[...path] | API GET — [...path] | Visitantes/sistemas | Autenticado admin | /api/brand-assets/[...path] | — | PostgreSQL | Ativo | — | — | — |
| /api/brand-manifest.webmanifest | API GET — brand-manifest.webmanifest | Visitantes/sistemas | Autenticado admin | /api/brand-manifest.webmanifest | — | PostgreSQL | Ativo | — | — | — |
| /api/commercial/job-draft | API POST — job-draft | Visitantes/sistemas | Público/empresa | /api/commercial/job-draft | es_commercial_* | PostgreSQL | Ativo | — | — | — |
| /api/commercial/manual-proof | API POST — manual-proof | Visitantes/sistemas | Público/empresa | /api/commercial/manual-proof | es_commercial_* | PostgreSQL | Ativo | — | — | — |
| /api/commercial/order | API POST — order | Visitantes/sistemas | Público/empresa | /api/commercial/order | es_commercial_* | PostgreSQL | Ativo | — | — | — |
| /api/commercial/pay | API POST — pay | Visitantes/sistemas | Público/empresa | /api/commercial/pay | es_commercial_* | PostgreSQL | Ativo | — | — | — |
| /api/consent | API POST — consent | Visitantes/sistemas | Público | /api/consent | es_consent_logs | PostgreSQL | Ativo | — | — | — |
| /api/contato | Receber mensagem de contato | Visitantes | Público | /api/contato | es_contact_submissions | Turnstile | Ativo | — | — | — |
| /api/empresa/convite | API POST — convite | Contas empresariais | Sessão empresa | /api/empresa/convite | es_company_accounts | PostgreSQL | Ativo | — | — | — |
| /api/empresa/login | API POST — login | Contas empresariais | Sessão empresa | /api/empresa/login | es_company_accounts | PostgreSQL | Ativo | — | — | — |
| /api/empresa/logout | API POST — logout | Contas empresariais | Sessão empresa | /api/empresa/logout | es_company_accounts | PostgreSQL | Ativo | — | — | — |
| /api/empresa/tickets | API POST — tickets | Contas empresariais | Sessão empresa | /api/empresa/tickets | es_company_accounts | PostgreSQL | Ativo | — | — | — |
| /api/events/instagram | API POST — instagram | Visitantes/sistemas | Webhook Meta | /api/events/instagram | — | PostgreSQL | Ativo | — | — | — |
| /api/health | Health check liveness | Operação/monitoramento | Público | /api/health | — | — | Ativo | — | — | — |
| /api/payments/webhook | Webhook gateway pagamento | Provedor pagamento | Assinatura webhook | /api/payments/webhook | es_commercial_payments, es_commercial_payment_events | PostgreSQL | Ativo | — | — | — |
| /api/ready | Readiness (DB+Redis) | Operação/monitoramento | Público | /api/ready | — | PostgreSQL, Redis | Ativo | — | — | — |
| /api/subscriptions | API POST — subscriptions | Visitantes/sistemas | Público | /api/subscriptions | es_subscriptions, es_alerts | PostgreSQL, Redis/BullMQ | Ativo | — | — | — |

## Filas BullMQ (worker/web)

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| job-imports | Processar importação de planilhas | Worker interno | — | POST /api/admin/imports/[id]/execute | es_import_batches, es_background_jobs | Redis, S3/R2 | Ativo | operations.test.ts | — | Requer REDIS_URL |
| notifications | E-mails e notificações | Worker interno | — | várias (/api/account, /api/subscriptions) | es_notification_deliveries | Redis, Resend | Ativo | — | — | Requer REDIS_URL + RESEND |
| maintenance | Jobs agendados (expirar, indexar, publicar, alertas) | Worker interno | — | — | es_jobs, es_indexing_events, es_alerts | Redis, Google Indexing | Ativo | worker/indexing.test.ts | — | — |
| social | Publicação Instagram/Meta | Worker interno | — | POST /api/admin/social | es_social_posts, es_social_publications | Redis, Meta API | Ativo | — | — | Requer credenciais Meta |

## Tabelas (packages/db/src/schema.ts)

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es_states | Tabela Drizzle (states) | Aplicação | — | — | es_states | PostgreSQL | Migrado | migration:check | — | — |
| es_cities | Tabela Drizzle (cities) | Aplicação | — | — | es_cities | PostgreSQL | Migrado | migration:check | — | — |
| es_neighborhoods | Tabela Drizzle (neighborhoods) | Aplicação | — | — | es_neighborhoods | PostgreSQL | Migrado | migration:check | — | — |
| es_companies | Tabela Drizzle (companies) | Aplicação | — | — | es_companies | PostgreSQL | Migrado | migration:check | — | — |
| es_categories | Tabela Drizzle (categories) | Aplicação | — | — | es_categories | PostgreSQL | Migrado | migration:check | — | — |
| es_users | Tabela Drizzle (users) | Aplicação | — | — | es_users | PostgreSQL | Migrado | migration:check | — | — |
| es_roles | Tabela Drizzle (roles) | Aplicação | — | — | es_roles | PostgreSQL | Migrado | migration:check | — | — |
| es_permissions | Tabela Drizzle (permissions) | Aplicação | — | — | es_permissions | PostgreSQL | Migrado | migration:check | — | — |
| es_user_roles | Tabela Drizzle (userRoles) | Aplicação | — | — | es_user_roles | PostgreSQL | Migrado | migration:check | — | — |
| es_role_permissions | Tabela Drizzle (rolePermissions) | Aplicação | — | — | es_role_permissions | PostgreSQL | Migrado | migration:check | — | — |
| es_sessions | Tabela Drizzle (sessions) | Aplicação | — | — | es_sessions | PostgreSQL | Migrado | migration:check | — | — |
| es_password_reset_tokens | Tabela Drizzle (passwordResetTokens) | Aplicação | — | — | es_password_reset_tokens | PostgreSQL | Migrado | migration:check | — | — |
| es_candidate_sessions | Tabela Drizzle (candidateSessions) | Aplicação | — | — | es_candidate_sessions | PostgreSQL | Migrado | migration:check | — | — |
| es_magic_link_tokens | Tabela Drizzle (magicLinkTokens) | Aplicação | — | — | es_magic_link_tokens | PostgreSQL | Migrado | migration:check | — | — |
| es_user_job_preferences | Tabela Drizzle (userJobPreferences) | Aplicação | — | — | es_user_job_preferences | PostgreSQL | Migrado | migration:check | — | — |
| es_login_attempts | Tabela Drizzle (loginAttempts) | Aplicação | — | — | es_login_attempts | PostgreSQL | Migrado | migration:check | — | — |
| es_jobs | Tabela Drizzle (jobs) | Aplicação | — | — | es_jobs | PostgreSQL | Migrado | migration:check | — | — |
| es_saved_jobs | Tabela Drizzle (savedJobs) | Aplicação | — | — | es_saved_jobs | PostgreSQL | Migrado | migration:check | — | — |
| es_job_revisions | Tabela Drizzle (jobRevisions) | Aplicação | — | — | es_job_revisions | PostgreSQL | Migrado | migration:check | — | — |
| es_job_sources | Tabela Drizzle (jobSources) | Aplicação | — | — | es_job_sources | PostgreSQL | Migrado | migration:check | — | — |
| es_authors | Tabela Drizzle (authors) | Aplicação | — | — | es_authors | PostgreSQL | Migrado | migration:check | — | — |
| es_articles | Tabela Drizzle (articles) | Aplicação | — | — | es_articles | PostgreSQL | Migrado | migration:check | — | — |
| es_article_revisions | Tabela Drizzle (articleRevisions) | Aplicação | — | — | es_article_revisions | PostgreSQL | Migrado | migration:check | — | — |
| es_media_assets | Tabela Drizzle (mediaAssets) | Aplicação | — | — | es_media_assets | PostgreSQL | Migrado | migration:check | — | — |
| es_brand_assets | Tabela Drizzle (brandAssets) | Aplicação | — | — | es_brand_assets | PostgreSQL | Migrado | migration:check | — | — |
| es_brand_asset_history | Tabela Drizzle (brandAssetHistory) | Aplicação | — | — | es_brand_asset_history | PostgreSQL | Migrado | migration:check | — | — |
| es_redirects | Tabela Drizzle (redirects) | Aplicação | — | — | es_redirects | PostgreSQL | Migrado | migration:check | — | — |
| es_import_batches | Tabela Drizzle (importBatches) | Aplicação | — | — | es_import_batches | PostgreSQL | Migrado | migration:check | — | — |
| es_import_mapping_templates | Tabela Drizzle (importMappingTemplates) | Aplicação | — | — | es_import_mapping_templates | PostgreSQL | Migrado | migration:check | — | — |
| es_import_rows | Tabela Drizzle (importRows) | Aplicação | — | — | es_import_rows | PostgreSQL | Migrado | migration:check | — | — |
| es_audit_logs | Tabela Drizzle (auditLogs) | Aplicação | — | — | es_audit_logs | PostgreSQL | Migrado | migration:check | — | — |
| es_background_jobs | Tabela Drizzle (backgroundJobs) | Aplicação | — | — | es_background_jobs | PostgreSQL | Migrado | migration:check | — | — |
| es_publication_schedules | Tabela Drizzle (publicationSchedules) | Aplicação | — | — | es_publication_schedules | PostgreSQL | Migrado | migration:check | — | — |
| es_short_links | Tabela Drizzle (shortLinks) | Aplicação | — | — | es_short_links | PostgreSQL | Migrado | migration:check | — | — |
| es_social_posts | Tabela Drizzle (socialPosts) | Aplicação | — | — | es_social_posts | PostgreSQL | Migrado | migration:check | — | — |
| es_social_publications | Tabela Drizzle (socialPublications) | Aplicação | — | — | es_social_publications | PostgreSQL | Migrado | migration:check | — | — |
| es_subscriptions | Tabela Drizzle (subscriptions) | Aplicação | — | — | es_subscriptions | PostgreSQL | Migrado | migration:check | — | — |
| es_alerts | Tabela Drizzle (alerts) | Aplicação | — | — | es_alerts | PostgreSQL | Migrado | migration:check | — | — |
| es_notification_deliveries | Tabela Drizzle (notificationDeliveries) | Aplicação | — | — | es_notification_deliveries | PostgreSQL | Migrado | migration:check | — | — |
| es_consent_logs | Tabela Drizzle (consentLogs) | Aplicação | — | — | es_consent_logs | PostgreSQL | Migrado | migration:check | — | — |
| es_advertisers | Tabela Drizzle (advertisers) | Aplicação | — | — | es_advertisers | PostgreSQL | Migrado | migration:check | — | — |
| es_campaigns | Tabela Drizzle (campaigns) | Aplicação | — | — | es_campaigns | PostgreSQL | Migrado | migration:check | — | — |
| es_ad_slots | Tabela Drizzle (adSlots) | Aplicação | — | — | es_ad_slots | PostgreSQL | Migrado | migration:check | — | — |
| es_ad_creatives | Tabela Drizzle (adCreatives) | Aplicação | — | — | es_ad_creatives | PostgreSQL | Migrado | migration:check | — | — |
| es_ad_events | Tabela Drizzle (adEvents) | Aplicação | — | — | es_ad_events | PostgreSQL | Migrado | migration:check | — | — |
| es_indexing_events | Tabela Drizzle (indexingEvents) | Aplicação | — | — | es_indexing_events | PostgreSQL | Migrado | migration:check | — | — |
| es_system_settings | Tabela Drizzle (settings) | Aplicação | — | — | es_system_settings | PostgreSQL | Migrado | migration:check | — | — |
| es_contact_submissions | Tabela Drizzle (contactSubmissions) | Aplicação | — | — | es_contact_submissions | PostgreSQL | Migrado | migration:check | — | — |
| es_commercial_plans | Tabela Drizzle (commercialPlans) | Aplicação | — | — | es_commercial_plans | PostgreSQL | Migrado | migration:check | — | — |
| es_commercial_orders | Tabela Drizzle (commercialOrders) | Aplicação | — | — | es_commercial_orders | PostgreSQL | Migrado | migration:check | — | — |
| es_commercial_payments | Tabela Drizzle (commercialPayments) | Aplicação | — | — | es_commercial_payments | PostgreSQL | Migrado | migration:check | — | — |
| es_commercial_payment_events | Tabela Drizzle (commercialPaymentEvents) | Aplicação | — | — | es_commercial_payment_events | PostgreSQL | Migrado | migration:check | — | — |
| es_commercial_refunds | Tabela Drizzle (commercialRefunds) | Aplicação | — | — | es_commercial_refunds | PostgreSQL | Migrado | migration:check | — | — |
| es_company_credits | Tabela Drizzle (companyCredits) | Aplicação | — | — | es_company_credits | PostgreSQL | Migrado | migration:check | — | — |
| es_company_accounts | Tabela Drizzle (companyAccounts) | Aplicação | — | — | es_company_accounts | PostgreSQL | Migrado | migration:check | — | — |
| es_company_sessions | Tabela Drizzle (companySessions) | Aplicação | — | — | es_company_sessions | PostgreSQL | Migrado | migration:check | — | — |
| es_company_job_drafts | Tabela Drizzle (companyJobDrafts) | Aplicação | — | — | es_company_job_drafts | PostgreSQL | Migrado | migration:check | — | — |
| es_company_tickets | Tabela Drizzle (companyTickets) | Aplicação | — | — | es_company_tickets | PostgreSQL | Migrado | migration:check | — | — |
| es_seo_audit_issues | Tabela Drizzle (seoAuditIssues) | Aplicação | — | — | es_seo_audit_issues | PostgreSQL | Migrado | migration:check | — | — |

## Migrations (packages/db/migrations)

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0000_damp_cammi.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0001_fat_mysterio.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0002_job_public_code_sequence.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0003_nice_timeslip.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0004_loose_jubilee.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0005_wakeful_misty_knight.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0006_ambitious_doctor_faustus.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0007_slow_romulus.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0008_mean_hammerhead.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0009_modern_multiple_man.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0010_great_ogun.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0011_fresh_wild_pack.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0012_public_hex.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0013_elite_lorna_dane.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0014_typical_terror.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0015_abnormal_victor_mancha.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0016_phase10_ads.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0017_brand_commercial.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0018_commercial_company_seo.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0019_brand_identity_assets.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |
| 0020_commercial_plans_columns_fix.sql | Migration SQL Drizzle | Deploy | — | — | — | PostgreSQL | Aplicada | migrate-entrypoint.test.ts | — | — |

## Seeds e scripts DB

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| packages/db/scripts/seed-commercial-plans.ts | Seed script seed-commercial-plans | Bootstrap | — | — | várias | PostgreSQL | Disponível | — | — | — |
| packages/db/scripts/seed-locations.ts | Seed script seed-locations | Bootstrap | — | — | várias | PostgreSQL | Disponível | — | — | — |
| packages/db/scripts/seed-rbac-admin.test.ts | Seed script seed-rbac-admin.test | Bootstrap | — | — | várias | PostgreSQL | Disponível | seed-rbac-admin.test.ts | — | — |
| packages/db/scripts/seed-rbac-admin.ts | Seed script seed-rbac-admin | Bootstrap | — | — | várias | PostgreSQL | Disponível | seed-rbac-admin.test.ts | — | — |
| packages/db/scripts/seed-rbac.ts | Seed script seed-rbac | Bootstrap | — | — | várias | PostgreSQL | Disponível | seed-rbac-admin.test.ts | — | — |
| db:seed-rbac | npm run db:seed-rbac | Bootstrap | — | — | várias | PostgreSQL | Disponível | — | — | — |
| db:seed-commercial-plans | npm run db:seed-commercial-plans | Bootstrap | — | — | várias | PostgreSQL | Disponível | — | — | — |
| migrate:legacy | npm run migrate:legacy | Bootstrap | — | — | várias | PostgreSQL | Disponível | — | — | — |
| db:seed-locations | npm run db:seed-locations | Bootstrap | — | — | várias | PostgreSQL | Disponível | — | — | — |

## Variáveis de ambiente (.env.example)

| rota | função | público-alvo | permissão | API | tabela | integração | status atual | teste realizado | resultado | correção necessária |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DATABASE_URL | Variável de ambiente | Deploy/dev | — | — | — | PostgreSQL | Documentada | — | — | — |
| DATABASE_URL_DIRECT | Variável de ambiente | Deploy/dev | — | — | — | PostgreSQL | Documentada | — | — | — |
| SITE_URL | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| COMMERCIAL_CONTACT_URL | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| NEXT_PUBLIC_SITE_URL | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| NEXT_PUBLIC_SITE_NAME | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| AUTH_SECRET | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| ADMIN_LOGIN_USER | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| ADMIN_SECRET_KEY | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| NEXT_PUBLIC_ADSENSE_CLIENT_ID | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| PUBLIC_ADSENSE_ENABLED | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| PUBLIC_ADSENSE_CLIENT_ID | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| PUBLIC_ADSENSE_PUBLISHER_ID | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| APP_TIME_ZONE | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| CRON_SECRET | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| REDIS_URL | Variável de ambiente | Deploy/dev | — | — | — | Redis | Documentada | — | — | — |
| WORKER_IMPORT_CONCURRENCY | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| WORKER_NOTIFICATION_CONCURRENCY | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| WORKER_SOCIAL_CONCURRENCY | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| WEB_PORT | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| LOG_LEVEL | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| APP_ENV | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| SENTRY_TRACES_SAMPLE_RATE | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| S3_ENDPOINT | Variável de ambiente | Deploy/dev | — | — | — | S3/R2 | Documentada | — | — | — |
| S3_REGION | Variável de ambiente | Deploy/dev | — | — | — | S3/R2 | Documentada | — | — | — |
| S3_BUCKET | Variável de ambiente | Deploy/dev | — | — | — | S3/R2 | Documentada | — | — | — |
| S3_ACCESS_KEY_ID | Variável de ambiente | Deploy/dev | — | — | — | S3/R2 | Documentada | — | — | — |
| S3_SECRET_ACCESS_KEY | Variável de ambiente | Deploy/dev | — | — | — | S3/R2 | Documentada | — | — | — |
| S3_PUBLIC_URL | Variável de ambiente | Deploy/dev | — | — | — | S3/R2 | Documentada | — | — | — |
| S3_FORCE_PATH_STYLE | Variável de ambiente | Deploy/dev | — | — | — | S3/R2 | Documentada | — | — | — |
| S3_SERVER_SIDE_ENCRYPTION | Variável de ambiente | Deploy/dev | — | — | — | S3/R2/MinIO | Documentada | — | `AES256`, `aws:kms` ou `none` |
| RESEND_API_KEY | Variável de ambiente | Deploy/dev | — | — | — | Resend | Documentada | — | — | — |
| EMAIL_FROM | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| PUBLIC_WHATSAPP_CHANNEL_URL | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| SENTRY_DSN | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| TURNSTILE_SITE_KEY | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| TURNSTILE_SECRET_KEY | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| GOOGLE_INDEXING_ENABLED | Variável de ambiente | Deploy/dev | — | — | — | Google | Documentada | — | — | — |
| GOOGLE_INDEXING_PROJECT_ID | Variável de ambiente | Deploy/dev | — | — | — | Google | Documentada | — | — | — |
| GOOGLE_INDEXING_CLIENT_EMAIL | Variável de ambiente | Deploy/dev | — | — | — | Google | Documentada | — | — | — |
| GOOGLE_INDEXING_PRIVATE_KEY | Variável de ambiente | Deploy/dev | — | — | — | Google | Documentada | — | — | — |
| GOOGLE_PLACES_API_KEY | Variável de ambiente | Deploy/dev | — | — | — | Google | Documentada | — | — | — |
| INDEXNOW_KEY | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| META_APP_ID | Variável de ambiente | Deploy/dev | — | — | — | Meta | Documentada | — | — | — |
| META_APP_SECRET | Variável de ambiente | Deploy/dev | — | — | — | Meta | Documentada | — | — | — |
| META_PAGE_ACCESS_TOKEN | Variável de ambiente | Deploy/dev | — | — | — | Meta | Documentada | — | — | — |
| META_INSTAGRAM_ACCOUNT_ID | Variável de ambiente | Deploy/dev | — | — | — | Meta | Documentada | — | — | — |
| ADMIN_INITIAL_EMAIL | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| ADMIN_INITIAL_NAME | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |
| ADMIN_INITIAL_PASSWORD | Variável de ambiente | Deploy/dev | — | — | — | — | Documentada | — | — | — |

## Snapshot final de estabilização — 14/07/2026

Este snapshot substitui contagens anteriores: 97 páginas Astro, 43 páginas administrativas, 75 APIs administrativas e 92 formulários. O runtime Drizzle contém 59 tabelas, 695 colunas, 121 índices, 158 constraints e 10 enums após as migrations `0022` e `0023`.

As superfícies novas/alteradas são: retry de importação falha, descrição única de vagas, contratante não identificada, padrão editorial de imagens, configurações SEO completas, grafo JSON-LD central e os scripts `audit:seo`, `audit:schemas`, `audit:performance` e `audit:admin`.
