# Revisão editorial AdSense — guias factuais, parte 4

Data editorial: 14/10/2026

## Escopo concluído no código

Este lote reescreve e amplia oito guias que ainda estavam entre os mais curtos do inventário de 106 overrides. A revisão não cria vagas, empresas, salários nem promessa de contratação. Cada guia passou a ter pelo menos 600 palavras e duas URLs externas distintas em fontes primárias oficiais.

| Guia | Antes | Depois | Foco da revisão |
| --- | ---: | ---: | --- |
| `pesquisar-empresa-antes-entrevista` | 306 | 628 | CNPJ como indício limitado, confirmação independente do recrutador, perguntas de consistência e reação a golpe |
| `primeiro-emprego-sao-luis-checklist` | 307 | 664 | Diferença entre vaga inicial, aprendizagem e estágio; currículo verificável; plano de sete dias |
| `acidente-de-trabalho-o-que-fazer` | 532 | 739 | Separação entre CAT, atendimento, benefício e investigação; linha do tempo factual e retorno ao trabalho |
| `transferencia-interna-emprego-como-pedir` | 554 | 759 | Instrumento coletivo, comparação antes/depois e roteiro de reunião |
| `freelancer-ou-clt-vantagens` | 556 | 807 | Comparação líquida, formalização, teste de escopo e sinais de possível divergência entre contrato e prática |
| `servicos-gerais-epi-vaga` | 557 | 784 | Responsabilidades da NR-6, consulta de CA e registro objetivo de desvio |
| `home-office-remoto-checklist-vaga` | 558 | 757 | Transparência de monitoramento, ergonomia, segurança e teste operacional antes do início |
| `documentos-admissao-emprego-maranhao` | 570 | 801 | NR-7, matriz documento–finalidade e conferência do vínculo sem entrega de credenciais |

## Fontes e limites

- Serviços e páginas temáticas de `gov.br`, incluindo MTE, INSS, Receita Federal e Ministério da Justiça.
- Texto legal oficial no Planalto.
- Consulta de Certificado de Aprovação mantida no domínio do Trabalho.
- As páginas distinguem regra geral de análise individual, orientam a confirmar a versão atual da fonte e proíbem senha, código de autenticação, pagamento de seleção e experiência inventada.

## Verificação automatizada

Foi adicionado teste por slug que exige:

1. `reviewedAt` igual a `2026-10-14`;
2. mínimo de 600 palavras;
3. pelo menos duas URLs externas distintas;
4. domínios oficiais permitidos;
5. ausência dos padrões genéricos e das promessas vedadas já monitoradas pelo projeto.

## Estado operacional

- Deploy deste lote: **ZERO**.
- URLs públicas com este texto: **ZERO**, até existir deploy comprovado.
- Backup independente restaurável, restauração isolada e rollback de código e dados: **não comprovados neste lote**.
- Estado AdSense: permanece **reprovado por conteúdo de baixo valor**; nenhuma nova revisão foi solicitada.
- Este relatório comprova correção editorial no código e testes; não comprova publicação, recuperação ou aprovação do Google.
