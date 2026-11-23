# Auditoria integral — Empregos São Luís — 12/10/2026

> **Escopo:** avaliação da versão pública em `empregossaoluis.com.br`; critérios editoriais são heurísticos, não diagnósticos oficiais ou garantia de aprovação AdSense.

## Inventário verificado

- **106 guias** encontrados nas nove páginas da listagem do blog e lidos por URL individual.
- **5 notícias** lidas individualmente; publicadas originalmente em 21/07/2026.
- **111 páginas editoriais** examinadas; relatórios por slug:
  - [Guias 1 a 55](./adsense-revisao-integral-parte-1.json)
  - [Guias 56 a 106](./adsense-revisao-integral-parte-2.json)
  - [Notícias](./adsense-noticias-revisao-20261012.json)

## Sinais encontrados nos 106 guias

| Item | Quantidade | Limitação |
|---|---:|---|
| Estruturas repetitivas em 2+ trechos | 94 | Indica necessidade de reescrever; não é parecer do Google |
| Menos de 350 palavras no texto extraído | 4 | Extensão sozinha não mede qualidade |
| Nenhum link externo identificado no conteúdo extraído | 106 | Orientações opinativas podem não precisar de fonte; afirmações legais exigem comprovação |
| Com uma capa associada | 106 | Não comprova copyright, dimensão ou pertinência da foto |
| Capa com URL exclusiva | 106 | Não garante originalidade visual |
| Capa no formato WebP | 106 | Dimensão real, peso e resposta HTTP ainda exigem teste binário |
| URL da capa contendo o slug correto | 106 | Não prova correspondência semântica da imagem ao artigo |
| Crédito/legenda não evidente nos primeiros 900 caracteres | 5 | Inspecionar integralmente antes de afirmar ausência |

**98 guias** têm ao menos um sinal crítico de repetição ou brevidade (94 + 4 fora desse grupo).

## Intervenções realizadas no código (aguardam testes/deploy)

1. **Dez guias específicos reescritos:** mensagem a recrutador, acompanhar candidatura, pesquisar empresa, seguro-desemprego, Carteira de Trabalho Digital, FGTS, leitura de contrato, currículo PDF, entrevista comportamental e primeiro emprego.
2. **Cinco notícias revisadas:** hotelaria, trabalho temporário, feriado/ponto facultativo, 13º e IR 2026. Removidas alegações implícitas de vaga atual sem fonte; incluídos links oficiais.
3. **Três guias já tinham sobrescritas editoriais** no projeto; total no código: **13 guias com revisão diferenciada**.
4. **Regra de qualidade por URL:** noindex temporário para os guias repetitivos ainda sem revisão individual, preservando páginas acessíveis e dados. O sitemap respeita a mesma decisão e inclui versões efetivamente reescritas.
5. **Imagens e UX:** capa principal com carregamento prioritário, decodificação assíncrona, preservação do enquadramento, dimensões de fallback e legenda apenas quando houver texto.
6. **Teste automatizado:** checa 106 URLs, 106 capas únicas, 98 sinalizações e correspondência entre metadados, sitemap e textos revisados.

## Pendente — condição para reanálise AdSense

- **86 guias** ainda precisam de reescrita substantiva, com informação diferenciada e exemplos específicos. A mera supressão da indexação não equivale a essa revisão.
- Checar **fontes oficiais por afirmação factual**, autoria, datas e licenças das fotografias; não criar números ou histórias falsos.
- Conferir respostas HTTP, **peso e dimensão binária** das 111 imagens em ambiente conectado, além de contraste e visualização mobile.
- Medir CWV com Lighthouse/PageSpeed e rever anúncios, cookies, navegação e páginas institucionais.
- Executar CI, publicar com segurança e verificar páginas, sitemap, robots/ads.txt e acesso dos subdomínios Instagram.
- Reavaliar a consistência do conteúdo por toda a navegação e **somente depois** solicitar análise do AdSense.

## Política de edição

Não realizar reescritas automáticas em massa, inventar fontes ou atualizar data de publicação sem novo texto editorial real. Conteúdos de baixa qualidade são preservados para revisão humana, sem apagamento. Nenhuma mudança deste conjunto toca o app Instagram/webhook, o banco, vagas ou DNS.
