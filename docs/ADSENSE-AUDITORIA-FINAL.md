# Auditoria final de preparação para o AdSense

Snapshot de 9 de agosto de 2026. Avaliação interna, sem garantia de aprovação pelo Google.

## Escopo e separação dos ambientes

Esta auditoria separa três fontes que não podem ser confundidas:

1. **produção pública atual** em `https://empregossaoluis.com.br`, validada por HTTP e navegação real;
2. **build local equivalente a produção**, executando o código desta branch com PostgreSQL, Valkey e storage prontos;
3. **banco E2E persistente**, com as 65 tabelas `es_*`, mas composto por fixtures de teste/staging criadas em julho de 2026.

O PostgreSQL configurado em `.env`/`.env.local` respondeu, porém é um banco legado com 23 tabelas de outro sistema e nenhuma tabela `es_*`. Ele não é o banco de produção do ES. Nenhuma URL de conexão, credencial ou segredo foi registrada neste documento.

## Produção pública verificada

| Medida                                     | Resultado | Evidência                                                                                   |
| ------------------------------------------ | --------: | ------------------------------------------------------------------------------------------- |
| URLs únicas nos sitemaps                   |       191 | Todas carregadas individualmente.                                                           |
| HTTP 200                                   |   191/191 | Nenhuma falha na varredura.                                                                 |
| Canonical ausente ou divergente            |         0 | Canonical conferido em cada URL.                                                            |
| JSON-LD inválido                           |         0 | Scripts estruturados parseáveis.                                                            |
| Artigos                                    |        97 | Todos com `Article`, metadata, H1 e mais de 150 palavras visíveis.                          |
| Notícias                                   |         5 | Todas com `NewsArticle`; nenhuma tinha menos de 48 horas na data da auditoria.              |
| Vagas                                      |        36 | Todas com `JobPosting`.                                                                     |
| URLs `noindex` ainda incluídas em sitemap  |        12 | 9 cidades e 3 categorias.                                                                   |
| Vagas com salário estruturado igual a zero |        20 | Propriedade artificial ainda publicada.                                                     |
| Vagas com rua/CEP placeholder              |        35 | Principal exemplo: “Não Informado”.                                                         |
| Página `/redacao`                          |       404 | O código local possui a rota, mas ela ainda não foi publicada.                              |
| `robots.txt`                               |       200 | Declara o sitemap e bloqueia a área administrativa.                                         |
| `ads.txt`                                  |       200 | Uma linha ativa em produção; o identificador não é reproduzido aqui.                        |
| Google News sitemap                        |    0 URLs | Resultado correto para as cinco notícias, publicadas cerca de 459 horas antes da auditoria. |

Os 191 endereços representam apenas URLs expostas pelos sitemaps públicos. Não incluem rascunhos, registros administrativos, URLs `noindex` fora de sitemap nem o corpus integral do banco.

## Build local equivalente a produção

| Medida                                              |                                       Resultado |
| --------------------------------------------------- | ----------------------------------------------: |
| Readiness                                           | `database`, `schema`, `redis` e `storage`: `ok` |
| URLs únicas nos sitemaps                            |                                              65 |
| Com HTTP 200 e indexáveis                           |                                           65/65 |
| `noindex` indevido em sitemap                       |                                               0 |
| Canonical ausente/divergente                        |                                               0 |
| JSON-LD inválido                                    |                                               0 |
| `Article` ausente nas URLs editoriais elegíveis     |                                               0 |
| `NewsArticle` ausente nas URLs de notícia elegíveis |                                               0 |
| Sitemap estático                                    |                                         18 URLs |
| Sitemap de blog                                     |                                         26 URLs |
| Sitemap de notícias                                 |                                         11 URLs |
| Sitemap de Web Stories                              |                                         10 URLs |
| Google News                                         |         3 fixtures dentro da janela de 48 horas |

O canonical passou a usar `SITE_URL` em runtime. Antes da correção, o valor de `Astro.site` gravado no build vazava a origem de build para as 65 páginas. Depois da correção, a recaptura encontrou zero divergências. URLs de imagem com `127.0.0.1:4321` observadas em 30 schemas pertencem aos dados persistidos das fixtures, não ao gerador estrutural.

## Teste do Modo de Revisão

O estado inicial do banco E2E não possuía a chave `adsense_review_mode`. O modo foi ativado temporariamente, validado e removido; ao final, o estado ausente original foi confirmado novamente.

- `/`, `/blog`, `/noticias`, `/redacao` e `/privacidade`: `index,follow`;
- conteúdo editorial fraco de fixture: `noindex,follow`;
- `/vagas`, busca, filtros, cidades, categorias e empresas: `noindex,follow`;
- sitemap durante o modo: 17 URLs e zero URL `noindex`;
- `robots.txt`: não bloqueou páginas públicas `noindex` nem recursos;
- HTML entregue a usuário comum e Googlebot: hash idêntico, sem cloaking;
- canonical: correto e sem parâmetros de consulta.

