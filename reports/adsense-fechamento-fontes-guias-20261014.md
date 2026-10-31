# Fechamento da lacuna de fontes dos guias — 14/10/2026

## Escopo

A auditoria pública de 12/10/2026 registrou `NO_EXTERNAL_SOURCE` nos 106 guias. A triagem seguinte priorizou 98 textos repetitivos ou curtos, mas essa seleção deixou sete guias sem override editorial e três overrides sem link externo identificável.

Esta entrega não altera a publicação original, não executa deploy e não representa aprovação do Google AdSense.

## Reescritas integrais desta rodada

1. `/blog/perguntas-comuns-entrevista-emprego`
2. `/blog/objetivo-profissional-curriculo`
3. `/blog/salario-custo-de-vida-sao-luis`
4. `/blog/comparar-portais-emprego-seguranca`
5. `/blog/quantas-vagas-candidatar-por-semana`
6. `/blog/vagas-comercio-servicos-sao-luis-perfil`
7. `/blog/mapa-setores-vagas-sao-luis`

As reescritas usam fontes identificáveis — MTE, SINE/gov.br, IBGE, Prefeitura de São Luís, Planalto e CERT.br — e evitam números de vagas, salários, tarifas, empresas ou prazos não comprovados.

## Complementação de fontes

Três guias já reescritos receberam referências externas e revisão datada de 14/10/2026:

1. `/blog/acompanhar-candidatura-emprego`
2. `/blog/curriculo-pdf-erros-triagem`
3. `/blog/entrevista-comportamental-exemplos`

## Estado verificável no código

- 106/106 slugs da auditoria possuem override editorial.
- 106/106 overrides contêm pelo menos um link externo HTTPS identificável.
- 0 guias permanecem no conjunto `guidesPendingReview`.
- 5/5 notícias continuam com revisão factual separada.
- O teste de corpus agora exige override e fonte externa para todos os 106 guias originalmente sinalizados com `NO_EXTERNAL_SOURCE`.

## Limites

- Publicação em produção: **não executada**.
- Revalidação das URLs públicas após deploy: **não aplicável nesta rodada**.
- Estado do AdSense: permanece o último estado conhecido, “conteúdo de baixo valor”.
- Backup independente restaurável, restauração isolada e rollback de código e dados continuam necessários antes de publicar.
