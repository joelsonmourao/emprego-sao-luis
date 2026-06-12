import { prisma } from "@/lib/db";

export default async function AdminContatosPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 100
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--brand-charcoal)]">Mensagens de contato</h1>
        <p className="mt-2 text-sm text-[var(--brand-text-secondary)]">Formulários recebidos pela página de contato.</p>
      </div>
      <div className="space-y-4">
        {messages.length ? (
          messages.map((message) => (
            <article key={message.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-[var(--brand-charcoal)]">{message.subject}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{message.status}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--brand-text-secondary)]">
                {message.name} · {message.email} · {message.createdAt.toLocaleString("pt-BR")}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.message}</p>
            </article>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-sm text-[var(--brand-text-secondary)]">
            Nenhuma mensagem recebida ainda.
          </p>
        )}
      </div>
    </div>
  );
}
