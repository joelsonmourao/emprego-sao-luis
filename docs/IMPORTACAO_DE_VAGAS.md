# Importação de vagas (modelo SLZ)

## Modelo

- XLSX: `apps/web/public/modelos/modelo-importacao-vagas.xlsx` (abas `Vagas` + `Instruções`)
- CSV: `/api/admin/import-template.csv`
- Painel: `/admin/vagas/importar`

## Colunas (ordem oficial)

`id`, `titulo`, `empresa`, `descricao`, `localidade`, `cidade`, `uf`, `modalidade`, `quantidadeVagas`, `salario`, `dataPublicacao`, `dataEncerramento`, `fonteNome`, `fonteUrl`, `categoria`, `bairro`, `candidaturaUrl`, `candidaturaEmail`, `candidaturaWhatsApp`, `mensagemWhatsApp`, `instrucoesCandidatura`

Colunas extras na planilha são ignoráveis. Planilhas antigas (sem `id`, datas ISO) continuam válidas.

## Regras

| Campo | Regra |
|-------|--------|
| **id** | Opcional. Se preenchido, é o identificador externo (dedupe). Se vazio, gera `SLZ-…` interno estável. |
| **descricao** | HTML (JobPosting) ou texto. Markdown **não** é exigido. |
| **localidade** | Condicional: pode ficar vazia se `cidade` + `uf` estiverem preenchidos. |
| **modalidade** | Presencial \| Hibrido \| Remoto (case-insensitive) → `presencial` \| `hibrido` \| `remoto`. |
| **Datas** | Aceita `DD/MM/AAAA` e `AAAA-MM-DD` no fuso `America/Sao_Paulo`. No JobPosting (`datePosted` / `validThrough`) grava ISO 8601. `dataEncerramento` necessária para publicar/agendar. |
| **dataPublicacao** | No modo **Publicar/agendar por dataPublicacao**: data ≤ agora → `PUBLISHED`; futura → `SCHEDULED` (`scheduledAt`); vazia → `DRAFT`. Sem `dataEncerramento` futura → revisão. |
| **fonteNome** | Obrigatório (auditoria de origem). Não misturar com `candidaturaUrl`. |
| **categoria** | Opcional; sistema pode sugerir. |
| **bairro** | Opcional; **nunca** inventado. |
| **Canais** | ≥1 entre URL, e-mail ou WhatsApp. `mensagemWhatsApp` e `instrucoesCandidatura` opcionais (salvos como estão). |

## Deduplicação

1. `id` (+ fonte)  
2. `candidaturaUrl`  
3. `titulo` + `empresa` + `cidade` + `uf`

## Categorização e bairro

- `suggestCategory` + `/admin/classificacao`
- `extractNeighborhood` só com menção explícita ou coluna `bairro`

## Fluxo rápido no admin

1. Baixar modelo em `/admin/vagas/importar`
2. Preencher e enviar — cabeçalho oficial valida sozinho
3. Confirmar com **Usar dataPublicacao (publicar ou agendar)**

Empresa e cidade da planilha são **criadas automaticamente** se ainda não existirem.  
Nomes “Confidencial” usam a contratante não identificada.  
Categoria incompatível vira aviso + sugestão (não rejeita a linha).

## Publicação / JobPosting

Modo padrão de execução: `PUBLISH_BY_DATE`. Schema.org `JobPosting.description` usa HTML (`descriptionHtml`). Datas no schema saem em ISO 8601. Vagas `SCHEDULED` sobem quando o worker processa `scheduledAt`.
