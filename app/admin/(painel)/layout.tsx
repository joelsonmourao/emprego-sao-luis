import type { ReactNode } from "react";

import { requireAdminSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <AdminShell
      title="Painel administrativo"
      description="Gerencie vagas, empresas, blog, conteudos do site e importacoes em um painel pronto para crescer com seguranca."
      userName={session.name}
      userRole={session.role}
    >
      {children}
    </AdminShell>
  );
}
