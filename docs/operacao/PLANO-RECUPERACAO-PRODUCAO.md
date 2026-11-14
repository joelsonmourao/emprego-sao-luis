# Plano de recuperação de produção — Empregos São Luís

## Escopo e bloqueio atual

Este plano cobre somente `empregossaoluis.com.br`, aplicação Coolify `s5dowl45t5bgfduiy1b5f3d8`, repositório `joelsonmourao/emprego-sao-luis`, branch `codex/admin-negocio-completo`.

Ficam expressamente fora do escopo: `webhook.empregossaoluis.com.br` (UUID `ir0ej2xf4a6c2pptnqzcv0ob`), Instagram/Direct, servidor legado `slz-portal`, bancos e volumes de outras aplicações.

**Estado em 09/10/2026:** deploy, migrations e alterações de dados continuam bloqueados. Não há evidência suficiente de backup restaurável, restauração isolada concluída nem rollback de código e dados validado.

## Conjunto mínimo de backup

Cada ponto de recuperação deve reunir, com o mesmo identificador e janela temporal:

1. **PostgreSQL:** dump lógico em formato custom, sem proprietário nem ACL, produzido com credencial de leitura mínima quando possível.
2. **Arquivos persistentes:** inventário dos mounts da aplicação e cópia consistente dos volumes realmente usados por uploads ou mídia.
3. **Manifesto da aplicação:** commit e digest da imagem em execução, branch, domínio, nomes das variáveis (nunca valores secretos), serviços, mounts e versões de runtime.
4. **Integridade:** SHA-256 de cada artefato e registro do tamanho, data/hora UTC e responsável.
5. **Destino externo:** armazenamento cifrado separado do VPS e do Coolify, com acesso restrito e retenção comprovável.

Sugestão inicial de retenção: 7 diários, 4 semanais, 12 mensais e um ponto adicional antes de qualquer mudança de produção. A retenção definitiva deve ser aprovada conforme capacidade, RPO e obrigações legais.

## Restauração isolada obrigatória

A prova deve ocorrer em recursos temporários sem domínio público, sem acesso aos dados de produção e sem rotinas de saída.

1. Provisionar PostgreSQL temporário vazio e armazenamento temporário separado.
2. Restaurar o dump sem apontar a aplicação para produção.
3. Restaurar arquivos persistentes no volume temporário correspondente.
4. Verificar a tabela de migrations, contagens por tabelas críticas, IDs, slugs e amostra de registros.
5. Validar checksums e abrir uma amostra de arquivos de mídia.
6. Subir a aplicação com workers, cron, webhooks, e-mail e integrações externas desativados.
7. Conferir autenticação administrativa, páginas públicas críticas, candidatura em modo de teste sem envio externo, `/robots.txt`, sitemap, canonical e healthcheck.
8. Registrar duração, falhas, correções e RTO/RPO efetivamente observados.
9. Destruir somente os recursos temporários após aprovação das evidências.

## Rollback de código e dados

- Guardar o digest da imagem anterior e o commit exato antes do deploy.
- Reverter código apenas para uma imagem já validada.
- Se houver escrita após o ponto de backup, não restaurar o dump antigo sem plano de reconciliação; isso perderia dados.
- Alterações de schema exigem estratégia compatível com rollback ou migração corretiva aditiva.
- Antes de qualquer restauração de dados, suspender gravações de forma controlada e preservar uma cópia forense do estado que falhou.
- Revalidar candidatura, autenticação, páginas públicas, sitemap, canonical e healthcheck antes de liberar tráfego.

## Evidências necessárias para liberar produção

| Evidência | Resultado exigido |
|---|---|
| Inventário de bancos e mounts | Caminhos e proprietários confirmados |
| Backup externo | URI interna/ID, data, tamanho e SHA-256 registrados |
| Restauração isolada | Concluída sem usar recursos de produção |
| Integridade PostgreSQL | Migrations e contagens críticas comparadas |
| Integridade de mídia | Contagem e amostra válidas |
| Teste funcional | Páginas, candidatura controlada e admin aprovados |
| RTO/RPO | Medidos e aceitos |
| Rollback de imagem | Digest anterior disponível e testado |
| Responsável e aprovação | Nomes e data registrados |

## Proibições até a liberação

- Não acionar deploy do Coolify.
- Não executar migrations, seeds, resets ou dados demo.
- Não alterar SQL, volumes ou mounts em produção.
- Não reutilizar credenciais do webhook ou de outras aplicações.
- Não registrar valores secretos neste repositório.

A conclusão documental deste plano não comprova backup nem autoriza deploy; somente as evidências acima, produzidas em teste isolado, removem o bloqueio.
