# AdSense — aprofundamento editorial lote 8k (15/10/2026)

## Escopo

Este lote aprofunda individualmente os onze membros que ainda faltavam no conjunto-base de 86 guias. Os textos anteriores foram lidos por inteiro e preservados onde já estavam corretos; o acréscimo se concentra em decisões auditáveis, exemplos delimitados, diferenças entre canais, proteção de dados e limites explícitos.

| Slug | Antes | Depois | Fontes HTTPS | Novas verificações |
|---|---:|---:|---:|---|
| `portfolio-simples-candidato-emprego` | 570 | 877 | 3 | ficha de prova, versões por função e portão de privacidade |
| `emprego-apos-40-anos-curriculo` | 596 | 915 | 3 | mapa de evidências, atualização de 30 dias e consistência histórica |
| `agradecimento-pos-entrevista-mensagem` | 604 | 887 | 2 | mensagem por etapa, teste de consequência e retenção necessária |
| `carta-apresentacao-emprego-curta` | 616 | 899 | 2 | banco de evidências, leitura em 90 segundos e transição de carreira |
| `home-office-remoto-checklist-vaga` | 757 | 1.037 | 4 | matriz de custo, ensaio integral e auditoria da primeira semana |
| `como-usar-empregos-sao-luis` | 593 | 880 | 2 | trilha de cinco confirmações, sessão de 20 minutos e relato factual |
| `dinamica-de-grupo-entrevista-dicas` | 591 | 845 | 2 | rotação de contribuição, acessibilidade e ficha pós-dinâmica |
| `email-candidatura-emprego-modelo` | 585 | 891 | 2 | conferência em duas camadas, modelos por situação e correção única |
| `comparar-beneficios-vaga-emprego` | 606 | 892 | 2 | valores garantidos/condicionados, uso local e assistência médica |
| `curriculo-ats-palavras-chave-sao-luis` | 604 | 885 | 2 | inventário de evidência, leitura do arquivo e adaptação ao canal |
| `candidatura-whatsapp-emprego-mensagem` | 615 | 944 | 3 | mensagem auditável, classificação de pedidos e reconciliação de etapa |
| **Total** | **6.737** | **9.952** | — | — |

Acréscimo líquido: **3.215 palavras**. O teste automatizado exige `reviewedAt: 2026-10-15`, extensão mínima específica, duas seções exclusivas por URL, duas fontes HTTPS distintas e ausência de alegações como vaga aberta, salário médio ou contratação garantida.

## Fontes e limites

- LGPD, ANPD e CERT.br: necessidade, finalidade, direitos do titular, verificação de canal e prevenção de fraude;
- CBO e Inspeção do Trabalho: linguagem ocupacional e combate à discriminação por idade, sem transformar classificação em experiência;
- Lei nº 9.029/1995 e Lei Brasileira de Inclusão: acesso ao trabalho sem discriminação e pedido operacional de acessibilidade;
- CLT, NR-17 e Sistema Mediador: teletrabalho, equipamento, ergonomia e instrumento coletivo;
- Sine: fonte oficial adicional de busca, sem validar anúncios de terceiros;
- Lei do Vale-Transporte e ANS: finalidade do transporte e perguntas concretas sobre assistência médica;
- Europass: estrutura de currículo e carta, usado como referência editorial, não como exigência local.

Os guias não garantem entrevista, contratação ou leitura por um sistema específico. Não afirmam que silêncio de recrutador seja fraude, que todo benefício tenha valor monetário equivalente nem que uma palavra-chave determine aprovação.

## Imagens

As onze capas são arquivos WebP reais de **1200 × 630 pixels**, legíveis e diretamente relacionadas aos temas. A inspeção visual confirmou ausência de corte do título e ícones coerentes com portfólio, carreira 40+, entrevista, carta, trabalho remoto, portal, dinâmica, e-mail, benefícios, ATS e WhatsApp.

| Slug | Bytes |
|---|---:|
| `portfolio-simples-candidato-emprego` | 20.546 |
| `emprego-apos-40-anos-curriculo` | 27.456 |
| `agradecimento-pos-entrevista-mensagem` | 22.502 |
| `carta-apresentacao-emprego-curta` | 27.378 |
| `home-office-remoto-checklist-vaga` | 22.608 |
| `como-usar-empregos-sao-luis` | 21.568 |
| `dinamica-de-grupo-entrevista-dicas` | 25.976 |
| `email-candidatura-emprego-modelo` | 25.000 |
| `comparar-beneficios-vaga-emprego` | 21.950 |
| `curriculo-ats-palavras-chave-sao-luis` | 20.858 |
| `candidatura-whatsapp-emprego-mensagem` | 20.496 |

O `credits.json` registra as onze como criação editorial original, com `source: original`, `licenseStatus: owned`, base de licença declarada, crédito, legenda e texto alternativo. Nenhuma licença foi presumida por nome de arquivo ou menção a banco de imagens.

## Fechamento do conjunto-base

O lote 8j reconstruiu o contador a partir dos relatórios de 12/10 e identificou o conjunto-base correto de 86. Naquele momento, 75 estavam aprofundados e estes onze eram os membros restantes. Todos os onze agora possuem revisão específica de 15/10/2026 e teste automatizado por URL.

Contador após este lote: **86/86 guias aprofundados; zero pendentes dentro do conjunto-base**.

Esse número significa conclusão editorial do recorte original. Não significa publicação em produção, indexação, aprovação do Google ou deferimento do AdSense. A solicitação de revisão ao AdSense só deve ser considerada depois de merge verde, deploy controlado, confirmação pública das páginas, sitemap, canonical, `ads.txt`, navegação, políticas, autoria e desempenho móvel.

Mundo do Aprendiz e Vagas RJ não receberam alterações neste lote. Webhook, subdomínio SLZ, banco de vagas, pagamentos, Instagram/Direct e DNS permanecem fora do escopo e protegidos.

## Validação concluída

Gates executados:

- `npm run recovery:evidence:check`;
- `npm run lint`;
- `npm run typecheck`;
- `TZ=America/Sao_Paulo npm run test -- --reporter=dot`;
- `npm run migration:check`;
- `npm run build`.

Todos os gates locais passaram. A suíte terminou com **93 arquivos de teste aprovados e 1 ignorado; 450 testes aprovados e 4 ignorados**. O primeiro lint detectou somente uma barra de escape redundante no teste novo; a expressão foi corrigida e lint, tipos, testes, migração e build foram repetidos com sucesso. O `astro check` permaneceu com cinco sugestões já existentes e sem erro.
