# Procedimento de rollback

1. Interrompa novas escritas no web Astro e pare o worker.
2. Preserve logs, IDs dos jobs BullMQ, commit e imagem que falharam.
3. Se não houve escrita incompatível, direcione o proxy Coolify para a imagem anterior.
4. Se houve escrita, exporte o delta e reconcilie antes de restaurar; não sobrescreva registros silenciosamente.
5. Para falha de schema, prefira corrigir aditivamente. Restaure o dump somente após confirmar o impacto.
6. Reative o serviço anterior e valide `/`, `/vagas`, uma vaga, `/sitemap.xml`, `/api/health` e painel.
7. Reative apenas um worker e observe filas/retries.
8. Registre causa, período, dados afetados e ação corretiva.

O Next.js legado e a branch `main` permanecem disponíveis como rollback até a aceitação formal do Astro.
