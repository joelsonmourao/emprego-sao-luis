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
  
  // Estado para controlar o tipo do campo de senha dinamicamente
  const [passType, setPassType] = useState<"text" | "password">("text");
  const [isReady, setIsReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" }
  });

  useEffect(() => {
    setIsReady(true);
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

  if (!isReady) return null;

  return (
    <Card className="overflow-hidden rounded-[2rem] border-slate-200 shadow-[0_35px_120px_-55px_rgba(14,116,144,0.45)]">
      <CardHeader className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_52%,#06b6d4_100%)] text-white">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/14">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-3xl text-white">Acesso Restrito</CardTitle>
        <CardDescription className="max-w-xl text-sky-50/85">
          Área de gestão do portal. Digite suas credenciais.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        {/* Desativando autocomplete em todos os níveis possíveis */}
        <form className="space-y-6" onSubmit={onSubmit} noValidate autoComplete="off">
          
          {/* Honeypots: Inputs falsos para o Chrome preencher e nos deixar em paz */}
          <div style={{ opacity: 0, position: 'absolute', height: 0, zIndex: -1 }}>
            <input type="text" name="email" tabIndex={-1} />
            <input type="password" name="password" tabIndex={-1} />
          </div>

          <Field label="Identificação">
            <Input
              {...register("email")}
              id="user_internal_id"
              type="text" // Usamos text para o e-mail também
              autoComplete="off"
              inputMode="email"
              placeholder="E-mail cadastrado"
            />
          </Field>
          {errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}

          <Field label="Chave de Segurança">
            <Input
              {...register("password")}
              id="pass_internal_id"
              type={passType}
              onFocus={() => setPassType("password")} // Só vira password quando clica
              autoComplete="new-password"
              placeholder="Sua senha secreta"
            />
          </Field>
          {errors.password && <p className="text-sm text-rose-600">{errors.password.message}</p>}

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