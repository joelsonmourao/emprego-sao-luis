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
      setServerError(result.error ?? "Nao foi possivel entrar.");
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
        <CardTitle className="text-3xl text-white">Entrar no admin</CardTitle>
        <CardDescription className="max-w-xl text-sky-50/85">
          Acesse a area protegida para publicar vagas, blog e importar planilhas de forma segura.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 p-8">
        {/* Removidos os inputs fake que causavam o autofill */}
        <form className="space-y-5" onSubmit={onSubmit} autoComplete="off">
          
          <Field label="E-mail" htmlFor="admin-email">
            <Input
              id="admin-email"
              type="email"
              // Usando um valor que o navegador não reconhece para evitar preenchimento
              autoComplete="none" 
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
              spellCheck={false}
              placeholder="voce@empresa.com"
              {...register("email")}
            />
          </Field>
          {errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}

          <Field label="Senha" htmlFor="admin-password">
            <Input
              id="admin-password"
              type="password"
              // new-password impede o preenchimento de senhas EXISTENTES
              autoComplete="new-password"
              placeholder="Sua senha"
              {...register("password")}
            />
          </Field>
          {errors.password && <p className="text-sm text-rose-600">{errors.password.message}</p>}

          {serverError && (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{serverError}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar no painel"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}