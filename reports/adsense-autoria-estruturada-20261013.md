# Autoria e dados estruturados editoriais — 13/10/2026

## Entrega

- As páginas de guias e notícias passaram a usar o mesmo construtor auditado de `Article`/`NewsArticle`.
- A assinatura institucional **Redação Empregos São Luís** é representada como `Organization` e aponta para `/redacao`, em vez de ser publicada como uma pessoa fictícia.
- Autores pessoais reais continuam representados como `Person`.
- `publisher` referencia a organização já declarada no grafo principal da página.
- `mainEntityOfPage` usa `WebPage` com a canonical pública validada.
- `dateModified` considera a revisão editorial registrada e nunca fica anterior à publicação.
- Conteúdo editorial é declarado como gratuito (`isAccessibleForFree: true`).

## Limites

- Alteração integrada em código não equivale a deploy.
- Nenhum banco, vaga, candidatura, pagamento, webhook, DNS, Instagram ou Direct foi alterado.
- O estado do Google AdSense não foi alterado e nenhuma nova análise foi solicitada.
