# Auditoria e correção de ativos de imagem

Data: 2026-07-19
Escopo: apenas imagens, referências, dimensões e comportamento responsivo.
Fora de escopo: paleta de cores, redesign, alteração de `Logo/`, nova marca.

## Confirmações explícitas

- Nenhuma cor de fundo, texto, botão, link, borda ou paleta foi alterada.
- O rodapé não foi redesenhado (apenas tamanho/proporção do logo via classes de dimensão).
- A identidade visual foi preservada.
- A pasta `Logo/` **não foi alterada** (somente leitura pelo gerador).
- Não foi criada marca nova com IA.
- Somente imagens públicas, referências, dimensões e CSS de encaixe (`width`/`height`/`max-width`/`object-fit`/responsivo) foram corrigidos.

## Origem oficial (somente leitura)

| Ativo fonte | Caminho | Uso |
|---|---|---|
| Ícone quadrado oficial | `Logo/icon.png` (~1254×1254) | Favicons, ícone Instagram, `brand/icon.*` |
| Logo horizontal oficial | `Logo/logo-horizontal.png` (~2172×724) | Header, footer, OG fallback |

Gerador: `node scripts/generate-brand-public-assets.mjs`
Destino: `apps/web/public/brand/` e favicons em `apps/web/public/`.

## Problemas encontrados e correções

### Bloco Instagram (home)

| Campo | Antes | Depois |
|---|---|---|
| Arquivo | `/brand/icon.webp` (~96×96, ~3 KB) | `/brand/icon-instagram.webp` (320×320, fundo branco opaco) |
| CSS | `h-24 w-24` (96px) | `h-36…lg:h-48` + `width/height=192` + `rounded-2xl` (apenas encaixe) |
| Problema | pequena, baixa presença, pouco nítida; letras escuras ilegíveis se transparente no painel escuro | resolução alta + fundo branco do ativo para contraste no painel escuro |
| Componentes | `InstagramFollow.astro`, `FALLBACK_PATHS.INSTAGRAM_IMAGE` | mesmos; sem mudança de cores da seção |

### Favicon

| Campo | Antes | Depois |
|---|---|---|
| Problema | legibilidade fraca / possível ativo inadequado | derivados quadrados do `Logo/icon.png` |
| Tamanhos | inconsistentes | 16, 32, 48, 180, 192, 512 + `favicon.ico` |
| Layout | preferência fraca | PNG 16/32/48 + ico em `BaseLayout.astro` |
| Manifest | — | `site.webmanifest` aponta para ícones existentes |

### Rodapé / cabeçalho

| Campo | Antes | Depois |
|---|---|---|
| Logo | possível baixa presença | `h-11`→`sm:h-12`, `max-w` 13–15rem, `width/height` reservados |
| Ativo | `BrandLogo` via `LOGO_DARK` / `LOGO_MAIN` | fallback `/brand/logo-horizontal.webp` (800×267) |
| Cores | fundo escuro do footer intacto | sem alteração de `background-color` / `color` |

## Comparação visual (local, não versionada)

Arquivos em `tmp/admin-visual/` (gitignored):

| Arquivo | Conteúdo |
|---|---|
| `instagram-icon-BEFORE-96.png` | Simulação do ativo antigo (~96px) |
| `instagram-icon-AFTER-320.png` | Ativo atual 320×320 opaco |
| `instagram-BEFORE-AFTER-compare.png` | Lado a lado em fundo escuro (como o painel) |
| `instagram-after-1366.png` / `instagram-after-375.png` | Bloco na home |
| `header-after-1366.png` / `footer-after-1366.png` | Header e rodapé |

**Antes:** ícone ~96×96 (~3 KB) em `h-24 w-24` → pixelado ao ampliar.
**Depois:** `/brand/icon-instagram.webp` 320×320 (~18 KB), exibição 144–192px, fundo branco opaco para contraste no painel escuro.

## Tabela resumo

| ÁREA | IMAGEM | PROBLEMA | CORREÇÃO | DESKTOP | MOBILE | ESTADO |
|---|---|---|---|---|---|---|
| Home Instagram | icon.webp 96px | pequena / pouco nítida | icon-instagram.webp 320px + CSS maior | OK | OK | corrigido |
| Favicon aba | favicon antigo/baixo detalhe | ilegível em 16–32 | PNGs 16/32/48 + ico do ícone oficial | OK | OK | corrigido |
| Header | logo horizontal | presença variável | logo 800w + dimensões CSS | OK | OK | corrigido |
| Footer | logo em fundo escuro | possível pequeno/borrado | mesmas dimensões + asset 800w | OK | OK | corrigido |
| Manifest/PWA | icon-192/512 | garantir existência | regenerados do ícone oficial | OK | n/a | corrigido |
| OG default | logo-horizontal.png | fallback social | 800px PNG oficial público | OK | n/a | ok |
| Web Stories | mídia editorial | depende de conteúdo | fixtures E2E; painel autenticado OK | OK | OK | ok |

## Arquivos modificados (código / públicos)

- `scripts/generate-brand-public-assets.mjs` (novo)
- `apps/web/public/brand/*` (derivados)
- `apps/web/public/favicon-*.png`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`
- `apps/web/src/components/InstagramFollow.astro`
- `apps/web/src/components/SiteHeader.astro` / `SiteFooter.astro` (somente classes de dimensão)
- `apps/web/src/layouts/BaseLayout.astro` (links de favicon)
- `apps/web/src/lib/brand/constants.ts` (`INSTAGRAM_IMAGE`)
- `apps/web/src/lib/brand-assets-public.test.ts`
- `tests/e2e/admin-crud-authenticated.spec.ts` (marca + CRUD autenticado)

## O que não foi feito

- Alteração de `Logo/` (preservada)
- Mudança de paleta / redesign
- Commit, push ou deploy
- Screenshots versionados no git (`tmp/admin-visual/` local)

## Validação visual

Capturas locais (não versionar): `tmp/admin-visual/`

Larguras obrigatórias: 375, 768, 1024, 1366, 1920 (cobertas pelo spec E2E de marca).

## Pendências de licença

Ativos de marca: propriedade do projeto (origem `Logo/`).
Imagens editoriais de terceiros: fora deste lote; manter crédito/origem no painel quando aplicável.
