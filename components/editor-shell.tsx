import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EditorShell({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-slate-200 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)]">
      <CardHeader className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#06b6d4_100%)] text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">{eyebrow}</p>
        <CardTitle className="text-3xl text-white">{title}</CardTitle>
        <CardDescription className="max-w-3xl text-sky-50/85">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-8">{children}</CardContent>
    </Card>
  );
}
