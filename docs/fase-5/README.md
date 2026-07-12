# Fase 5 — Vagas manuais e planilhas

## Implementado neste incremento

- Schema Zod compartilhado para vaga manual.
- Formulário server-rendered com empresas, categorias, cidades e estados reais.
- Autorização `jobs.create` no servidor.
- Código público `ES-000001` gerado por sequence PostgreSQL concorrente.
- Hash de duplicidade, status inicial, fonte obrigatória e datas.
- Audit log na mesma transação da criação.

## Importação assíncrona

- Upload autenticado de XLSX/CSV com limite de 20 MB.
- Arquivo privado criptografado em R2/S3.
- Idempotência por SHA-256 do arquivo.
- BullMQ com cinco tentativas e backoff exponencial.
- Todas as abas, aliases de cabeçalho, validação Zod e erros por linha.
- Resolução de empresa/cidade/UF/categoria e detecção de duplicidade.
- Atualização por `externalId` + fonte e criação transacional.

## Ainda necessário para fechar a fase

Editor/preview/versionamento, transições completas, tela de mapeamento/dry run, download das rejeitadas, desfazer lote e testes integrados de 10/1.000 linhas contra PostgreSQL/Valkey/S3.
