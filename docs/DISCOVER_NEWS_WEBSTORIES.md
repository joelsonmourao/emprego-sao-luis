# Discover, Google News e Web Stories

## Escopo interno

Flags em artigos: `discoverEligible`, `newsEligible`, `webStoryEligible`. São análises editoriais internas — **não** afirmam seleção pelo Google.

## Preparação técnica já prevista

Autoria, datas reais, fontes, imagens, `max-image-preview:large`, Article/NewsArticle conforme tipo, canonical, news sitemap e OG.

## Web Stories

Entidade `es_web_stories` com fluxo `DRAFT → … → PUBLISHED`.

Regras: narrativa própria (≥3 páginas), artigo de origem elegível, poster+ALT, canonical próprio, revisão humana, sem publicação automática, duplicata só como rascunho.

Admin: `/admin/web-stories`  
Público: `/web-stories/[slug]`  
Sitemap: categoria `web-stories`

## Diferença para Instagram Story

Web Story é página própria indexável/AMP-like com revisão editorial. Não é espelho promocional do Instagram nem conversão automática de toda notícia.
