# Antes de reenviar o site ao AdSense

Este procedimento é uma barreira interna de qualidade. Ele não garante aprovação e deve ser concluído no ambiente que contém o corpus real.

## Estado da barreira em 9 de agosto de 2026

| Item                      | Estado    | Evidência                                              |
| ------------------------- | --------- | ------------------------------------------------------ |
| Lint                      | Concluído | Zero warning.                                          |
| TypeScript/Astro          | Concluído | 366 arquivos, zero erro, 50 hints.                     |
| Vitest                    | Concluído | 311/311 aprovados.                                     |
| Build Astro SSR           | Concluído | Build Node standalone aprovado.                        |
| Playwright público/infra  | Concluído | 46 aprovados, zero falha.                              |
| Playwright administrativo | Bloqueado | 119 ignorados por falta de credenciais E2E.            |
| Readiness integrado       | Concluído | Banco, schema, Valkey e storage em `ok`.               |
| Visual público            | Concluído | 390×844, 768×1024 e 1440×900 sem overflow.             |
| Lighthouse                | Concluído | Mobile/tablet 100/100/100/100; desktop 93/100/100/100. |
| Corpus real               | Bloqueado | A conexão disponível não contém tabelas `es_*`.        |
| Produção publicada        | Pendente  | A versão pública ainda é anterior às correções.        |

## 1. Conectar somente ao banco real

- Disponibilize, por um canal seguro, o PostgreSQL que contém as 65 tabelas `es_*` e o corpus do ES.
- Execute `node --import tsx --env-file=<arquivo-seguro> packages/db/scripts/audit-schema.ts` sem registrar a URL do banco.
- Prossiga apenas com 65/65 tabelas e consultas administrativas sem estado de dados indisponíveis.
- Não use como produção o banco E2E: ele contém fixtures explícitas.

## 2. Completar a cobertura autenticada

- Forneça `E2E_ADMIN_EMAIL` e `E2E_ADMIN_PASSWORD` válidos para o ambiente de teste.
- Execute `E2E_EXPECT_READY=true npm run test:e2e`.
- Exija zero falha nos fluxos administrativos, CRUD, RBAC, Central AdSense e validação visual.
- Não redefina administrador, não faça seed e não altere credenciais de produção para satisfazer o teste.

## 3. Auditar todo o conteúdo

Em `/admin/qualidade-editorial`:

- revisar todos os clusters de similaridade;
- tratar `NOINDEX` e `REVISAR MANUALMENTE` com decisão humana;
- conferir autoria, fontes, metadata, imagens, links e utilidade local;
- não inventar fatos nem publicar textos em massa;
- persistir a classificação somente depois da revisão humana.

Atualize `docs/ADSENSE-CONTEUDO.md` com totais do corpus real.

## 4. Auditar todas as vagas

Em `/admin/qualidade-vagas`, revisar expiradas, incompletas, suspeitas, duplicadas, dados estruturados e links. Confirmar na fonte cada salário, localidade, validade e canal de candidatura.

Teste candidatura por URL, e-mail e WhatsApp quando disponíveis. O fluxo deve continuar gratuito para o candidato e sem anúncio cobrindo, confundindo ou imitando o CTA.

Atualize `docs/QUALIDADE-VAGAS.md` com totais do corpus real.

## 5. Validar institucionais e responsabilidade editorial

Abrir Sobre, Quem Somos, Contato, Privacidade, Termos, Cookies, LGPD, Política Editorial, Política de Fontes, Política de Correções, Redação e Segurança para Candidatos.

- confirmar acesso pelo rodapé;
- validar canal de contato, controlador de dados e informações jurídicas com o proprietário;
- não publicar placeholder em nenhum dado que só o proprietário conhece.

## 6. Conferir a integração publicitária

- confirmar o Publisher ID diretamente na conta oficial;
- conferir `/ads.txt`, domínio, formato e ausência de placeholder/duplicata;
- validar CMP, consentimento e política de anúncios aplicável ao público real;
- garantir que nenhum anúncio encubra navegação ou candidatura.

Publisher ID, conta AdSense, CMP e Search Console são ações humanas em serviços externos. Não registrar esses segredos nos relatórios.

## 7. Ativar o Modo de Revisão no ambiente correto

Na Central `/admin/adsense-readiness`, usar a ação protegida por `seo.manage`. Confirmar persistência e registro de auditoria. O teste local provou ativação e restauração, mas não alterou produção.

Com o modo ativo, conferir:

- `/`, `/blog`, `/noticias`, institucionais e editoriais aprovados: `index,follow`;
- vagas, busca, filtros, entidades fracas e paginações: `noindex,follow`;
- `robots.txt`: sem bloquear páginas públicas `noindex` ou recursos;
- sitemaps: zero URL `noindex`, expirada ou com canonical divergente;
- Google News: somente notícias elegíveis das últimas 48 horas;
- HTML de usuário e crawler idêntico, sem cloaking.

## 8. Publicar e repetir a validação pública

Após revisão humana e autorização separada para deploy:

- confirmar `/redacao` em HTTP 200;
- recapturar todas as URLs dos sitemaps e exigir zero `noindex` indevido;
- confirmar que salário zero e endereço placeholder desapareceram dos `JobPosting`;
- repetir canonical, JSON-LD, robots, sitemap, ads.txt, Google News e candidatura;
- repetir 390×844, 768×1024 e 1440×900;
- executar Lighthouse no domínio real.

## 9. Decisão e solicitação

Somente considerar `PRONTO PARA REVISÃO` quando:

- a Central estiver conectada ao corpus real;
- a auditoria integral estiver revisada e persistida;
- os 119 testes autenticados tiverem sido executados;
- a produção contiver as correções e não reproduzir os bloqueadores públicos;
- configurações externas e dados institucionais tiverem validação do proprietário.

Somente o responsável pela conta oficial deve solicitar a análise no AdSense. Registrar data, responsável, totais reais e evidências finais. A avaliação interna não garante aprovação pelo Google AdSense.
