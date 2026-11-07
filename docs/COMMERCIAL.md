# Módulo comercial — Empregos São Luís

Domínio canônico: `https://empregossaoluis.com.br` (sem www).

## Migração

```bash
npm run db:migrate --workspace=@es/db
```

A migration `0018_commercial_company_seo` adiciona planos ampliados, pedidos, pagamentos, créditos, reembolsos, contas da empresa e auditoria SEO.

## Seeds

```bash
npm run db:seed-rbac --workspace=@es/db
npm run db:seed-commercial-plans --workspace=@es/db
```

- **RBAC:** inclui `payments.manage` e `payments.approve`.
- **Planos:** quatro planos estruturais idempotentes, desativados com `setupRequired: true` e preço `0` até configuração no painel.

## Painel administrativo

| Rota | Função |
|------|--------|
| `/admin/comercial/planos` | CRUD completo de planos |
| `/admin/comercial/pedidos` | Pedidos e linha do tempo |
| `/admin/comercial/pagamentos` | Pagamentos e aprovação manual |
| `/admin/comercial/creditos` | Créditos emitidos |
| `/admin/comercial/reembolsos` | Solicitações de reembolso |
| `/admin/comercial/configuracao-pagamento` | Pix manual (chave, QR, instruções) |
| `/admin/seo/auditoria` | Auditoria SEO por entidade |

## Checkout público (`/publicar-vaga`)

1. Apresentação → 2. Plano → 3. Cadastro empresa → 4. Resumo → 5. Pagamento → 6. Confirmação → 7. Créditos → 8. Vaga → 9. Revisão → 10. Publicação

### Gateway Mercado Pago

Variáveis apenas no ambiente (nunca no Git):

- `PAYMENT_PROVIDER=mercadopago`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET` (quando aplicável)

Webhook: `POST /api/payments/webhook` (idempotente).

### Fallback Pix manual

Habilitar em **Config. pagamentos** no painel. Pedido entra em `MANUAL_REVIEW` até aprovação com permissão `payments.approve`.

## Área da empresa

Rotas protegidas: `/empresa/login`, `/empresa/dashboard`, pedidos, pagamentos, créditos, vagas, perfil e suporte.

Fluxo: pagamento aprovado → crédito → cadastro da vaga → revisão administrativa → publicação.

## Redirect www

O middleware redireciona `www.empregossaoluis.com.br` → `empregossaoluis.com.br` (301, preserva path e query).

Configure também no Coolify/proxy para redundância.
