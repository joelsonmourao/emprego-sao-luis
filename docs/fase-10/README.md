# Fase 10 — Testes, staging e lançamento

Foram adicionados CI, Lighthouse CI, Playwright, readiness real para PostgreSQL/Valkey, Sentry opcional, Dockerfiles separados e ambiente de staging local isolado. O lançamento em produção permanece bloqueado até restaurar backup em staging, executar migrations, validar dados/URLs e receber credenciais externas.

## Gates obrigatórios

```powershell
npm ci --legacy-peer-deps
npm run lint
npm run typecheck
npm run test
npm run migration:check
npm run build
npm run test:e2e
npm run lighthouse
```

Docker não pôde ser executado nesta máquina porque o daemon não estava disponível. Isso é uma pendência real, não um teste aprovado.

Na validação local, Playwright aprovou o endpoint de health e Lighthouse aprovou os gates de acessibilidade, boas práticas e SEO no build SSR. Compressão de texto ficou como aviso porque ela será aplicada pelo proxy/CDN no staging.
