/**
 * Usados por `prisma/seed` e `pnpm db:seed-admin` quando `ADMIN_LOGIN_USER` / `ADMIN_SECRET_KEY`
 * não estão definidos no ambiente. Para produção, prefira sempre variáveis (Coolify) e uma senha
 * própria; depois rode o seed-admin ou atualize via painel quando existir.
 */
export const ADMIN_BOOTSTRAP_EMAIL = "joelsonmouraob@gmail.com";

/** Mínimo 8 caracteres (schema de login); mistura símbolos e comprimento forte. */
export const ADMIN_BOOTSTRAP_PASSWORD = "Kv9#rM2$nP8@jL5!zW4*hQ7&cT6";
