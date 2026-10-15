# Blog Fantasma adaptado — redação interna assistida

## Conceito

Neste projeto, “Blog Fantasma” **não** significa publicação automática em massa. É uma redação interna assistida: o sistema ajuda a planejar, briefar, rascunhar e auditar; humanos revisam e publicam.

## Fluxo editorial

`DRAFT → PENDING_REVIEW → APPROVED → SCHEDULED → PUBLISHED`

Estados auxiliares: `NEEDS_CORRECTION`/`REJECTED`/`PAUSED`/`ARCHIVED`/`OUTDATED` (conforme status de publicação já modelados).

Publicação exige, no mínimo: autor, revisor, pilar, cluster, fontes, revisão factual, corpo com qualidade mínima, imagem com ALT/crédito e etapa editorial `APPROVED`.

## Limites da automação

Permitido: pautas, briefs, sugestões de links, auditoria de órfãos/rasos/canibalização, elegibilidade interna Discover/News/Web Story.

Proibido: publicar automaticamente; inventar fatos/fontes/dados locais; copiar releases; gerar centenas de URLs; alterar data para parecer novo; misturar a mesma matéria como blog e notícia concorrentes.

## Pilares e clusters

Entidades reais: `es_content_pillars` e `es_content_clusters` (migrations `0024`/`0025`). Painel em `/admin/conteudo/estrategia`.

## Post Magnético

Template `POST_MAGNETICO` com gancho local, resposta principal, CTAs separados (candidato gratuito vs empresa) e pontuação interna (`scorePostMagnetico`). A pontuação **não** representa ranking do Google e **não** publica sozinha.

## Auditorias

`auditEditorialContent` e a página de estratégia listam conteúdo raso, órfão, links quebrados, canibalização e pendências de governança.
