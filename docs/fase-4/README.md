# Fase 4 — Painel administrativo

Base implementada: login persistente no PostgreSQL, cookies HttpOnly/Secure/SameSite, JWT assinado, sessão revogável, limitação de cinco tentativas por e-mail/IP em 15 minutos, carregamento server-side de papéis e permissões e proteção central por middleware.

O shell administrativo cobre os módulos exigidos. Operações específicas devem usar `can(identity, permission)` no servidor; esconder botões não é considerado autorização. A criação do primeiro usuário e configuração de 2FA/passkey ainda precisam ser concluídas antes de considerar a Fase 4 encerrada.
