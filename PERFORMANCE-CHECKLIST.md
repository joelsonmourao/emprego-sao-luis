# Performance & Lighthouse — Emprego São Luís

Checklist antes do deploy e da solicitação de aprovação no AdSense.

## Metas Lighthouse

| Métrica | Meta |
|---------|------|
| Performance | 98+ |
| SEO | 100 |
| Accessibility | 95+ |
| Best Practices | 95+ |
| LCP | &lt; 2,5s |
| INP | &lt; 200ms |
| CLS | &lt; 0,1 |

## Páginas para testar

- [ ] Home (`/`)
- [ ] Vagas (`/vagas`)
- [ ] Blog (`/blog`)
- [ ] Post individual (`/blog/[slug]`)
- [ ] Vaga individual (`/vagas/[slug]`)
- [ ] Contato (`/contato`)
- [ ] Sobre (`/sobre`)
- [ ] Quem Somos (`/quem-somos`)
- [ ] Privacidade (`/privacidade`)
- [ ] Termos (`/termos`)
- [ ] Cookies (`/cookies`)

## Dispositivos

- [ ] Mobile (375px)
- [ ] Desktop (1280px+)

## Imagens

- [ ] Capas do blog em `public/images/blog/` (SVG leve)
- [ ] `next/image` com width/height definidos
- [ ] Lazy loading em cards (exceto hero quando necessário)
- [ ] Sem imagens pesadas ou externas sem controle

## Core Web Vitals

- [ ] CLS verificado (imagens com dimensões)
- [ ] Fonte via `next/font` (Plus Jakarta Sans, display swap)
- [ ] Sem animações pesadas
- [ ] Server Components nas páginas públicas principais
- [ ] JavaScript client apenas onde necessário (busca, consentimento)

## SEO

- [ ] Canonical em todas as páginas indexáveis
- [ ] Open Graph configurado
- [ ] `robots.txt` e `sitemap.xml` corretos
- [ ] JSON-LD (Organization, Article, JobPosting onde aplicável)

## Links e conteúdo

- [ ] `npm run audit:site` sem problemas críticos
- [ ] Sem lorem ipsum, páginas vazias ou "em construção"
- [ ] Blog com 30+ artigos completos
- [ ] Páginas institucionais com texto real

## AdSense

- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT_ID` vazio até aprovação
- [ ] `ads.txt` sem publisher falso
- [ ] Consultar `ADSENSE-CHECKLIST.md`

## Comandos úteis

```bash
npm run build
npm run audit:site
npm run audit:site -- --live
npm run lighthouse:local
```
