"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message")
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Não foi possível enviar sua mensagem.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Erro ao enviar mensagem.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-6 text-sm leading-7 text-emerald-900">
        <p className="font-semibold">Mensagem recebida com sucesso.</p>
        <p className="mt-2">
          Sua mensagem foi registrada em nosso sistema. A equipe do Emprego São Luís retornará pelo e-mail informado quando possível.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--brand-charcoal)]">Nome</span>
          <input
            required
            name="name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2"
            placeholder="Seu nome"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold text-[var(--brand-charcoal)]">E-mail</span>
          <input
            required
            type="email"
            name="email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2"
            placeholder="seu@email.com"
          />
        </label>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-[var(--brand-charcoal)]">Assunto</span>
        <input
          required
          name="subject"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2"
          placeholder="Sobre o que você quer falar?"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-[var(--brand-charcoal)]">Mensagem</span>
        <textarea
          required
          name="message"
          rows={6}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[var(--brand-orange)] focus:ring-2"
          placeholder="Escreva sua mensagem com o máximo de detalhes possível."
        />
      </label>
      {status === "error" ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</p>
      ) : null}
      <Button type="submit" size="lg" disabled={status === "loading"} className="rounded-2xl bg-[var(--brand-brick)] hover:bg-[#65231f]">
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar mensagem"
        )}
      </Button>
    </form>
  );
}
