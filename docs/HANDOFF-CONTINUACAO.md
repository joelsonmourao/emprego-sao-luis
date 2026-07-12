# Handoff da reconstrução Astro

Última atualização: 12 de julho de 2026.

## Estado

- Branch: `codex/reconstrucao-astro`.
- Não alterar `main` nem produção.
- Next.js/Prisma legado permanece na raiz como rollback.
- Nova plataforma: `apps/web`, `apps/worker` e `packages/*`.
- Commits por fase existem desde `60dfae6`; consulte `git log --oneline`.

## Já implementado

Astro 7 SSR, Tailwind, React islands, Drizzle, PostgreSQL, BullMQ/Valkey, R2/S3, Resend, Sentry, RBAC, sessões revogáveis, 2FA TOTP, portal, cadastro manual, importação assíncrona, SEO estruturado, página Instagram, alertas, AdSense controlado, Dockerfiles, CI, Playwright, Lighthouse e documentação operacional.

## Validações aprovadas

`npm run lint`, `npm run typecheck`, `npm run test`, `npm run migration:check`, `npm run build`, `npm run test:e2e`, `npm run lighthouse` e `npm run legacy:build`. Docker não foi executado porque o daemon local não estava disponível.

## Trabalho em andamento

Fase 5 recebeu dry run, reexecução do lote, CSV de rejeições e undo por snapshot no commit `3ea7fe6`. O trabalho atual adiciona expiração agendada, Google Indexing e IndexNow ao worker; validar e commitar antes de seguir.

## Pendências principais

1. Testes integrados de importação com PostgreSQL/Valkey/MinIO, incluindo 10 e 1.000 linhas.
2. Mapeamento manual de cabeçalhos e arquivo oficial de modelo.
3. CRUDs completos dos módulos administrativos, versionamento e preview.
4. Google Indexing API, IndexNow e expiração agendada no novo worker.
5. Estúdio social conectado ao render PNG, aprovação, fila Meta, métricas e retry.
6. Contas de candidatos, vagas salvas, Web Push, exportação e exclusão LGPD.
7. Gestão comercial completa e relatórios de anúncios.
8. Executar Docker/staging, migração real, comparação de dados/URLs, backup e rollback testados.

## Regras

Não declarar conclusão sem evidência requisito por requisito. Não usar credenciais no Git. Não executar migration em produção. Usar somente API oficial da Meta. Manter migrations aditivas e rollback.
