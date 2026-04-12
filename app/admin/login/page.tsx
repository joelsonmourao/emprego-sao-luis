import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getAdminSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Login do admin | Jovem Aprendiz Vagas",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,#f5f9ff_0%,#eff6ff_54%,#f8fbff_100%)] px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center space-y-6">
          <p className="inline-flex w-fit rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
            Area protegida
          </p>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-5xl font-black tracking-tight text-slate-950">
              Painel administrativo do portal Jovem Aprendiz Vagas
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Entre para cadastrar vagas, atualizar o blog, importar planilhas e cuidar do portal em um so lugar.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5">
              <p className="text-sm font-semibold text-slate-950">CRUD real</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Crie, edite, publique e remova vagas e posts sem sair do painel.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5">
              <p className="text-sm font-semibold text-slate-950">Importacao em lote</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Envie planilhas, revise os dados e traga varias vagas de uma vez com mais seguranca.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5">
              <p className="text-sm font-semibold text-slate-950">Rotas seguras</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Acesso restrito para quem esta logado, com a area administrativa separada do site publico.
              </p>
            </div>
          </div>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}