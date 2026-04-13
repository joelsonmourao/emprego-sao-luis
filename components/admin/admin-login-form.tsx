"use client";

import { useState, useEffect } from "react";
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
  const [isLocked, setIsLocked] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { login_user: "", secret_key: "" }
  });

  // Pequeno delay para destravar os campos, confundindo scripts de preenchimento
  useEffect(() => {
    const timer = setTimeout(() => setIsLocked(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setServerError(result.error ?? "Acesso negado.");
      return;
    }
    router.push(nextPath as Route);
    router.refresh();
  });

  return (
    <Card className="overflow-hidden rounded-[2rem] border-slate-200 shadow-[0_35px_120px_-55px_rgba(14,116,144,0.45)]">
      <CardHeader className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_52%,#06b6d4_100%)] text-white p-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Portal de Gestão</CardTitle>
        <CardDescription className="text-white/70">Identifique-se para continuar</CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        {/* Adicionamos nomes aleatórios no form e autoComplete "new-password" que é mais forte que "off" */}
        <form className="space-y-6" onSubmit={onSubmit} noValidate autoComplete="new-password">
          
          {/* Inputs falsos para o Chrome preencher por engano */}
          <input type="text" name="prevent_autofill" style={{ display: 'none' }} tabIndex={-1} />
          <input type="password" name="password_fake" style={{ display: 'none' }} tabIndex={-1} />

          <Field label="Identificador">
            <Input
              {...register("login_user")}
              id="auth_user_field"
              name="login_user"
              type="text"            // Mudamos para text para evitar gatilhos
              readOnly={isLocked}
              onFocus={(e) => (e.target.readOnly = false)}
              autoComplete="off"
              placeholder="Digite seu e-mail ou usuário"
            />
          </Field>
          {errors.login_user && <p className="text-sm text-rose-600">{errors.login_user.message}</p>}

          <Field label="Chave de Acesso">
            <Input
              {...register("secret_key")}
              id="auth_pass_field"
              name="secret_key"
              type="password"
              readOnly={isLocked}
              onFocus={(e) => (e.target.readOnly = false)}
              autoComplete="new-password"
              placeholder="Digite sua senha secreta"
            />
          </Field>
          {errors.secret_key && <p className="text-sm text-rose-600">{errors.secret_key.message}</p>}

          {serverError && (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-100">
              {serverError}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full h-12 font-bold" disabled={isSubmitting}>
            {isSubmitting ? "Autenticando..." : "Entrar no Painel"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}