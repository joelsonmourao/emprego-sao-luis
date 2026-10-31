# Planos de backup, migração, staging e rollback

## Backup antes de acessar produção

1. Registrar commit, imagem/container, variáveis por nome e versões dos serviços, sem copiar segredos para o repositório.
2. Pausar apenas operações de escrita no momento da captura consistente, se necessário.
3. Executar `pg_dump` em formato custom e também exportar schema; calcular SHA-256.
4. Inventariar buckets/volumes e copiar mídias preservando chaves, metadados e checksums.
5. Exportar lista de URLs do sitemap, redirects, configurações e contagens por tabela.
6. Criptografar e enviar cópia para destino externo; manter ao menos uma cópia fora do Coolify.
7. Restaurar o dump em PostgreSQL isolado e executar consultas de contagem e integridade.
8. Registrar horário, responsável, origem, destino, checksum e resultado do teste.

Nenhum backup real foi executado na Fase 0 porque credenciais de produção não foram fornecidas.

## Migração

1. Criar workspace Astro/Drizzle paralela sem modificar o legado.
2. Criar schema Drizzle aditivo e migrations versionadas.
3. Usar banco de staging restaurado do dump, nunca produção como ambiente de desenvolvimento.
4. Migrar dados por script idempotente, mantendo IDs, slugs e timestamps.
5. Registrar checkpoints, erros por registro e contagens.
6. Executar validações de integridade e comparação de URLs.
7. Fazer ensaio completo, medir duração e documentar correções.
8. No corte, congelar escritas brevemente ou aplicar sincronização delta; executar validação final antes do DNS/proxy.

## Staging

- Recursos separados: `empregos-sl-web-staging`, `empregos-sl-worker-staging`, PostgreSQL e Valkey exclusivos.
- Bucket/prefixo exclusivo de staging.
- Domínio de staging protegido por autenticação e `X-Robots-Tag: noindex, nofollow`.
- Segredos definidos no Coolify, nunca em arquivos versionados.
- Migration como job único antes de web/worker; não executar migration concorrente no start de todas as réplicas.
- Health verifica processo; readiness verifica PostgreSQL, Redis e configurações essenciais.
- Executar lint, typecheck, Vitest, Playwright, build, Lighthouse, acessibilidade, carga de importação e restauração de backup.
- Aprovação funcional e comparação de URLs antes do corte.

## Rollback

- Manter a imagem Next.js atual e seu banco sem alterações destrutivas.
- Usar migrations aditivas; novos consumidores não devem exigir remoção imediata de colunas antigas.
- Registrar imagem, commit e migration aplicados em cada deploy.
- Se a nova aplicação falhar antes de novas escritas: restaurar proxy/imagem legada.
- Se houver novas escritas: parar web/worker novos, exportar delta, reconciliar ou restaurar snapshot conforme runbook; nunca sobrescrever silenciosamente.
- Reverter domínio/proxy para o serviço anterior, validar home, vaga, sitemap e painel.
- Abrir incidente e preservar logs antes de nova tentativa.

## Riscos e controles

| Risco | Controle |
|---|---|
| Perda de SEO | inventário live, redirects individuais, canonical e comparação de sitemaps |
| Perda de dados | dump testado, migração idempotente, contagens e checksums |
| Datas alteradas | inserção explícita de timestamps e validação UTC |
| Dupla publicação | chave idempotente e apenas um worker ativo no corte |
| Migration concorrente | job exclusivo com advisory lock |
| Segredo em Git | `.gitignore`, varredura e variáveis do Coolify |
| Dependência externa indisponível | filas, retry, circuit breaker e fallback manual |
| Rollback incompatível | schema aditivo e período de compatibilidade |
