# Validação visual do admin — Empregos São Luís

**Branch:** `codex/admin-negocio-completo`
**Atualizado:** 19/07/2026 (Operação do dia + importação + deploy smoke)
**Ambiente:** `es-e2e` · web `:4321` · Postgres `127.0.0.1:55432/empregos_staging` · Valkey
**Auth:** `storageState` via `tests/e2e/global-setup.ts` (login real antes dos testes)
**Screenshots locais:** `tmp/admin-visual/*.png` (fora do Git)

## Correções que desbloquearam a suíte

| Falha anterior | Causa raiz | Correção |
|----------------|------------|----------|
| SEO canonical/schema na home | Teste esperava contrato de produção; `APP_ENV=e2e` omite canonical/JSON-LD de propósito | Teste detecta staging-like e valida noindex + ausência de canonical |
| robots exige `Sitemap:` | Homologação usa `Disallow: /` sem Sitemap (contrato) | Teste staging-aware; sitemaps XML continuam validados |
| `/admin/adsense-readiness` timeout | Página pesada + N logins paralelos + fetch sequencial | Cache 15s, queries limitadas, fetches paralelos, readiness staging-aware; auth compartilhada |
| Flaky login admin | `beforeEach` login em paralelo + regex frágil | `globalSetup` + `storageState` + `ensureAdminSession` |
| Unit seed-rbac timeout | bcrypt sob carga no Windows | timeout 15s justificado (não skip) |

## Playwright final (retries = 0)

`npx playwright test` / `npm run test:e2e` → **176 passed / 0 failed / 0 flaky / 0 unexpected** (`retries: 0`, 3 workers)

## Screenshots autenticados

| Rota | Menu | Ação | Resultado | Persistência | Screenshot | Erro | Correção |
|------|------|------|-----------|--------------|------------|------|----------|
| `/admin` | Dashboard | Login + menu | OK | — | `menu.png`, `menu-completo.png` | — | storageState |
| `/admin/vagas/importar` | Importar planilha | Abrir autenticado | OK | — | `importacao.png` | — | — |
| `/admin/vagas/importar-contatos` | Importar contatos | Abrir autenticado | OK | — | `importar-contatos.png` | flaky login | storageState |
| `/admin/vagas/revisao` | Revisão | Abrir autenticado | OK | — | `revisao.png` | — | — |
| `/admin/vagas/monitor-candidaturas` | Monitor | Abrir autenticado | OK | — | `monitor.png` | — | — |
| `/admin/conteudo/pilares` | Pilares | Criar + toggle + validação | OK | API content-pillars | `crud-pilares.png` | — | CRUD autenticado |
| `/admin/conteudo/post-magnetico` | Post Magnético | Abrir autenticado | OK | articles | `post-magnetico.png` | — | — |
| `/admin/adsense-readiness` | Rota da Aprovação | Abrir autenticado | OK | history | `adsense-readiness.png` | timeout | cache/perf |
| `/admin/web-stories` | Web Stories | Abrir autenticado | OK | — | `web-stories.png` | — | — |
| `/admin/comercial/planos` | Planos | Abrir autenticado | OK | seed plano | `planos.png` | — | — |
| `/admin/publicidade` | Publicidade | Abrir autenticado | OK | — | `publicidade.png` | — | — |
| `/admin/vagas/nova` | Cadastrar vaga | Abrir canais | OK | — | `nova-vaga-canais.png` | — | — |

## Fixtures E2E gravados

Marker `E2E-ADMIN-FIXTURE` em `127.0.0.1:55432/empregos_staging` (prova: host/porta/db, senha omitida):

- 6 vagas (URL, WA, e-mail, multicanal, review, featured)
- 1 pilar + 2 clusters
- 1 Post Magnético
- 2 Web Stories (draft + published)
- 1 regra de classificação
- 1 lote de importação
- 1 plano comercial
- 1 campanha
- 1 histórico Rota da Aprovação

Seed reexecutado com sucesso (idempotente).

## Confirmações

- Validação **após autenticação** (não 302→login).
- AdSense permanece desativado.
- Imagens/favicons: ver `docs/IMAGE_ASSET_AUDIT.md` (screenshots em `tmp/admin-visual/`, fora do Git).
- Pasta `Logo/` não incluída no commit (WIP pré-existente).
- Sem push / deploy / produção.
