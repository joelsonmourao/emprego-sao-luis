# Recuperação da implementação administrativa

**Branch de trabalho:** `codex/admin-negocio-completo` (local, sem push)
**Data:** 19/07/2026
**Diretório:** `C:\Users\Joelson\Documents\ES`

## Proteção

- Sem push, deploy, Coolify, merge na `main` ou force push.
- Pasta `Logo/` **não alterada** neste fluxo (WIP pré-existente preservado).
- Sem trabalho em `ES-rollback/` (diretório untracked ignorado).

## Estado Git inicial

| Item | Valor |
|------|-------|
| Branch de partida | `codex/reconstrucao-astro` |
| HEAD local | `3414adb` (`docs: update continuation audit after staging preparation`) |
| `origin/codex/reconstrucao-astro` | `2cc60b4` (`revert: restaurar site ao estado estável anterior`) |
| Relação | Local **1 commit atrás** do remoto (o remoto contém o revert; o local **não** o possui) |
| Tag local | `pre-staging-empregos-sao-luis-2026-07` → `8fe30ad` |

### Commit de restauração

- **Hash:** `2cc60b4`
- **Mensagem:** `revert: restaurar site ao estado estável anterior`
- **Pai:** `3414adb`
- **Efeito:** remove ~113 arquivos / funcionalidades novas (ApplicationChannels, adsense-readiness, web-stories, migrations docs, testes, etc.) e devolve o tree ao equivalente do estado antigo estável.
- **Onde aparece:** `emergency/restaurar-site`, `origin/codex/reconstrucao-astro`

### Logo/

WIP local pré-existente (não commitado, não tocado nesta recuperação):

- `Logo/icon.webp` / `logo-horizontal.webp` deletados no working tree
- `Logo/logo-horizontal.png` modificado (~1 MB)
- `Logo/icon.png`, `Logo/logo-horizontal1.png` untracked

Runtime continua em `apps/web/public/brand/*`.

## Como o código novo foi recuperado

**Não foi necessário `git revert` do `2cc60b4`.**

Motivo: o working tree local já estava em `3414adb`, com os arquivos novos presentes. O revert existe apenas no remoto / branch de emergência.

Ação segura tomada:

1. Criar branch local `codex/admin-negocio-completo` a partir de `3414adb`.
2. **Não** fazer `git pull` / merge de `origin/codex/reconstrucao-astro` (evitaria reaplicar o revert).
3. Completar menu, rotas e lacunas de produto nesta branch.

## Diferença 3a512f4 ↔ 3414adb (resumo)

Inclui, entre outros: migrations `0024`/`0025`, canais de candidatura, governança de publicação, importação assistida, classificação, pilares/clusters, Post Magnético, Web Stories, Rota da Aprovação, noindex de staging, docs e testes E2E de continuação.

## Princípio de negócio (gratuidade do candidato)

Registrado como regra permanente desta branch: candidato sempre gratuito; receita apenas B2B / AdSense (desativado) / publicidade identificada.
