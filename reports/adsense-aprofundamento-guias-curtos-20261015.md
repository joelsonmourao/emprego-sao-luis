# Aprofundamento dos dois guias mais curtos — 15/10/2026

## Escopo

A medição foi executada sobre `codex/admin-negocio-completo` no commit `12bde9c9264c2443704a02f0e8fd6bc44a14f710`, antes deste lote.

- 106 guias com override editorial.
- 5 notícias com override factual.
- 111 textos com ao menos um link externo.
- Mediana do corpus revisado: 583 palavras.
- Dois guias eram os únicos abaixo de 350 palavras.
- A lista `guidesPendingReview` continuava vazia; esta melhoria não reclassifica `noindex` como revisão.

## Correções efetivas

| URL pública | Antes | Depois | Fontes externas | Mudança editorial |
| --- | ---: | ---: | ---: | --- |
| https://empregossaoluis.com.br/blog/curriculo-pdf-erros-triagem | 327 palavras | 831 palavras | 2 | Processo de seleção de evidências, estrutura para primeiro emprego, teste de extração do PDF, versionamento, proteção de dados e checklist final. |
| https://empregossaoluis.com.br/blog/entrevista-comportamental-exemplos | 344 palavras | 937 palavras | 2 | Banco de episódios, quatro partes da resposta, exemplos distintos para atendimento/logística/administração/primeiro emprego, confidencialidade, perguntas ao entrevistador, treino e segurança. |

As contagens foram obtidas removendo as tags HTML e separando o texto visível por espaços. O objetivo do lote não foi atingir um número arbitrário, mas eliminar as duas exceções curtas com conteúdo específico e testável.

## Fontes verificadas

- Classificação Brasileira de Ocupações, Ministério do Trabalho e Emprego: https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/trabalhador/qualificacao-profissional/classificacao-brasileira-de-ocupacoes
- Buscar Emprego no SINE, serviço federal: https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine
- Cartilha de Segurança para Internet, CERT.br: https://cartilha.cert.br/fasciculos/

## Controles

- Teste automatizado exige 800 e 900 palavras, respectivamente, duas fontes externas por guia, trechos específicos e ausência de promessas de vagas, salário ou aprovação.
- Nenhuma vaga, empresa, salário, tarifa ou resultado de seleção foi inventado.
- Nenhuma data original de notícia foi alterada.
- Nenhum deploy, banco, DNS, webhook, Instagram, Direct ou pagamento foi tocado.
- A aprovação do AdSense permanece externa ao repositório e não foi declarada.
