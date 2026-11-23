# AdSense — aprofundamento editorial lote 8i (15/10/2026)

## Escopo

Oito guias ainda curtos foram aprofundados individualmente. O lote prioriza vagas locais, inclusão, proteção de dados e decisões de candidatura com risco factual. Nenhum texto anuncia empresa contratando, salário local, tarifa, data de processo ou promessa de aprovação.

| Slug | Antes | Depois | Fontes HTTPS | Seções H2 |
|---|---:|---:|---:|---:|
| `vagas-restaurante-sao-luis-dicas` | 589 | 915 | 2 | 7 |
| `vaga-sazonal-comercio-sao-luis` | 594 | 907 | 2 | 7 |
| `vaga-recepcionista-clinica-sao-luis` | 596 | 877 | 2 | 7 |
| `auxiliar-administrativo-vagas-sao-luis` | 652 | 919 | 3 | 7 |
| `vagas-afirmativas-como-candidatar` | 595 | 882 | 6 | 8 |
| `pretensao-salarial-entrevista-dicas` | 598 | 898 | 2 | 8 |
| `certificado-ou-experiencia-curriculo` | 575 | 853 | 2 | 7 |
| `soft-skills-hard-skills-curriculo` | 571 | 875 | 3 | 7 |
| **Total** | **4.770** | **7.126** | — | — |

Acréscimo líquido: **2.356 palavras**. Cada guia recebeu exemplos delimitados, procedimentos próprios e pelo menos duas fontes externas identificáveis.

## Fontes verificadas

- restaurante: RDC 216/2004 da Anvisa e NR 6 do Ministério do Trabalho e Emprego;
- sazonal: Lei nº 6.019/1974 e Carteira de Trabalho Digital;
- recepção de clínica: LGPD e direitos dos titulares publicados pela ANPD;
- auxiliar administrativo: CBO, LGPD e serviço público Buscar Emprego no SINE;
- vagas afirmativas: MPT, Lei nº 9.029/1995, LGPD, Lei Brasileira de Inclusão, Lei nº 8.213/1991 e ANPD;
- pretensão salarial: Sistema Mediador e CBO;
- certificado e experiência: CBO e Escola Virtual de Governo;
- hard e soft skills: CBO e Europass.

As fontes foram usadas para delimitar regras e conferir procedimentos. Elas não foram transformadas em previsão de vaga, preço ou resultado individual.

## Imagens

As oito capas são arquivos WebP reais em `apps/web/public/covers/sl-local/`, com 1200 × 630 pixels:

| Slug | Bytes |
|---|---:|
| `vagas-restaurante-sao-luis-dicas` | 22.546 |
| `vaga-sazonal-comercio-sao-luis` | 21.028 |
| `vaga-recepcionista-clinica-sao-luis` | 21.758 |
| `auxiliar-administrativo-vagas-sao-luis` | 20.226 |
| `vagas-afirmativas-como-candidatar` | 25.236 |
| `pretensao-salarial-entrevista-dicas` | 26.096 |
| `certificado-ou-experiencia-curriculo` | 24.254 |
| `soft-skills-hard-skills-curriculo` | 24.176 |

Inspeção visual confirmou relação direta entre título, ícone e tema. `credits.json` identifica todas como ilustração editorial original, com `source: original`, `licenseStatus: owned`, crédito, legenda, texto alternativo e base declarada de licença. Não foi inferida licença por nome de arquivo ou menção a banco externo.

## Validação

O teste do lote exige, por URL:

- revisão em 15/10/2026;
- mínimo individual entre 840 e 900 palavras;
- pelo menos duas fontes HTTPS distintas;
- duas seções exclusivas do guia;
- ausência de alegações de vaga aberta, salário médio ou contratação garantida.

Gates locais concluídos com sucesso:

- `npm run recovery:evidence:check`;
- `npm run lint`;
- `npm run typecheck`;
- `TZ=America/Sao_Paulo npm run test -- --reporter=dot`;
- `npm run migration:check`;
- `npm run build`.

Resultado da suíte: **93 arquivos de teste aprovados, 1 ignorado; 448 testes aprovados e 4 ignorados**. A primeira execução do teste novo encontrou a expressão proibida em uma ressalva editorial sobre média salarial; a redação foi ajustada sem reduzir o controle, e a suíte final ficou verde.

## Contador e operação

- Base de aprofundamento: 86 guias.
- Antes deste lote: 66 aprofundados; 20 pendentes.
- Neste lote: 8 aprofundados.
- Após este lote: **74/86 aprofundados; 12 pendentes**.

O contador mede aprofundamento editorial, não `noindex`, auditoria, publicação ou aprovação do Google. Nenhuma revisão AdSense foi solicitada. Nenhum deploy, alteração de Coolify, DNS, webhook, banco de vagas, pagamentos, Instagram/Direct, Mundo do Aprendiz ou Vagas RJ foi realizado neste lote.
