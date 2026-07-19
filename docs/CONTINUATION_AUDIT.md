# Auditoria de continuidade — Blog Fantasma, AdSense e B2B

**Branch:** `codex/reconstrucao-astro`  
**Data:** 19/07/2026  
**Regra:** nenhum push nem deploy em produção nesta continuidade.

## Estado inicial (antes da validação final)

- Branch `codex/reconstrucao-astro` com grande WIP não commitado.
- Migration `0024` preexistente; `0025` criada na continuidade.
- Unit/lint/typecheck/build já aprovados; `db:audit-schema` e E2E pendentes.
- Possível conteúdo institucional antigo com placeholders no banco de produção (não tocado).

## Validação em banco isolado (`es-e2e`)

Ambiente: `compose.staging.yml` + `compose.e2e.yml`, PostgreSQL `empregos_staging` na porta host `55432`, Valkey descartável, web `:4321`, worker, volume `/app/data` compartilhado (uid `1001` / `app`).

| Gate | Resultado |
|------|-----------|
| Migrations limpas (incl. 0024/0025) | Aprovado |
| Seeds ×2 (idempotência) | Aprovado |
| `npm run db:audit-schema` | `ok: true`, 0 issues — 65 tabelas, 816 colunas, 133 índices, 177 constraints, 10 enums |
| `/api/health` + `/api/ready` | ready (database/schema/redis/storage) |
| Storage `/app/data` compartilhado web↔worker | Aprovado (persistência após restart) |
| `npm test` | 243/243 |
| `npm run typecheck` | Aprovado |
| `npm run lint` | Aprovado |
| `npm run migration:check` | Aprovado |
| `npm run build` | Aprovado (web + worker) |
| `npx playwright test` | **121/121** |
| `node scripts/audit-placeholders.mjs` (E2E DB) | 0 findings |
| `node scripts/audit-critical-routes.mjs` | ok, sem blockers |
| `npm run audit:seo` | ok |

## Migrations 0024 / 0025

1. `0025` sucede `0024` no journal.
2. Sem DROP destrutivo; campos novos opcionais/com defaults seguros.
3. CHECK bloqueia `PUBLISHED` + `NEEDS_REVIEW`.
4. Rollback operacional: restaurar backup do PostgreSQL + imagens anteriores; sem migration automática de down.

## Correções feitas na validação

- Hub `/empresas` lista apenas empresas com vagas publicadas ativas; `noindex` quando vazio.
- E2E alinhado à governança: `reviewConfirmed`, fonte sem padrão “teste”, correspondência título/descrição, mapeamento `applicationUrl`/`sourceName`, cidade seed `São Luís`, publicação editorial com etapa `APPROVED`/fontes/pilar/cluster.
- Login E2E não casa mais com `/admin/login` via regex ambígua.
- Playwright: `retries: 1` local / `2` em CI para hang-ups sob carga.

## AdSense

- Padrão: `PUBLIC_ADSENSE_ENABLED=false`.
- HTML público sem `adsbygoogle.js` / `ca-pub-`.
- Rota da Aprovação exibe disclaimer de não garantia.

## Placeholders em produção (procedimento seguro)

1. Backup do PostgreSQL.
2. `DATABASE_URL=... node scripts/audit-placeholders.mjs` (somente leitura).
3. Exportar registros listados.
4. Revisão humana.
5. Correção pelo painel ou script explícito com `--write` (quando existir) + audit log.
6. Nova auditoria.

Não alterar silenciosamente produção.

## Coolify (resumo)

Ver `docs/COOLIFY_DEPLOY.md`: serviços web, worker, migrate, PostgreSQL, Valkey; volume `/app/data` em web+worker; ordem migrate → web → worker; health `/api/health`, ready `/api/ready`.

## Pendências externas reais

- Publisher ID AdSense real
- Credenciais de gateway de pagamento
- Deploy Coolify / validação em produção
- Certificação Search Console / Rich Results / CWV de campo
- Possíveis placeholders em conteúdo institucional **já gravado** no banco de produção

## Confirmação

**Não houve push nem deploy em produção nesta continuidade.**
