# Handoff da reconstrução Astro

Última atualização: 12 de julho de 2026.

## Estado protegido

- Branch: `codex/reconstrucao-astro`.
- `main` e produção não foram alteradas.
- Next.js/Prisma legado permanece na raiz como rollback.
- Nova plataforma: `apps/web`, `apps/worker` e `packages/*`.
- Commits separados registram a evolução desde a Fase 0.

## Implementado

Astro 7 SSR, TypeScript strict, Tailwind, React 19 somente em islands, Drizzle/PostgreSQL, BullMQ/Valkey, R2/S3, Resend, Sentry, RBAC, sessões revogáveis, 2FA TOTP, portal público, painel protegido, cadastro manual, importação assíncrona com dry run e undo, SEO estruturado, Google Indexing, IndexNow, expiração, estúdio social PNG/R2/Meta, alertas, conta do candidato com magic link/vagas salvas/exportação/exclusão LGPD, AdSense controlado, Dockerfiles, CI, Playwright, Lighthouse e documentação operacional.

O dashboard administrativo usa métricas reais do PostgreSQL. Há uma imagem exclusiva `Dockerfile.migrate`, e o worker carrega corretamente os pacotes TypeScript internos em runtime.

## Validações aprovadas

`npm run lint`, `npm run typecheck`, `npm run test` (18 testes), `npm run migration:check`, `npm run build`, `npm run test:e2e` (8 cenários), `npm run lighthouse` e `npm run legacy:build` foram aprovados durante a reconstrução. O carregamento do worker com `node --import tsx` foi verificado. Docker não pôde ser construído porque o Docker Desktop local está desligado.

## Dependências externas ainda necessárias

Staging real e integrações exigem URLs/credenciais de PostgreSQL, Valkey, R2/S3, Resend, Cloudflare, Google, Meta, Sentry e AdSense conforme a funcionalidade ativada. Nenhuma credencial foi inventada ou gravada no Git.

## Pendências que só podem ser validadas externamente

1. Ligar Docker Desktop e construir `Dockerfile.web`, `Dockerfile.worker` e `Dockerfile.migrate`.
2. Subir staging no Coolify e executar migrations no PostgreSQL de staging.
3. Comparar contagens, URLs, slugs e datas após uma cópia controlada dos dados legados.
4. Testar restauração de backup e rollback no ambiente de staging.
5. Validar envios reais de Resend, R2, Google Indexing, IndexNow e Meta com credenciais oficiais.
6. Completar configurações e decisões comerciais para campanhas/anunciantes reais.

## Regra de continuidade

Não executar migration ou troca de domínio em produção antes de backup restaurável, staging aprovado e autorização explícita. O procedimento completo está em `docs/GUIA-WINDOWS-COOLIFY.md`.
