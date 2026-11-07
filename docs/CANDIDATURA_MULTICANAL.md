# Candidatura multicanal

## Canais

Uma vaga pode ter site (`applicationUrl`), WhatsApp e/ou e-mail — qualquer combinação com **ao menos um canal válido**.

Validação compartilhada: `packages/shared/src/application-channels.ts`.

## Comportamento público (`/vagas/[slug]`)

1. Bloco de candidatura **logo após o resumo** (antes de anúncios).  
2. Mesmo bloco **ao final da descrição**.  
3. WhatsApp: link `wa.me` com mensagem inicial.  
4. E-mail: primeiro clique **revela** o endereço; depois copiar; mailto é opcional.  
5. Sem login obrigatório no portal.  
6. Cliques/revelações registrados em `es_job_application_events` via `/api/jobs/application-click` (falha de analytics não bloqueia a candidatura).

## JobPosting

`directApply` só entra no JSON-LD quando explicitamente verdadeiro. Candidatura em plataforma externa **não** é marcada como apply direto do portal.

## Testes

Combinações cobertas em `application-channels.test.ts` e governança em `job-governance.test.ts`.
