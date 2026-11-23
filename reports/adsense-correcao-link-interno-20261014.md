# Correção editorial de link interno — 14/10/2026

## Página revisada

- `/blog/linkedin-primeiro-emprego`

## Problema encontrado

O texto apontava “objetivo profissional” para `/blog/objetivo-profissional`, slug ausente no inventário público auditado. O conteúdo correspondente existe em `/blog/objetivo-profissional-curriculo`.

## Correção

- link interno atualizado para `/blog/objetivo-profissional-curriculo`;
- data editorial visível e `reviewedAt` atualizados para 14/10/2026;
- teste de integridade criado para comparar todos os links `/blog/...` e `/noticias/...` presentes nos overrides com os 106 guias e as cinco notícias do inventário auditado.

## Limites

Esta entrega altera somente código, teste e documentação. Não houve deploy, mudança em banco, DNS, webhook, Instagram/Direct ou aplicação externa. A produção continua na versão anterior até o gate de recuperação ser comprovado.