Nenhuma configuração real de produção foi alterada.

## Auditorias no banco de integração

Estes totais servem apenas para provar que o sistema percorre o corpus inteiro; **não são números de produção**.

| Auditoria                       | Resultado nas fixtures |
| ------------------------------- | ---------------------: |
| Tabelas `es_*`                  |                  65/65 |
| Artigos/notícias                |                     70 |
| Vagas                           |                     81 |
| Empresas                        |                     32 |
| Usuários                        |                      1 |
| Auditorias registradas          |                  1.048 |
| Editorial `NOINDEX`             |                      1 |
| Editorial `REVISAR MANUALMENTE` |                     69 |
| Conteúdo raso                   |                     16 |
| Órfãos                          |                     37 |
| Links quebrados editoriais      |                      0 |
| Pares similares                 |                    545 |
| Clusters                        |                      2 |
| Vagas completas                 |                     18 |
| Vagas incompletas               |                     63 |
| Vagas expiradas                 |                     52 |
| Vagas com algum problema        |                     81 |

Há marcadores explícitos de E2E/fixture/staging em todos os 81 registros de vagas e em parte do conteúdo editorial. Nenhuma classificação foi persistida como se fosse auditoria real.

## Correções implementadas nesta entrega

1. navegação administrativa reorganizada e responsiva;
2. dashboard com indicadores acionáveis e identificação de métrica interna;
3. Central AdSense com bloqueadores, checklist e inventário de URLs;
4. Modo de Revisão persistível, protegido por RBAC e auditável;
5. regras conservadoras de indexação e qualidade de entidades;
6. auditoria editorial integral, similaridade, clusters, repetição, fontes e utilidade local;
7. auditoria integral de vagas, validade, fonte, candidatura, salário, geografia e duplicidade;
8. supressão da Indexing API para vagas e Stories durante revisão;
9. canonical seguro calculado pela origem de runtime;
10. sitemaps, Google News, paginação, busca e filtros coerentes com `noindex`;
11. schemas `JobPosting`, `Article`, `NewsArticle`, `Organization` e `WebSite` sem propriedades inventadas pelo código;
12. home editorial, página da Redação e políticas institucionais reforçadas;
13. `robots.txt`, `ads.txt`, áreas privadas e recursos públicos revisados;
14. acesso móvel à Área da empresa restaurado no cabeçalho;
15. testes unitários, E2E, visuais e Lighthouse atualizados.

## Evidências finais de validação

- ESLint: aprovado com zero warning.
- TypeScript/Astro: 366 arquivos, zero erro, zero warning e 50 hints não bloqueantes.
- Vitest: 64 arquivos e 311 testes aprovados.
- Build: Astro SSR/Node standalone aprovado.
- Playwright: 165 testes enumerados; 46 executados e aprovados, zero falha e 119 ignorados por ausência de credenciais administrativas E2E.
- Readiness integrado: HTTP 200, com banco, schema, Valkey e storage em `ok`.
- Visual: sem overflow em 360/375/768/1024/1366/1440/1920; menus, `/redacao`, canonical e indexação conferidos.
- Lighthouse (execução anterior do Codex): 390×844 = 100/100/100/100; 768×1024 = 100/100/100/100; 1440×900 = Performance 93 e demais 100.
- Correções finais pós-interrupção: canonical rejeita path divergente e localhost; sitemap de vagas exclui CLOSED/INVALID/sem canal; inventário de cidades alinhado a MA; robots cobre `/admin` sem barra.
- `git diff --check`: aprovado; nenhum commit, push ou deploy faz parte desta execução.

## Bloqueadores reais para reenvio

1. o banco de produção com as 65 tabelas `es_*` não está acessível por uma conexão segura disponível no projeto; por isso, o corpus integral real não foi classificado nem teve o snapshot persistido;
2. as credenciais `E2E_ADMIN_EMAIL` e `E2E_ADMIN_PASSWORD` não estão disponíveis, deixando 119 testes administrativos/autenticados sem execução;
3. a produção pública continua na versão anterior, com `/redacao` em 404, 12 URLs `noindex` em sitemap e problemas estruturados nas vagas;
4. Publisher ID/conta AdSense, CMP, Search Console, dados jurídicos e identidade do controlador dependem de validação do proprietário nas contas externas.

## Decisão interna

**AINDA NÃO PRONTO PARA REENVIAR AO ADSENSE.** O código local e a infraestrutura de integração estão tecnicamente consistentes, mas a decisão editorial exige o corpus real, a cobertura autenticada ainda está incompleta e a versão pública não contém estas correções.
