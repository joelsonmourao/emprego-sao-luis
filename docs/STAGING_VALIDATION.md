# Homologação em staging — Empregos São Luís

**Branch:** `codex/admin-negocio-completo`
**Tag local de segurança:** `pre-staging-empregos-sao-luis-2026-07`
**Data:** 19/07/2026

## Estado validado antes do push

| Gate | Resultado |
|------|-----------|
| Unitários | 246/246 (inclui `runtime-env`) |
| Playwright (local E2E isolado) | 121/121 na sessão anterior; + spec `staging-noindex` |
| lint / typecheck / migration:check / build | Aprovado |
| `db:audit-schema` (Postgres E2E) | 65 tabelas, 816 colunas, 133 índices, 177 constraints, 10 enums |
| Migrations | `0024` + `0025` |
| AdSense | `PUBLIC_ADSENSE_ENABLED=false` |
| Push produção / merge main | **Não realizados** |

## Pasta Logo/ (WIP preservado)

Não commitada neste fluxo.

| Caminho | Situação |
|---------|----------|
| `Logo/icon.png`, `Logo/logo-horizontal.png`, `Logo/logo-horizontal1.png` | ~1 MB cada; não usados em runtime |
| `Logo/*.webp` deletados no working tree | Apenas na pasta `Logo/` |
| `apps/web/public/brand/*` | **Intactos** (`icon.webp` 3 KB, `logo-horizontal.webp` 6 KB, `logo-horizontal.png` 32 KB) |

O site e o painel referenciam `/brand/*` via `FALLBACK_PATHS` / `BRAND_ASSETS`. Sem evidência de que os PNGs de 1 MB em `Logo/` sejam oficiais, o WIP permanece local e **fora do push**.

## Noindex global de staging

Quando `APP_ENV` ∈ `staging|homolog|homologacao|preview|e2e` ou `FORCE_NOINDEX=true` / `STAGING_NOINDEX=true`:

- middleware: `X-Robots-Tag: noindex, nofollow` em todas as respostas;
- `BaseLayout`: meta robots `noindex, nofollow`; sem canonical; sem JSON-LD de grafo; sem AdSense; sem meta de verificação Search Console;
- `robots.txt`: `Disallow: /` sem Sitemap;
- Indexing API / IndexNow / Meta social: desabilitados no worker e no status de integração;
- host `www` **não** redireciona para o domínio canônico de produção.

## Coolify — staging (manual)

**Acesso Coolify não disponível neste ambiente** (sem MCP/CLI autenticado). Deploy real **não foi executado daqui**. Configurar manualmente:

### Serviços (recursos separados da produção)

1. **PostgreSQL** staging — volume próprio, sem porta pública.
2. **Valkey** staging — rede interna.
3. **Volume** `UPLOADS_DIR=/app/data` — montar em **web** e **worker**, UID 1001.
4. **migrate** (`Dockerfile.migrate`) — 1 réplica, sem restart, branch `codex/admin-negocio-completo`.
5. **web** (`Dockerfile.web`) — porta 4321, health `/api/health`, domínio de staging.
6. **worker** (`Dockerfile.worker`) — sem domínio público.

### Ordem

PostgreSQL → Valkey → volume → **migrate (exit 0)** → web → worker.

### Variáveis (sem segredos)

| Variável | Staging |
|----------|---------|
| `APP_ENV` | `staging` |
| `FORCE_NOINDEX` | `true` (cinto de segurança) |
| `SITE_URL` | `https://<subdomínio-staging>` |
| `DATABASE_URL` | Postgres **staging** |
| `REDIS_URL` | Valkey **staging** |
| `AUTH_SECRET` | exclusivo staging (≥32 chars) |
| `COOKIE_SECURE` | `true` (HTTPS) |
| `UPLOADS_DIR` | `/app/data` |
| `PUBLIC_ADSENSE_ENABLED` | `false` |
| `PUBLIC_ADSENSE_*` | vazios |
| `GOOGLE_INDEXING_ENABLED` | `false` |
| `INDEXNOW_KEY` | vazio |
| `META_*` / pagamentos / Resend produtivo | desligados ou sandbox |

Seeds no migrate (quando intencional): `RUN_SEED_LOCATIONS`, `RUN_SEED_CATEGORIES`, `RUN_SEED_SYSTEM_DEFAULTS`. RBAC: `db:seed-rbac` uma vez, depois remover senha.

Fixtures: `npm run seed:staging-fixtures` (dry-run) / `--write` só no banco staging.

### Rollback de staging

1. Parar worker.
2. Republicar imagem web/worker do commit anterior.
3. Restaurar backup do Postgres staging se migration for o problema.
4. Migrations aditivas: não “desfazer” schema automaticamente.
5. Desligar domínio de staging se necessário.

## Playwright contra staging (após deploy)

```bash
set E2E_BASE_URL=https://<dominio-staging>
set E2E_ALLOW_MUTATIONS=true
set E2E_ADMIN_EMAIL=...
set E2E_ADMIN_PASSWORD=...
set E2E_DATABASE_URL=<postgres-staging>
npm run test:e2e
```

## Placeholders em produção

Somente leitura, com backup e acesso autorizado:

```bash
set DATABASE_URL=<prod-read-replica-or-authorized>
npm run audit:placeholders
```

Não gravar relatório com PII no Git. Correção só após revisão humana.

## Pendências externas desta etapa

- Deploy Coolify staging (acesso operador).
- Domínio HTTPS de staging.
- Playwright apontando ao domínio real.
- Auditoria visual no domínio real.
- Auditoria de placeholders em produção (acesso autorizado).
- Decisão sobre ativos em `Logo/`.
- Merge na main e produção: **bloqueados** até aceite de staging.
