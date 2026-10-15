# AdSense — aprofundamento editorial lote 8c (15/10/2026)

## Escopo e resultado

Este lote aprofunda oito guias já existentes no repositório, escolhidos por risco factual, caráter local ou direitos trabalhistas. Não houve criação de vaga, empresa, salário, data de seleção ou promessa. As páginas não constavam em `editorial-review-pending.ts`; por isso não foi alterado o estado de indexação.

| Guia | URL de produção | Antes | Depois | Fontes HTTPS | Novos eixos |
|---|---|---:|---:|---:|---|
| mapa-setores-vagas-sao-luis | https://empregossaoluis.com.br/blog/mapa-setores-vagas-sao-luis | 542 | 811 | 5 | coleta reproduzível de 14 dias; deduplicação; estoque x fluxo; decisão pessoal |
| follow-up-apos-entrevista-mensagem | https://empregossaoluis.com.br/blog/follow-up-apos-entrevista-mensagem | 543 | 813 | 3 | linha do tempo; decisões por resposta; limite de contato; privacidade |
| cursos-no-curriculo-sem-enchimento | https://empregossaoluis.com.br/blog/cursos-no-curriculo-sem-enchimento | 552 | 840 | 2 | matriz de seleção; curso interrompido/vencido; comprovação; teste do currículo |
| excel-basico-vagas-emprego | https://empregossaoluis.com.br/blog/excel-basico-vagas-emprego | 558 | 816 | 2 | validação; CSV; versões; exemplo sintético sem dados pessoais |
| vagas-estoque-logistica-sao-luis | https://empregossaoluis.com.br/blog/vagas-estoque-logistica-sao-luis | 559 | 828 | 2 | processos distintos; divergência; turno/deslocamento; entrevista |
| vagas-motorista-entregador-sao-luis | https://empregossaoluis.com.br/blog/vagas-motorista-entregador-sao-luis | 562 | 831 | 2 | enquadramentos distintos; exceções; custos; rota e turno |
| ponto-eletronico-atraso-trabalho | https://empregossaoluis.com.br/blog/ponto-eletronico-atraso-trabalho | 564 | 832 | 2 | sistema e comprovante; marcação x intervalo; correção; norma coletiva |
| fgts-consultar-trabalhador-clt | https://empregossaoluis.com.br/blog/fgts-consultar-trabalhador-clt | 565 | 869 | 4 | conciliação por competência; leitura incompleta; pedido verificável; segurança |

Total: **4.445 → 6.640 palavras (+2.195)**. Cada guia ficou acima de 740 palavras, com pelo menos duas URLs HTTPS distintas e data editorial `2026-10-15`.

## Fontes primárias e verificáveis

- Mapa de setores: Classificação Brasileira de Ocupações e estatísticas de trabalho do MTE; perfil municipal do IBGE.
- Follow-up: rastreador de vagas do LinkedIn e fascículos do CERT.br sobre autenticação, fraude e privacidade.
- Cursos: Europass e catálogo da Escola Virtual.Gov.
- Excel: Ajuda e Aprendizado do Microsoft Excel e orientação oficial de importação/exportação TXT/CSV.
- Estoque e logística: NR 11 e NR 17 do Ministério do Trabalho e Emprego.
- Motorista e entregador: consulta oficial da CNH no gov.br e Código de Trânsito Brasileiro compilado no Planalto.
- Ponto eletrônico: CLT compilada e Portaria MTP nº 671/2021 atualizada.
- FGTS: aplicativo, extrato e canais oficiais do FGTS.

## Controles automatizados

O teste `editorial-content-overrides.test.ts` foi ampliado com casos por URL para:

- data de revisão em 15/10/2026;
- mínimo de 740 palavras;
- no mínimo duas fontes HTTPS distintas;
- duas seções específicas por guia;
- ausência de promessas de vagas abertas, salário médio, contratação ou aprovação garantida.

As expectativas antigas de data foram atualizadas apenas para os três slugs deste lote que também pertencem a conjuntos anteriores.

## Imagens e publicação

Nenhuma imagem foi substituída. A auditoria anterior continua válida para estas capas WebP: não há comprovação binária suficiente de dimensões, peso, crédito e licença por URL. Nome de arquivo ou menção a Unsplash não foi tratado como licença. A pendência visual permanece registrada e não foi mascarada por alteração editorial.

Não houve deploy, alteração de banco, DNS, pagamentos, webhook, Instagram/Direct, `slz.empregossaoluis.com.br` ou outros projetos. O conteúdo público continuará mostrando a versão anterior até que um deploy do aplicativo correto seja autorizado e executado em outra etapa.

## Contador do programa

No recorte de 86 guias a aprofundar, 18 já tinham sido concluídos nos lotes anteriores do dia. Com estes 8, são **26 aprofundados e 60 ainda a aprofundar**. Esse contador mede profundidade editorial, não é sinônimo da lista técnica de `noindex`.
