# Importação de vagas

## Modelo

- XLSX em `apps/web/public/modelos/modelo-importacao-vagas.xlsx`
- CSV via `/api/admin/import-template.csv`
- Painel: `/admin/vagas/importar`

## Colunas mínimas

Obrigatórias: título, empresa, cidade, UF, descrição, ≥1 canal (`applicationUrl` / `applicationWhatsapp` / `applicationEmail`).

Recomendadas: sourceUrl/sourceName, expiresAt, modalidade, salário, requisitos, benefícios, bairro, categoria.

## Categorização automática

Regras determinísticas em `suggestCategory` + painel `/admin/classificacao` (`es_classification_rules`).

- Alta confiança: preenche  
- Média: preenche e mantém revisão  
- Baixa: não inventa categoria

## Bairro

`extractNeighborhood` só usa menção explícita (ou campo informado). Não infere pela cidade. Valida contra base local quando existir.

## Publicação

Importação entra como rascunho / revisão (`DRAFT`/`PENDING_REVIEW`/`NEEDS_REVIEW`). Combinação `PUBLISHED` + `NEEDS_REVIEW` é bloqueada (check SQL + `evaluateJobPublication`).
