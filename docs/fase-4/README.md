# Fase 4 — Painel administrativo

Base implementada: login persistente no PostgreSQL, cookies HttpOnly/Secure/SameSite, JWT assinado, sessão revogável, limitação de cinco tentativas por e-mail/IP em 15 minutos, carregamento server-side de papéis e permissões e proteção central por middleware.

O shell administrativo cobre os módulos exigidos. Operações específicas devem usar `can(identity, permission)` no servidor; esconder botões não é considerado autorização. Foi adicionado 2FA TOTP com segredo criptografado por AES-256-GCM, confirmação antes da ativação, códigos de recuperação mostrados uma única vez e auditoria.
