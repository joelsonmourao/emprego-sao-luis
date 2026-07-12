# Fase 5 — Vagas manuais e planilhas

## Implementado neste incremento

- Schema Zod compartilhado para vaga manual.
- Formulário server-rendered com empresas, categorias, cidades e estados reais.
- Autorização `jobs.create` no servidor.
- Código público `ES-000001` gerado por sequence PostgreSQL concorrente.
- Hash de duplicidade, status inicial, fonte obrigatória e datas.
- Audit log na mesma transação da criação.

## Ainda necessário para fechar a fase

Editor/preview/versionamento, transições completas de revisão/publicação, importação XLSX/CSV via BullMQ, dry run, mapeamento, rejeitadas, desfazer lote e testes de 10/1.000 linhas e idempotência.
