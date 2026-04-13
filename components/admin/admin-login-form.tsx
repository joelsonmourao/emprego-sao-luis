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
    defaultValues: { email: "", password: "" }
  });

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
      <CardHeader className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_52%,#06b6d4_100%)] text-white">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/14">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-3xl text-white">Painel</CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <form className="space-y-6" onSubmit={onSubmit} noValidate autoComplete="off">
          
          {/* Honeypots alterados para nomes genéricos */}
          <div style={{ opacity: 0, position: 'absolute', height: 0, zIndex: -1 }}>
            <input type="text" name="field_abc_123" tabIndex={-1} />
            <input type="password" name="field_xyz_789" tabIndex={-1} />
          </div>

          <Field label="Acesso">
            <Input
              {...register("email")}
              id="id_unique_user"
              name="not_an_email"
              type="text"
              readOnly={isLocked}
              onFocus={(e) => (e.target.readOnly = false)}
              autoComplete="off"
              placeholder="Identificador"
            />
          </Field>

          <Field label="Chave">
            <Input
              {...register("password")}
              id="id_unique_pass"
              name="not_a_password"
              type="password"
              readOnly={isLocked}
              onFocus={(e) => (e.target.readOnly = false)}
              autoComplete="new-password"
              placeholder="Código de acesso"
            />
          </Field>

          {serverError && (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverError}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? "..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}