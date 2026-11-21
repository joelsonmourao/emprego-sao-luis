# Transparência editorial e consistência de SEO — 13/10/2026

## Escopo

Correção aplicada às páginas públicas de guias e notícias. O objetivo é fazer a interface visível e o JSON-LD representarem a mesma revisão editorial, sem alterar datas originais de publicação nem dados do banco.

## Correções

- As cinco notícias com override editorial passam a mostrar **Revisado em 13/10/2026** ao lado da data original de publicação.
- `datePublished` continua vindo da publicação original; `dateModified` continua vindo exclusivamente de `reviewedAt`.
- Canonicals de guias e notícias agora passam pela mesma validação de origem e caminho usada no layout público antes de alimentar `mainEntityOfPage` e links de compartilhamento.
- Imagens de Article/NewsArticle são convertidas em URLs HTTP(S) públicas absolutas; esquemas deixam de aceitar URL relativa, localhost, rede privada ou protocolo não HTTP.

## Notícias abrangidas

1. `/noticias/vagas-hotelaria-temporada-sao-luis`
2. `/noticias/contrato-temporario-temporada-direitos`
3. `/noticias/feriado-ponto-facultativo-sao-luis`
4. `/noticias/decimo-terceiro-salario-pagamento-clt`
5. `/noticias/imposto-de-renda-2026-trabalhador-clt`

## Limites

Esta mudança é somente de código. Não houve deploy, alteração de banco, migration, seed, reset, DNS, webhook, Instagram/Direct ou solicitação de nova análise ao AdSense. A publicação continua condicionada à comprovação de recovery e rollback.
