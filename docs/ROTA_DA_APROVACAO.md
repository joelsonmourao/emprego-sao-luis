# Rota da Aprovação (AdSense)

Painel: `/admin/adsense-readiness`  
API de apoio: `/api/admin/adsense-readiness`

## Aviso obrigatório

**Esta verificação é interna e não garante aprovação pelo Google AdSense.**

## Etapas

| Etapa | Foco |
| --- | --- |
| 0 | Contenção (placeholders, hubs vazios indexáveis, vagas corrompidas) |
| 1 | Integridade técnica (robots, sitemaps filhos, mobile pendente) |
| 2 | Integridade editorial (autoria, fontes, páginas institucionais) |
| 3 | Conteúdo estruturado (pilares/clusters, raso, Web Stories) |
| 4 | Experiência do candidato (candidatura válida e gratuita) |
| 5 | Monetização segura (feature flag, ads.txt, publisher, distância da candidatura) |

## Status por item

`BLOQUEADOR` · `PENDENTE` · `EM_REVISÃO` · `APROVADO_INTERNAMENTE` · `NÃO_APLICÁVEL`

## Botão “Pronto para solicitar análise”

Só aparece quando não há bloqueadores P0 relevantes, institucionais estão completos, candidatura funciona e há **meta interna de 15 posts substanciais** (≥800 caracteres) com autoria, fontes e pilar/cluster. Mesmo assim o disclaimer permanece visível — **não garante** aprovação do Google.

Agenda automática: [ADSENSE_EDITORIAL_SCHEDULE.md](./ADSENSE_EDITORIAL_SCHEDULE.md).

## Evidências

Cada check inclui evidência textual, severidade, ação recomendada e indicação se há correção automática (hoje a maioria é manual/operacional).
