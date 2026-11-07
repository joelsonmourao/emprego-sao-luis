# Relatório de qualidade do conteúdo

Snapshot de 9 de agosto de 2026.

## O que foi realmente medido

Na produção pública, foram carregadas todas as 102 URLs editoriais expostas pelos sitemaps:

| Tipo     | URLs | HTTP 200 | Canonical correto | Schema esperado | Mais de 150 palavras |
| -------- | ---: | -------: | ----------------: | --------------: | -------------------: |
| Artigos  |   97 |       97 |                97 |    97 `Article` |                   97 |
| Notícias |    5 |        5 |                 5 | 5 `NewsArticle` |                    5 |

As cinco notícias foram publicadas em 21 de julho de 2026 e estavam fora da janela de 48 horas em 9 de agosto. Portanto, o sitemap Google News vazio em produção não é, isoladamente, um defeito.

Essa varredura valida a superfície técnica, não a originalidade, a apuração, as fontes, os rascunhos, as relações entre registros nem o conteúdo fora dos sitemaps.

## Limite do corpus real

O banco apontado por `.env`/`.env.local` é legado: responde, contém 23 tabelas de outro sistema e zero das 65 tabelas `es_*`. O banco E2E encontrado possui o schema completo, mas contém fixtures de teste/staging. Assim, não é possível publicar totais reais de `MANTER`, `MELHORAR`, `NOINDEX` e `REVISAR MANUALMENTE` sem inventar resultados.

## Prova integral no banco E2E

Os valores abaixo provam o funcionamento da auditoria sem amostragem; não descrevem produção:

| Medida                      | Fixtures E2E |
| --------------------------- | -----------: |
| Artigos/notícias analisados |           70 |
| `MANTER`                    |            0 |
| `MELHORAR`                  |            0 |
| `NOINDEX`                   |            1 |
| `REVISAR MANUALMENTE`       |           69 |
| Conteúdo raso               |           16 |
| Conteúdo desatualizado      |            0 |
| Órfãos                      |           37 |
| Links quebrados             |            0 |
| Canibalizações              |            1 |
| Sem governança editorial    |           56 |
| Pares similares             |          545 |
| Clusters                    |            2 |

Há 27 registros do tipo notícia e 43 editoriais nesse banco; todos os 27 registros de notícia foram classificados para revisão manual. Dezesseis conteúdos têm marcadores explícitos de E2E/fixture/staging. Nenhuma classificação foi persistida como resultado de produção.

## Riscos reais observáveis

- 97 artigos e 5 notícias tecnicamente indexáveis não bastam para demonstrar valor editorial único;
- o mesmo timestamp de publicação aparece nas cinco notícias públicas, o que pede conferência editorial do processo de publicação;
- produção ainda não possui `/redacao`, embora o código local já forneça autoria institucional, governança e links internos;
- similaridade, conteúdo importado/em escala e ausência de fontes só podem ser concluídos de forma responsável no banco real;
- automação deve auxiliar inventário, links e classificação, nunca publicar ou reescrever fatos automaticamente.

## Fluxo no ambiente real

1. disponibilizar uma conexão segura somente para o PostgreSQL real com `es_articles`, `es_authors`, `es_content_pillars` e `es_content_clusters`;
2. abrir `/admin/qualidade-editorial` e executar a consulta integral;
3. revisar manualmente fontes, autoria, similaridade, utilidade local, imagens, metadata e links;
4. persistir classificações apenas após a revisão humana;
5. atualizar este snapshot com os totais reais.

Nenhum artigo foi excluído, reescrito automaticamente ou preenchido com fatos inventados nesta execução.
