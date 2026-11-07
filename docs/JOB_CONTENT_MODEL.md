# Modelo de conteúdo de vagas

## Fonte canônica

`es_jobs.description_html` é a única fonte editorial da descrição de uma vaga. Formulário administrativo, importação, página pública e `JobPosting` leem e gravam esse campo. Não existe mais edição paralela de resumo, atividades, requisitos, benefícios ou informações adicionais.

`packages/shared/src/job-content.ts` concentra a sanitização textual, a consolidação na ordem original, a eliminação de blocos repetidos e o relatório usado na importação e na migration. `summary` é apenas uma derivação de compatibilidade para metadados.

As colunas legadas continuam no banco durante a transição para permitir rollback compatível, mas não são superfícies editoriais nem fontes de renderização.

## Migration e compatibilidade

A migration `0022_content_import_integrity.sql` cria e preenche `description_html`, torna a coluna obrigatória e registra `unidentified_company`. O backfill preserva a ordem descrição, resumo, atividades, requisitos, benefícios e informações adicionais, eliminando duplicações exatas.

## Empresa confidencial e contratante desconhecida

- `confidential_company=true`: uma empresa real permanece vinculada internamente, mas nome, slug, site e logotipo não aparecem no portal nem no schema.
- `unidentified_company=true`: a fonte não informa a contratante. A vaga usa o registro técnico inativo `Contratante não identificada na fonte`, é forçada como confidencial e não recebe organização inventada.

Nenhum dos dois estados é elegível a `JobPosting`. O painel mostra o diagnóstico antes da publicação.

## Importação

Cada planilha passa por análise `DRY_RUN`. A execução real só é liberada quando o lote está `COMPLETED`, com estágio `VALIDATED`, `analysisValid=true` e ao menos uma linha válida. O relatório contém a consolidação realizada por linha.

Um lote `FAILED` nunca é reutilizado: a repetição do mesmo conteúdo arquiva o anterior e cria novo ID, preservando erro, instante e `requestId`. SHA-256 identifica o conteúdo; nomes iguais com conteúdos diferentes continuam distintos.

## Verificação

- `packages/shared/src/job-content.test.ts`
- `packages/shared/src/job-draft.test.ts`
- `packages/seo/src/job-posting.test.ts`
- `tests/e2e/admin-crud-production.spec.ts`

