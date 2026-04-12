"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";

import { adminLoginSchema, type AdminLoginValues } from "@/lib/schemas/admin-auth";
import { Field, Input } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setServerError(result.error ?? "Não foi possível entrar.");
      return;
    }

    router.push(nextPath as Route);
    router.refresh();
  });

  return (
    <Card className="overflow-hidden rounded-[2rem] border-slate-200 shadow-[0_35px_120px_-55px_rgba(14,116,144,0.45)]">
      <CardHeader className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_52%,#06b6d4_100%)] text-white">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/14">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-3xl text-white">Painel de Acesso</CardTitle>
        <CardDescription className="max-w-xl text-sky-50/85">
          Área restrita para gestão do portal. Identifique-se para continuar.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        {/* Usamos noValidate para evitar que o navegador interfira na validação nativa */}
        <form className="space-y-6" onSubmit={onSubmit} noValidate autoComplete="off">
          
          <Field label="Identificação" htmlFor="user-access-id">
            <Input
              id="user-access-id" // ID genérico para evitar o preenchimento automático
              type="email"
              autoComplete="one-time-code" // Engana o gerenciador de senhas do Chrome
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
              spellCheck={false}
              placeholder="seu-email@dominio.com"
              {...register("email")}
            />
          </Field>
          {errors.email && (
            <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
          )}

          <Field label="Chave de Segurança" htmlFor="user-key-id">
            <Input
              id="user-key-id" // ID genérico para que o navegador não associe à senha salva
              type="password"
              autoComplete="new-password" // Indica ao navegador que não deve sugerir senhas antigas
              placeholder="Digite sua chave"
              {...register("password")}
            />
          </Field>
          {errors.password && (
            <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>
          )}

          {serverError && (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-100">
              {serverError}
            </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 text-base font-bold shadow-lg shadow-blue-500/20" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Autenticando..." : "Entrar no Sistema"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}