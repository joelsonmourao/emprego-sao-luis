import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">404</p>
      <h1 className="text-4xl font-black tracking-tight text-slate-950">Pagina nao encontrada</h1>
      <p className="text-lg leading-8 text-slate-600">Ela pode ter sido removida ou o endereco pode estar incorreto.</p>
      <Button asChild>
        <Link href="/">Voltar para a home</Link>
      </Button>
    </section>
  );
}
