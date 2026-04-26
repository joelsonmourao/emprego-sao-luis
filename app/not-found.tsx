import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">404</p>
      <h1 className="text-4xl font-black tracking-tight text-slate-950">Página não encontrada</h1>
      <p className="text-lg leading-8 text-slate-600">
        A página solicitada não existe ou não está mais disponível. Continue a busca por vagas ativas nas páginas principais do portal.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Voltar para a home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/vagas">Ver vagas</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/vagas/estado/ce">Vagas por estado</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/vagas/cidade/fortaleza">Vagas por cidade</Link>
        </Button>
      </div>
    </section>
  );
}
