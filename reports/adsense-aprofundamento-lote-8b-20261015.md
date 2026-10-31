# Aprofundamento editorial — segundo lote de 8 guias (15/10/2026)

## Critério de seleção

A medição foi refeita no branch integrado `codex/admin-negocio-completo`, após o PR #62. Foram escolhidos os dois guias abaixo de 400 palavras, cinco dos próximos guias curtos com risco factual/local e um guia de direitos trabalhistas. O guia `mapa-setores-vagas-sao-luis` ficou fora porque já possuía cinco fontes e estrutura mais robusta.

## Resultado mensurado

| Guia | URL de produção | Antes | Depois | Acréscimo | Fontes externas |
|---|---|---:|---:|---:|---:|
| Mensagem fria ao recrutador | https://empregossaoluis.com.br/blog/mensagem-fria-recrutador-linkedin | 362 | 746 | +384 | 3 |
| Acompanhar candidatura | https://empregossaoluis.com.br/blog/acompanhar-candidatura-emprego | 390 | 755 | +365 | 2 |
| Roupa para entrevista | https://empregossaoluis.com.br/blog/o-que-vestir-entrevista-emprego | 508 | 757 | +249 | 3 |
| Transporte para entrevista em São Luís | https://empregossaoluis.com.br/blog/transporte-entrevista-emprego-sao-luis | 510 | 819 | +309 | 3 |
| Pedir feedback | https://empregossaoluis.com.br/blog/pedir-feedback-entrevista-emprego | 511 | 819 | +308 | 3 |
| Mudança de carreira | https://empregossaoluis.com.br/blog/mudanca-de-carreira-sao-luis-curriculo | 534 | 816 | +282 | 2 |
| Gestão do tempo | https://empregossaoluis.com.br/blog/gestao-de-tempo-trabalho-dicas | 537 | 816 | +279 | 2 |
| Direitos do terceirizado | https://empregossaoluis.com.br/blog/trabalhador-terceirizado-direitos | 563 | 880 | +317 | 3 |
| **Total** | — | **3.915** | **6.408** | **+2.493** | — |

A contagem considera o texto visível de `contentHtml`, com tags removidas. O teste automatizado usa tokenização mais permissiva e exige no mínimo 740 palavras por guia.

## Alterações editoriais específicas

- Mensagem ao recrutador: finalidade do contato, quatro filtros, verificação de identidade e encerramento sem insistência.
- Acompanhamento: distinção entre confirmação automática e avanço, regra por canal, revisão do funil e arquivamento privado.
- Roupa: escolha por atividade, acessibilidade, segurança e alternativa sem compra compulsória.
- Transporte: consulta em dois horários, custo informado pelo usuário e segurança diante de mudança de endereço.
- Feedback: registro literal, situações em que não pedir, ação verificável e limite contra discriminação.
- Mudança de carreira: ciclo de duas semanas, compatibilidade com rotina em São Luís e ordem das evidências.
- Gestão do tempo: capacidade, passagem de turno, análise do processo e encerramento da jornada.
- Terceirização: diferença para trabalho temporário, conferência de registros, mudança de tarefa e canal por tipo de problema.

## Fontes e limites

As fontes externas incluem LinkedIn Help, CERT.br, gov.br/MTE, Planalto, SINE, CTPS Digital, Quadro Brasileiro de Qualificações, EVG e páginas oficiais da Prefeitura de São Luís. O texto não cria vagas, salários, tarifas, empresas ou prazos. No tema jurídico, organiza documentos e canais sem determinar responsabilidade em um caso concreto.

O teste por slug confirma:

- `reviewedAt: 2026-10-15`;
- mínimo de 740 palavras;
- pelo menos duas fontes HTTPS externas distintas;
- duas seções exclusivas por guia;
- ausência de promessa de vaga, salário, contratação ou aprovação.

## Imagens

Nenhum WebP foi alterado. Nome de fotógrafo ou menção a Unsplash não comprova a licença do binário. Peso, dimensões, relação visual com o tema e cadeia de licença dos oito arquivos continuam sem comprovação específica neste lote; os guias não são marcados como visualmente auditados.

## Publicação

Este lote altera código e testes. Nenhum deploy foi executado e nenhuma revisão AdSense foi solicitada. As URLs públicas podem continuar exibindo a versão anterior até publicação autorizada e validada.
