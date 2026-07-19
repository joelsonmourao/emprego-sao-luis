# Auditoria de ativos de imagem (marca)

Data: 2026-07-19 (reavaliação contraste / transparência / favicon)  
Escopo: logos, favicon, Instagram, OG — sem redesenhar paleta do site.  
`Logo/` permanece **somente leitura** (fontes oficiais não alteradas).

## Diagnóstico (causa raiz)

| Achado | Evidência |
|--------|-----------|
| Fontes em `Logo/*.png` **não têm canal alpha** | `hasAlpha: false`, `channels: 3` — fundo branco/cinza **opaco** |
| “Falta transparência” no site | Derivados antigos copiavam esse fundo → caixa clara no header/footer |
| Contraste ruim no rodapé | Logo com tipografia **escura** (vinho/cinza) sobre `--brand-secondary` (#1A1A1A); `LOGO_DARK` apontava para o mesmo arquivo do header |
| Favicon ilegível | PNG era o logo completo (mascote+ES) em 16–32px; `favicon.svg` antigo tinha **texto `#1A1A1A` no fundo `#1A1A1A`** (invisível) |
| OG/social | Alpha em PNG faz muitas redes preencharem com **preto** → letras escuras somem |

## Correções aplicadas

1. **Gerador** `scripts/generate-brand-public-assets.mjs`  
   - Flood-fill a partir das bordas remove fundo claro → **alpha real** (~70% transparente nos logos).  
   - `logo-horizontal-on-dark.webp` = logo sobre **placa branca** (contraste no footer).  
   - Favicons 16–512 rasterizados a partir do **SVG de marca ES** (não do logo inteiro).  
   - `brand/og-default.png` 1200×630 com fundo branco opaco.

2. **Wiring**  
   - `FALLBACK_PATHS.LOGO_DARK` → `/brand/logo-horizontal-on-dark.webp`  
   - `FALLBACK_PATHS.FAVICON` → `/favicon.svg`  
   - `BaseLayout`: `rel=icon` SVG primeiro  
   - Footer: `bg-white` + cantos arredondados no logo escuro  
   - `BrandLogo` usa `FALLBACK_PATHS[assetKey]` (não um único path fixo)

3. **Favicon SVG**  
   - Fundo `#9B2D30`, letras `#F5F5F5`, acentos laranja/vermelho da marca.

## Matriz de uso

| Superfície | Ativo | Fundo do site | Estratégia |
|------------|-------|---------------|------------|
| Header | `logo-horizontal.webp` | claro | alpha real |
| Footer | `logo-horizontal-on-dark.webp` | escuro | placa branca + `bg-white` |
| Instagram CTA | `icon-instagram.webp` | painel | flatten branco |
| Aba do browser | `favicon.svg` (+ PNG/ICO) | qualquer | marca ES sólida |
| OG / e-mail | `og-default.png` | n/a | branco opaco 1200×630 |
| PWA / Apple | `icon-192` / `512` / apple-touch | n/a | do SVG |

## Regenerar

```powershell
cd C:\Users\Joelson\Documents\ES
node scripts/generate-brand-public-assets.mjs
npx vitest run apps/web/src/lib/brand-assets-public.test.ts
```

## O que ainda pode precisar (manual / produção)

- Se o **painel de identidade** (`/admin` marca) tiver uploads antigos no banco, eles **sobrescrevem** os fallbacks — reenviar ativos novos ou limpar overrides.
- Fontes em `Logo/` continuam RGB sem alpha; o gerador corrige só o que vai para `public/`. Ideal a longo prazo: exportar PNG/WebP **com alpha verdadeiro** do design (sem fundo).
- Hard refresh / CDN após deploy para limpar favicon em cache.

## Fora de escopo

- Alterar arquivos em `Logo/`  
- Redesign de mascote / tipografia  
- Paleta CSS do site  
