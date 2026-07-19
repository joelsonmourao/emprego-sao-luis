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

```powershell
npm run seed:adsense-editorial
# produção (após backup):
# $env:ADSENSE_EDITORIAL_ALLOW_PRODUCTION="1"
# npm run seed:adsense-editorial -- --write --i-understand-production
```

Worker precisa estar ativo para publicar `SCHEDULED`.

## Quando pedir AdSense

Só quando `/admin/adsense-readiness` mostrar **Pronto para solicitar análise** (45 substanciais + capas + institucionais sem placeholder + demais checks verdes). Depois: conta real → Publisher ID → `ads.txt` → só então `PUBLIC_ADSENSE_ENABLED=true`.
