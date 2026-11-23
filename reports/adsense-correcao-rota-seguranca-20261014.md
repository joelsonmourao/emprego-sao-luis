# Correção editorial da rota de segurança — 14/10/2026

## Página revisada

- `/blog/como-usar-empregos-sao-luis`

## Problema encontrado

O guia apontava a expressão “segurança do candidato” para `/seguranca`, rota que não existe no aplicativo. A página institucional publicada no código usa `/seguranca-candidatos`.

## Correção

- link atualizado para `/seguranca-candidatos`;
- data editorial visível e `reviewedAt` atualizados para 14/10/2026;
- teste de integridade ampliado para validar, além dos 106 guias e cinco notícias auditados, rotas estáticas de ferramentas, guias e páginas institucionais referenciadas pelos overrides.

## Limites

Esta entrega altera somente código, teste e documentação. Não houve deploy, mudança em banco, DNS, webhook, Instagram/Direct ou aplicação externa. A produção continua na versão anterior até o gate de recuperação ser comprovado.
