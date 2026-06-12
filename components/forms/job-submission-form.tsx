"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function JobSubmissionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/anunciar-vaga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.get("companyName"),
          contactName: formData.get("contactName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          jobTitle: formData.get("jobTitle"),
          city: formData.get("city"),
          description: formData.get("description"),
          applyUrl: formData.get("applyUrl"),
          message: formData.get("message")
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Não foi possível enviar sua solicitação.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Erro ao enviar solicitação.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-6 text-sm leading-7 text-emerald-900">
        <p className="font-semibold">Solicitação recebida com sucesso.</p>
        <p className="mt-2">
          Recebemos os dados da vaga. A equipe do Emprego São Luís analisará as informações e entrará em contato pelo e-mail informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--brand-charcoal)]">Nome da empresa</span>
          <input required name="companyName" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--brand-charcoal)]">Nome do responsável</span>
          <input required name="contactName" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--brand-charcoal)]">E-mail</span>
          <input required type="email" name="email" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--brand-charcoal)]">Telefone/WhatsApp</span>
          <input name="phone" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--brand-charcoal)]">Título da vaga</span>
          <input required name="jobTitle" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--brand-charcoal)]">Cidade</span>
          <input required name="city" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2" placeholder="Ex.: São Luís" />
        </label>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-[var(--brand-charcoal)]">Descrição da vaga</span>
        <textarea required name="description" rows={6} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2" />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-[var(--brand-charcoal)]">Link de candidatura</span>
        <input type="url" name="applyUrl" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2" placeholder="https://" />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-[var(--brand-charcoal)]">Mensagem adicional</span>
        <textarea name="message" rows={4} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2" />
      </label>
      {status === "error" ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</p>
      ) : null}
      <Button type="submit" size="lg" disabled={status === "loading"} className="rounded-2xl bg-[var(--brand-orange)] text-white hover:bg-[#d97a12]">
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar solicitação"
        )}
      </Button>
    </form>
  );
}
