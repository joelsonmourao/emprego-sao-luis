# Progresso da implementação

## Visão geral

Branch `codex/reconstrucao-astro`. Arquitetura Astro 7, Drizzle, PostgreSQL, Valkey/BullMQ e Docker preservada. A `main` não é alterada automaticamente.

## Fases concluídas (1–15)

- Fase 1 — segurança e autenticação administrativa.
- Fase 2 — gestão ampliada de vagas.
- Fase 3 — importação XLSX/CSV com mapeamento e processamento BullMQ.
- Fase 4 — programação em blocos e publicação automática.
- Fase 5 — empresas, categorias, cidades, bairros e redirecionamentos seguros.
- Fase 6 — CMS editorial, autoria, revisões, agendamento e notícias públicas.
- Fase 7 — biblioteca de mídia R2/S3 e configuração visual auditável.
- Fase 8 — SEO técnico, indexação, social studio e página `/instagram`.
- Fase 9 — alertas multicanal (inscrição ampliada, painel administrativo, dispatch BullMQ, fallback de e-mail).
- Fase 10 — publicidade e monetização (`@es/ads`, migration `0016`, painel `/admin/publicidade`).
- Fase 11 — filas e monitoramento operacional (`/admin/operacao`, saúde de integrações).
- Fase 12 — usuários e administradores (RBAC, LGPD, auditoria administrativa).
- Fase 13 — portal público final (identidade visual, header/footer, home completa).
- Fase 14 — páginas institucionais administráveis (`/admin/paginas`, formulário de contato).
- Fase 15 — auditoria final, CI e preparação para deploy.

## Commits desta sessão

- `22e98fd` — Fase 10: publicidade e monetização.
- `1b95803` — Fase 11: painel operacional de filas.
- `0e8033c` — Fase 12: usuários, administradores e auditoria.
- `1e31ea5` — Fase 13: identidade visual e home do portal.
- `8edb806` — Fase 14: páginas institucionais e contato.

## Migrations

- `0012`–`0015` e `0016_phase10_ads.sql` aguardam aplicação pelo job de migration no Coolify.
- Fases 8, 13 e 14 usam `es_system_settings` (`seo_settings`, `visual_identity`, `institutional_pages`, `ad_settings`).
- Migrations são aditivas, versionadas e nunca executadas automaticamente no start do web.

## Validações (Fase 15)

- `npm run lint` — aprovado.
- `npm run typecheck` — aprovado.
- `npm run test` — aprovado: 43 testes unitários.
- `npm run migration:check` — aprovado.
- `npm run build` — aprovado (web + worker).
- `npm run test:e2e` — aprovado: 9 testes Playwright.

## Fase 10 — entregas

- Pacote `@es/ads`, migration `0016`, painel `/admin/publicidade`.
- Slots, campanhas, impressões/cliques, AdSense configurável e regra de exclusão na candidatura.
- Testes `candidature.test.ts` e `ads-candidature.test.ts`.

## Fase 11 — entregas

- Painel `/admin/operacao` com filas BullMQ, indexação e saúde de integrações.
- Libs `operations.ts` e `operational-health.ts` com sanitização de payload.

## Fase 12 — entregas

- Painéis `/admin/usuarios`, `/admin/administradores`, `/admin/permissoes`, `/admin/auditoria`.
- Proteção contra escalada de privilégio, anonimização LGPD e exportação CSV.

## Fase 13 — entregas

- `SiteHeader`, `SiteFooter`, identidade via `visual_identity`.
- Home com busca, filtros rápidos, vagas recentes/destaque, empresas, categorias, cidades, notícias, alertas e publicidade segura.

## Fase 14 — entregas

- CMS institucional em `institutional_pages` (14 páginas).
- Painel `/admin/paginas`, componente `InstitutionalPage`, API `/api/contato` com rate limit e consentimento.

## Bloqueios externos (não impedem dev local)

- Migrations `0012`–`0016` pendentes no Coolify.
- Credenciais: Google Indexing, IndexNow, Meta, Resend, R2/S3, Sentry, AdSense, Web Push (VAPID).
- Domínio oficial pode estar no deployment legado.
- Turnstile no contato: fallback seguro sem chave configurada.

## Variáveis externas pendentes

| Integração | Variáveis |
|------------|-----------|
| E-mail | `RESEND_API_KEY`, `EMAIL_FROM` |
| Indexação Google | `GOOGLE_INDEXING_CLIENT_EMAIL`, `GOOGLE_INDEXING_PRIVATE_KEY`, `GOOGLE_INDEXING_ENABLED` |
| IndexNow | `INDEXNOW_KEY`, `SITE_URL` |
| Meta/Instagram | `META_INSTAGRAM_ACCOUNT_ID`, `META_PAGE_ACCESS_TOKEN` |
| Storage | `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL` |
| Sentry | `SENTRY_DSN` |
| AdSense | `PUBLIC_ADSENSE_CLIENT_ID`, `PUBLIC_ADSENSE_ENABLED` |
| Turnstile (opcional) | `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| Web Push (opcional) | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` |

## Deploy no Coolify

1. Backup do PostgreSQL.
2. Executar job `Dockerfile.migrate` (migrations `0012`–`0016`).
3. Configurar variáveis obrigatórias: `APP_ENV`, `SITE_URL`, `DATABASE_URL`, `REDIS_URL`, `AUTH_SECRET`.
4. Deploy web (`Dockerfile.web`) — validar `/api/health`, `/api/ready`, header `X-ES-App: astro`.
5. Deploy worker (`Dockerfile.worker`) — validar `worker.started`.
6. Criar primeiro admin: `npm run db:seed-rbac --workspace=@es/db` com `ADMIN_INITIAL_EMAIL` e `ADMIN_INITIAL_PASSWORD` (remover após uso).
7. Smoke tests: `/`, `/vagas`, `/admin/login`, `/sitemap.xml`, `/admin/operacao`, `/admin/publicidade`.
8. Ativar integrações externas conforme credenciais disponíveis.

## Riscos conhecidos

- Integrações sem credencial real permanecem em estado `not_configured` no painel operacional.
- Domínio legado pode servir tráfego até troca de DNS/proxy.
- AdSense e Web Push exigem domínio e chaves reais para funcionamento completo.

## Rollback

1. Parar worker novo.
2. Restaurar imagens anteriores de web/worker.
3. Migrations são aditivas — não reverter schema automaticamente; restaurar backup se necessário.
