import { prisma } from "@/lib/db";

export default async function AdminAnunciosPage() {
  const submissions = await prisma.jobSubmission.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 100
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--brand-charcoal)]">Solicitações de anúncio de vaga</h1>
        <p className="mt-2 text-sm text-[var(--brand-text-secondary)]">Pedidos enviados pela página Anunciar Vaga.</p>
      </div>
      <div className="space-y-4">
        {submissions.length ? (
          submissions.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-[var(--brand-charcoal)]">{item.jobTitle}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{item.status}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--brand-text-secondary)]">
                {item.companyName} · {item.contactName} · {item.email} · {item.city} · {item.createdAt.toLocaleString("pt-BR")}
              </p>
              {item.phone ? <p className="mt-1 text-sm text-slate-600">Telefone: {item.phone}</p> : null}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.description}</p>
              {item.applyUrl ? (
                <p className="mt-2 text-sm">
                  Link:{" "}
                  <a href={item.applyUrl} target="_blank" rel="noreferrer" className="text-[var(--brand-brick)] hover:underline">
                    {item.applyUrl}
                  </a>
                </p>
              ) : null}
              {item.message ? <p className="mt-2 text-sm text-slate-600">{item.message}</p> : null}
            </article>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-sm text-[var(--brand-text-secondary)]">
            Nenhuma solicitação recebida ainda.
          </p>
        )}
      </div>
    </div>
  );
}
