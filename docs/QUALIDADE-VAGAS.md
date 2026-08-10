# Relatório de qualidade das vagas

Snapshot de 9 de agosto de 2026.

## Produção pública

As 36 URLs presentes no sitemap de vagas foram carregadas individualmente.

| Medida                           | Resultado |
| -------------------------------- | --------: |
| URLs verificadas                 |        36 |
| HTTP 200                         |        36 |
| `JobPosting` presente            |        36 |
| `identifier` presente            |        36 |
| logo da organização presente     |        36 |
| salário estruturado igual a zero |        20 |
| rua/CEP placeholder              |        35 |
| `directApply: true`              |         0 |

Os grupos de salário zero e endereço placeholder se sobrepõem. O exemplo recorrente é `streetAddress` e `postalCode` iguais a “Não Informado”. O código local foi corrigido para omitir salário e endereço quando não existe valor comprovado; a produção ainda não recebeu a alteração.

## Corpus integral real

O PostgreSQL disponível em `.env`/`.env.local` não contém `es_jobs` nem qualquer tabela `es_*`. Portanto, os totais reais de ativas, expiradas, duplicadas, suspeitas, incompletas e links problemáticos permanecem indisponíveis. “Indisponível” não significa zero.

## Prova integral no banco E2E

Estes números são apenas de fixtures e não podem ser usados como diagnóstico de produção:

| Medida                 | Fixtures E2E |
| ---------------------- | -----------: |
| Vagas analisadas       |           81 |
| Com algum problema     |           81 |
| Completas              |           18 |
| Incompletas            |           63 |
| Expiradas              |           52 |
| Duplicadas             |           18 |
| Sem fonte              |           63 |
| Sem URL de candidatura |           25 |
| Localização inválida   |           18 |
| Link quebrado          |           29 |
| Grupos de duplicidade  |           82 |

Todos os 81 registros têm marcadores de teste/staging. A ausência de `JobPosting` válido/inválido nessa execução decorre de não haver vaga publicada atual elegível no conjunto de fixtures.

## Regras implementadas

- estados `OK`, `REVISAR`, `EXPIRADA`, `DUPLICADA`, `INCOMPLETA` e `SUSPEITA`;
- fonte e URL de origem verificáveis;
- canal gratuito de candidatura por URL, e-mail ou WhatsApp;
- empresa identificável e cidade/UF coerentes;
- código IBGE ausente como sinal de revisão, sem inventar município;
- salário mínimo/máximo, moeda, período, zero e valores extremos;
- expiração e status incompatíveis;
- descrição, contrato, requisitos e benefícios;
- duplicidade por hash, origem, candidatura, identidade da vaga e similaridade;
- link `ATIVO`, `REDIRECIONADO`, `ERRO` ou `INDETERMINADO`, sem encerrar automaticamente por 403/429/timeout;
- compatibilidade entre conteúdo visível e `JobPosting`;
- candidatura sempre gratuita e sem anúncio cobrindo ou imitando o CTA.

## Ação necessária antes do reenvio

Executar `/admin/qualidade-vagas` contra o banco real, conferir cada caso na fonte original e revisar as 36 páginas após a publicação do código corrigido. Não renovar `validThrough`, alterar salário/localidade ou remover duplicidade sem evidência.
