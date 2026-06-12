import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { LayoutDashboard, BriefcaseBusiness, Newspaper, FileSpreadsheet, Home, Settings2, MapPinned, ImagePlus, Network, Building2, ClipboardList, LineChart, ChartNoAxesCombined, Megaphone, CalendarClock, Mail, Tags } from "lucide-react";
import type { AdminRole } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

const navItems: Array<{ href: Route; label: string; icon: typeof LayoutDashboard; minRole: AdminRole }> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, minRole: "EDITOR" },
  { href: "/admin/vagas", label: "Vagas", icon: BriefcaseBusiness, minRole: "EDITOR" },
  { href: "/admin/empresas", label: "Empresas", icon: Building2, minRole: "EDITOR" },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, minRole: "EDITOR" },
  { href: "/admin/importar", label: "Importar planilha", icon: FileSpreadsheet, minRole: "EDITOR" },
  { href: "/admin/categorias", label: "Categorias", icon: Tags, minRole: "EDITOR" },
  { href: "/admin/contatos", label: "Contatos", icon: Mail, minRole: "EDITOR" },
  { href: "/admin/anuncios", label: "Anuncios de vaga", icon: Megaphone, minRole: "EDITOR" },
  { href: "/admin/divulgacoes-agendadas", label: "Divulgacoes agendadas", icon: CalendarClock, minRole: "EDITOR" },
  { href: "/admin/indexacao", label: "Indexacao", icon: LineChart, minRole: "EDITOR" },
  { href: "/admin/analytics", label: "Analytics", icon: ChartNoAxesCombined, minRole: "EDITOR" },
  { href: "/admin/configuracoes", label: "Configuracoes", icon: Settings2, minRole: "ADMIN" },
  { href: "/admin/site", label: "Conteudo do site", icon: Settings2, minRole: "ADMIN" },
  { href: "/admin/integracoes", label: "Integracoes", icon: Settings2, minRole: "ADMIN" },
  { href: "/admin/propagandas", label: "Propagandas", icon: Megaphone, minRole: "ADMIN" },
  { href: "/admin/publicacao", label: "Publicacao", icon: Home, minRole: "ADMIN" },
  { href: "/admin/estrutura", label: "Estrutura", icon: Network, minRole: "ADMIN" },
  { href: "/admin/hubs", label: "Hubs", icon: MapPinned, minRole: "ADMIN" },
  { href: "/admin/midia", label: "Midia", icon: ImagePlus, minRole: "EDITOR" },
  { href: "/admin/logs", label: "Logs", icon: ClipboardList, minRole: "ADMIN" }
];

const roleOrder: Record<AdminRole, number> = {
  EDITOR: 1,
  ADMIN: 2
};

export function AdminShell({
  title,
  description,
  userName,
  userRole,
  children
}: {
  title: string;
  description: string;
  userName: string;
  userRole: AdminRole;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(242,140,27,0.06),transparent_26%),radial-gradient(circle_at_right_top,_rgba(123,44,40,0.05),transparent_24%),linear-gradient(180deg,#faf8f4_0%,#f5f2eb_52%,#faf8f4_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-5">
          <Card className="rounded-[2rem] border-slate-200 bg-[linear-gradient(160deg,#1f2b24_0%,#243328_56%,#1a1a1a_100%)] p-6 text-white shadow-[0_35px_120px_-45px_rgba(26,26,26,0.5)]">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-100">Admin</p>
              <h1 className="text-2xl font-black tracking-tight">Emprego São Luís</h1>
              <p className="text-sm leading-6 text-white/78">Painel para vagas, empresas, blog, categorias, contatos e importação de planilhas.</p>
            </div>

            <nav className="mt-6 grid gap-2">
              {navItems.filter((item) => roleOrder[userRole] >= roleOrder[item.minRole]).map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white transition hover:border-[color:rgba(255,109,0,0.34)] hover:bg-white/12"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 grid gap-3">
              <Button asChild variant="secondary">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Ver site publico
                </Link>
              </Button>
              <AdminLogoutButton />
            </div>
          </Card>
        </aside>

        <main className="space-y-6">
          <Card className="brand-admin-panel rounded-[2rem] border-slate-200 bg-white/92 p-6 shadow-[0_30px_120px_-55px_rgba(26,43,76,0.18)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Gestao segura</p>
                <h2 className="text-3xl font-black tracking-tight text-[var(--brand-navy)]">{title}</h2>
                <p className="max-w-3xl text-sm leading-6 text-[var(--brand-text-secondary)]">{description}</p>
              </div>
              <div className="rounded-2xl border border-[color:rgba(26,43,76,0.1)] bg-[var(--brand-soft)] px-4 py-3 text-sm text-[var(--brand-text-secondary)]">
                Logado como <span className="font-semibold text-[var(--brand-navy)]">{userName}</span> ·{" "}
                <span className="font-semibold text-[var(--brand-orange)]">{userRole}</span>
              </div>
            </div>
          </Card>
          {children}
        </main>
      </div>
    </div>
  );
}
