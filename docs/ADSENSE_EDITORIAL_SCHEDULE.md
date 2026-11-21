# Agenda editorial interna (AdSense) — meta ×3

**Aviso:** o Google **não** publica quantidade mínima oficial de posts. Números abaixo são **meta interna** do Empregos São Luís (benchmark de mercado ~15–30 artigos substanciais, aqui **triplicado** para margem de qualidade).

## O que o Google de fato exige (oficial)

- Conteúdo **original e de valor** (políticas AdSense)
- Site próprio, HTTPS, conformidade com políticas
- Páginas legais/institucionais (privacidade, contato, etc.)
- **Não** há número oficial de posts nem obrigação explícita de imagem de capa

## Meta interna ×3 (Rota da Aprovação)

| Item | Antes | Agora (×3) |
|------|-------|------------|
| Posts substanciais publicados | 15 | **45** |
| Caracteres úteis mínimos | 800 | **2400** |
| Seed: publicados agora | 6 | **18** |
| Seed: agendados (dias úteis) | 12 | **36** |
| Web Stories agendadas | 3 | **9** |
| Capa (URL + ALT + legenda + crédito) | recomendado | **obrigatório** para “Pronto” |

Imagens: o Google não lista “capa obrigatória”, mas capas genéricas sem crédito prejudicam a percepção de qualidade. Internamente exigimos capa creditada (seed usa `/brand/og-default.png` da marca).

## Seed

### Não rode no PowerShell do Windows com hostname Docker do Coolify

A `DATABASE_URL` do painel costuma ser `postgres://...@NOME_INTERNO:5432/...`. Esse host **só existe na rede Docker**. No PC aparece `DATABASE_URL inválida` / fail-closed / falha de conexão.

### Jeito certo em produção (Coolify Terminal)

1. Backup do PostgreSQL.
2. Coolify → app **web** (Emprego São Luís) → aba **Terminal**.
3. Cole (a `DATABASE_URL` já existe no container):

```sh
cd /app
export ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1
export SITE_URL=https://empregossaoluis.com.br
node scripts/seed-adsense-editorial-schedule.mjs
node scripts/seed-adsense-editorial-schedule.mjs --write --i-understand-production
```

Se o container web não tiver o script (imagem só runtime), use um **one-off** com `Dockerfile.migrate` / imagem que tenha o repo, ou rode no servidor via SSH na mesma rede Docker.

### Local E2E

```powershell
npm run seed:adsense-editorial
npm run seed:adsense-editorial -- --write
```

Worker precisa estar ativo para publicar `SCHEDULED`.

### Não use este seed para pedir AdSense

O pacote `adsense-editorial-*` é template (frases repetidas, capa compartilhada). A Rota da Aprovação **ignora** esses slugs e bloqueia se ainda estiverem `PUBLISHED`. Prefira posts reais no admin (Pilares → Post Magnético / Notícia) com **capa própria**.

### Despublicar o seed em produção (Terminal, uma vez)

O migrate **não** roda mais unpublish/seed editorial por env. No Terminal Coolify (container com o script + `DATABASE_URL`):

```sh
export ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1
node scripts/unpublish-adsense-editorial-seed.mjs --write --i-understand-production
```

Local:

```powershell
npm run unpublish:adsense-editorial
npm run unpublish:adsense-editorial -- --write
```

## Quando pedir AdSense

Só quando `/admin/adsense-readiness` mostrar **Pronto para solicitar análise** com posts **reais** (45 substanciais + capas exclusivas + institucionais sem placeholder + demais checks verdes). “Pronto” interno **não** é aprovação do Google. Depois: conta real → Publisher ID → `ads.txt` → só então `PUBLIC_ADSENSE_ENABLED=true`.
