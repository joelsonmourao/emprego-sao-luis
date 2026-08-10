# Fase 4 — Painel administrativo

Base implementada: login persistente no PostgreSQL, cookies HttpOnly/Secure/SameSite, sessão revogável, limitação de cinco tentativas por e-mail/IP em 15 minutos, carregamento server-side de papéis e permissões e proteção central por middleware.

O shell administrativo cobre os módulos exigidos. Operações específicas usam autorização no servidor; esconder botões não é considerado autorização. A segurança inclui 2FA TOTP com segredo criptografado por AES-256-GCM, confirmação antes da ativação, códigos de recuperação mostrados uma única vez e auditoria.

O dashboard consulta PostgreSQL em tempo real para vagas publicadas, itens aguardando revisão, lotes importados e tarefas com falha. Sem `DATABASE_URL`, permanece seguro com contadores zerados e não tenta acessar produção.

Os fluxos operacionais completos atualmente disponíveis são cadastro manual de vaga, importação, estúdio social e segurança da conta. Os demais módulos têm rota protegida e estrutura de banco, mas suas operações comerciais dependem da configuração e dos dados reais do ambiente.
