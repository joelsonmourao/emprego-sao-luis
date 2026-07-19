# Matriz de implementação — Admin / negócio (Empregos São Luís)

Branch: `codex/admin-negocio-completo` · Base: `3414adb` + WIP local · Sem push/deploy
Princípio: **candidato sempre gratuito**.

Estados permitidos: `FUNCIONAL` | `PARCIAL` | `QUEBRADO` | `BLOQUEADO EXTERNAMENTE` | `NÃO APLICÁVEL`

Critério **FUNCIONAL**: menu + tela + API + banco + persistência + permissão + teste + validação visual autenticada.

| Requisito | Menu | Rota | API | Banco | Persistência | Permissão | Teste | Visual auth | Estado |
|-----------|------|------|-----|-------|--------------|-----------|-------|-------------|--------|
| Importação XLSX/CSV | Sim | `/admin/vagas/importar` | imports + templates | import_* | Sim | imports.manage | unit + e2e | OK | FUNCIONAL |
| Importação links/contatos | Sim | `/admin/vagas/importar-contatos` | `/api/admin/imports/contacts` | import_batches | Sim (prévia) | imports.manage | e2e visual | OK | FUNCIONAL |
| Revisão e aprovação | Sim | `/admin/vagas/revisao` | jobs bulk / approve-ready | jobs | Sim | jobs.publish | e2e visual | OK | PARCIAL |
| Multicanal site/WA/e-mail | Form vaga | nova/editar + `/vagas/[slug]` | jobs APIs | jobs 0024 | Sim | jobs.* | unit + e2e mutação | OK | FUNCIONAL |
| Classificação determinística | Sim | `/admin/classificacao` | rules API | classification_rules | Sim | content.manage | unit + seed | OK | FUNCIONAL |
| Bairro opcional com evidência | Form/import | vagas | jobs | neighborhood | Sim | jobs.* | unit location | OK | FUNCIONAL |
| Pilares e clusters | Sim | `/admin/conteudo/pilares` | content-pillars | pillars/clusters | CRUD básico | content.manage | visual + seed | OK | PARCIAL |
| Post Magnético | Sim | `/admin/conteudo/post-magnetico` + novo | articles | articles | criar/listar/score | content.manage | unit + visual | OK | PARCIAL |
| Rota da Aprovação | Sim | `/admin/adsense-readiness` | adsense-readiness | history | Sim | seo.manage | e2e + visual | OK | FUNCIONAL |
| Web Stories | Sim | `/admin/web-stories` + público | web-stories APIs | web_stories | CRUD | content.manage | e2e + visual | OK | FUNCIONAL |
| Planos / créditos / pedidos | Sim | `/admin/comercial/*` | commercial APIs | commercial_* | Sim | commercial.manage | visual + seed plano | OK | PARCIAL |
| Vagas patrocinadas | Sim | `/admin/vagas-patrocinadas` | jobs flags | jobs | Sim | commercial.manage | seed + visual | OK | FUNCIONAL |
| Perfis empresariais | Sim | `/admin/perfis-empresariais` | companies | companies | Sim | commercial.manage | visual | OK | FUNCIONAL |
| Publicidade / campanhas | Sim | `/admin/publicidade` (+ alias campanhas) | ads APIs | ads_* | Sim | commercial.manage | visual + seed | OK | PARCIAL |
| Conteúdo patrocinado | Sim | `/admin/conteudo-patrocinado` | articles | sponsored_content | Sim | content.manage | visual | OK | FUNCIONAL |
| AdSense ativo | — | — | — | flag false | — | — | audit | — | NÃO APLICÁVEL |
| Gateway pagamento real | Config | comercial/config | payment settings | — | — | settings | — | — | BLOQUEADO EXTERNAMENTE |
| Publisher AdSense real | — | readiness | — | — | — | — | — | — | BLOQUEADO EXTERNAMENTE |
| Gratuidade candidato | Transversal | públicas | — | sem paywall | — | — | shared + e2e | — | FUNCIONAL |
| Worker / automações | Sim | `/admin/automacoes-editoriais` + operacao | queues | indexing | Sim | queues.manage | visual | OK | PARCIAL |

## Rotas alias

| Alias | Canônica |
|-------|----------|
| `/admin/planos` | `/admin/comercial/planos` |
| `/admin/pedidos` | `/admin/comercial/pedidos` |
| `/admin/pagamentos` | `/admin/comercial/pagamentos` |
| `/admin/creditos` | `/admin/comercial/creditos` |
| `/admin/filas` / `/admin/jobs` | `/admin/operacao` |
| `/admin/campanhas` | `/admin/publicidade#campanhas` |

## Ainda PARCIAL (motivos objetivos)

- **Revisão:** fila e link para editar existem; aprovação em lote com UI de bloqueadores completa ainda limitada.
- **Pilares:** CRUD criar/ativar; ordenação drag-and-drop e lacunas avançadas incompletas.
- **Post Magnético:** lista + score + formulário em novo/editar; wizard completo de preview/bloqueadores em tela dedicada incompleto.
- **Comercial/publicidade:** operação real no painel; cobrança via gateway depende de credencial externa.
- **Automações:** hub + filas; automações avançadas dependem do worker em execução contínua.

## Gates (esta continuação)

| Comando | Resultado |
|---------|-----------|
| `npm test` | **252 passed** |
| `typecheck` | OK |
| `lint` | OK |
| `migration:check` | OK |
| `build` (@es/web) | OK |
| `db:audit-schema` | OK (65 tabelas, 0 issues) |
| `test:e2e` | **176 passed, 0 failed, 0 flaky, retries=0** |
| `audit:seo` | OK |
| `audit:critical-routes` | OK (adsense false) |
| Seed E2E fail-closed | OK (host 127.0.0.1:55432 / `empregos_staging`, `--write` idempotente) |
| Imagens / favicons | OK — ver `docs/IMAGE_ASSET_AUDIT.md` |
| Push / deploy / produção | **Não realizados** |
