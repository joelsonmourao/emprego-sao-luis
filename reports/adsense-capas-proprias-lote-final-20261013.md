# Capas próprias — lote editorial final

Data: 13/10/2026

## Entrega

As seis capas do último lote editorial deixaram de depender de fotografias externas sem licença individual comprovada. Foram substituídas por ilustrações vetoriais originais, renderizadas em WebP 1200 × 630, com a paleta oficial do Empregos São Luís (`#9B2D30`, grafite, branco e laranja de apoio).

| Slug | Conceito visual |
| --- | --- |
| `pedir-feedback-entrevista-emprego` | balão de conversa e resposta |
| `plano-semanal-vagas-sao-luis` | calendário e tarefa concluída |
| `produtividade-busca-emprego-sao-luis` | cronômetro e bloco de foco |
| `rejeicao-processo-seletivo-como-reagir` | rota com mudança de direção |
| `retorno-mercado-trabalho-gap-curriculo` | seta de retorno e novo começo |
| `transporte-entrevista-emprego-sao-luis` | ônibus e planejamento de trajeto |

O manifesto `credits.json` registra `source: original`, `licenseStatus: owned`, autoria institucional e a base de direitos. Nenhuma foto, rosto, logotipo de terceiro ou banco externo foi incorporado nessas seis imagens.

## Verificação automatizada

O teste `editorial-cover-rights.test.ts` exige, para os seis slugs:

- origem original e direitos próprios;
- ausência de atribuição Unsplash/Picsum;
- base de direitos não vazia;
- arquivo WebP existente em 1200 × 630.

## Limites

- Este lote resolve direitos apenas das seis capas listadas.
- As demais capas externas continuam pendentes de comprovação individual ou substituição.
- Deploy e publicação pública: **ZERO**.
- Banco, seed, migration de produção, DNS, webhook, Instagram, Direct e pagamentos: **ZERO**.
- O estado informado do AdSense continua “conteúdo de baixo valor”; nenhuma nova revisão foi solicitada.
