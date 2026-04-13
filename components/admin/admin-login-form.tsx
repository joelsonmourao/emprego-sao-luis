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

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLocked(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const result = await response.json() as { ok: boolean; error?: string };
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
        <CardTitle className="text-2xl font-bold">Portal Administrativo</CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={onSubmit} noValidate autoComplete="new-password" title="login-area">
          
          {/* O Chrome vai focar nesses campos e preenchê-los, deixando os de baixo limpos */}
          <input type="text" name="chrome-trap-1" style={{ display: 'none' }} tabIndex={-1} />
          <input type="password" name="chrome-trap-2" style={{ display: 'none' }} tabIndex={-1} />

          <div className="flex flex-col gap-6">
            <Field label="Identificação do Usuário">
              <Input
                {...register("email")}
                type="text"
                autoComplete="off"
                readOnly={isLocked}
                onFocus={(e) => (e.target.readOnly = false)}
                placeholder="Insira seu identificador"
                className="bg-slate-50/50"
              />
            </Field>

            <Field label="Senha de Acesso">
              <Input
                {...register("password")}
                type="password"
                autoComplete="new-password"
                readOnly={isLocked}
                onFocus={(e) => (e.target.readOnly = false)}
                placeholder="••••••••"
                className="bg-slate-50/50"
              />
            </Field>

            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {serverError}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full h-12 text-base font-semibold" disabled={isSubmitting}>
              {isSubmitting ? "Verificando..." : "Entrar no Sistema"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}