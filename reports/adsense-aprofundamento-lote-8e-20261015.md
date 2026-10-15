# Aprofundamento editorial AdSense — lote 8e

Data da revisão: 2026-10-15

## Escopo efetivamente reescrito

Este lote aprofunda oito guias curtos e de maior risco factual, priorizando direitos trabalhistas, saúde, decisões salariais, dados pessoais e contexto local de São Luís.

| Guia | Palavras antes | Palavras depois | Ganho | Fontes HTTPS | Seções depois |
|---|---:|---:|---:|---:|---:|
| `entrevista-desligamento-o-que-falar` | 568 | 801 | +233 | 2 | 8 |
| `experiencia-informal-curriculo-como-colocar` | 574 | 823 | +249 | 3 | 8 |
| `saude-mental-trabalho-limites` | 575 | 784 | +209 | 3 | 7 |
| `sindicato-trabalhador-direitos-basico` | 575 | 803 | +228 | 3 | 8 |
| `como-pedir-aumento-salario` | 577 | 823 | +246 | 2 | 8 |
| `salario-custo-de-vida-sao-luis` | 579 | 866 | +287 | 5 | 9 |
| `ferias-clt-periodo-aquisitivo` | 580 | 882 | +302 | 2 | 9 |
| `entrevista-presencial-sao-luis-dicas` | 577 | 873 | +296 | 2 | 9 |
| **Total** | **4.605** | **6.655** | **+2.050** |  |  |

## Mudanças editoriais reais

- A entrevista de desligamento ganhou matriz de pendências e separação entre relato, opinião e solicitação.
- A experiência informal passou a orientar prova em três camadas, autorização e consistência entre currículo, entrevista e cadastro.
- O guia de saúde mental separa cuidado individual de risco organizacional e inclui plano de escalonamento sem autodiagnóstico.
- O guia sindical ensina o teste de partes, categoria, território e vigência e diferencia entidade laboral de patronal.
- O pedido de aumento ganhou tabela verificável de escopo e um roteiro para aprovação, plano ou negativa.
- A comparação de salário e custo de vida em São Luís ganhou teste de estresse do primeiro mês, custo de tempo e perguntas pendentes.
- O guia de férias detalha documentos de comunicação, concessão e pagamento, fracionamento e dossiê mínimo de divergência.
- A entrevista presencial ganhou protocolo de chegada/saída, ficha pós-entrevista e nova verificação quando unidade ou turno mudam.

## Fontes e limites

Foram lidas e preservadas fontes primárias, incluindo CLT compilada no Planalto, Lei nº 9.029/1995, CNES, Mediador/MTE, Ministério da Saúde, OMS, OIT, CBO, CTPS Digital, LGPD, IBGE e Prefeitura de São Luís. O conteúdo identifica quando é necessário sindicato, Inspeção do Trabalho, serviço de saúde ou profissional habilitado. Não calcula verbas, diagnostica doença, determina aplicação de instrumento coletivo ou inventa tarifa, salário, empresa, vaga ou prazo.

## Testes por URL

O arquivo `apps/web/src/lib/editorial-content-overrides.test.ts` exige para os oito slugs:

- `reviewedAt` igual a 2026-10-15;
- pelo menos 780 palavras;
- ao menos duas fontes HTTPS distintas;
- dois subtítulos exclusivos por artigo;
- ausência de alegações proibidas sobre vagas, salário médio, contratação ou aprovação garantida.

## Imagens e publicação

Nenhuma licença foi inferida do nome de arquivo. Peso, dimensões, crédito e licença das capas permanecem pendentes quando o binário e a origem documental não estão disponíveis no repositório. Este lote não executa deploy e não solicita revisão do AdSense.

## Progresso do recorte de 86 guias

Após este lote, **42 de 86** guias foram aprofundados e **44 de 86** continuam pendentes. Noindex não é contado como reescrita.
