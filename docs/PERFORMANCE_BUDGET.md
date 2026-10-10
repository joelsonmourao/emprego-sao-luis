# Orçamento de performance

## Metas

| Indicador | Meta |
| --- | ---: |
| LCP | ≤ 2.500 ms |
| CLS | ≤ 0,10 |
| INP (campo) | ≤ 200 ms |
| Lighthouse performance | ≥ 85 |
| Lighthouse acessibilidade | ≥ 90 |
| Lighthouse SEO | ≥ 90 |
| Lighthouse boas práticas | ≥ 90 |

INP depende de dados reais de campo; no laboratório, TBT é acompanhado como aproximação, sem ser apresentado como INP.

## Estratégia

- HTML público anônimo: cache compartilhado curto com `stale-while-revalidate`.
- admin, conta, login e APIs privadas: `private, no-store`.
- mídia e assets versionados: cache imutável de um ano.
- fontes locais, sem CSS bloqueante do Google Fonts.
- imagem LCP com WebP, dimensões, `srcset`, `sizes` e prioridade.
- runtime React apenas nas ilhas funcionais; menu mobile e consentimento globais usam JavaScript nativo, com consentimento inicializado por `requestIdleCallback`.

## Gates

```powershell
npm run audit:performance
$env:SITE_URL='http://127.0.0.1:4321'; npm run lighthouse:local
```

A auditoria final local de 14/07/2026 marcou 99–100 em performance e 100 em acessibilidade, SEO e boas práticas nas oito rotas principais. O LCP ficou entre 1.207 e 1.604 ms, CLS em 0 e TBT em 0 ms. Refaça no SHA publicado, com CDN, anúncios e integrações reais.
