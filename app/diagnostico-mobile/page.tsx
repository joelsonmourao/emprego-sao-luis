"use client";

import { useEffect, useState } from "react";

type Snapshot = {
  userAgent: string;
  innerWidth: number;
  innerHeight: number;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  visualViewportWidth: number | null;
  visualViewportHeight: number | null;
  visualViewportScale: number | null;
  mobileMediaMatch: boolean;
  reducedMotion: boolean;
  language: string;
  platform: string;
};

function readSnapshot(): Snapshot {
  const vv = window.visualViewport;
  return {
    userAgent: navigator.userAgent,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio,
    visualViewportWidth: vv?.width ?? null,
    visualViewportHeight: vv?.height ?? null,
    visualViewportScale: vv?.scale ?? null,
    mobileMediaMatch: window.matchMedia("(max-width: 768px)").matches,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    language: navigator.language,
    platform: navigator.platform
  };
}

export default function DiagnosticoMobilePage() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  useEffect(() => {
    function refresh() {
      setSnapshot(readSnapshot());
      setUpdatedAt(new Date().toISOString());
    }
    refresh();
    window.addEventListener("resize", refresh);
    window.visualViewport?.addEventListener("resize", refresh);
    return () => {
      window.removeEventListener("resize", refresh);
      window.visualViewport?.removeEventListener("resize", refresh);
    };
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="text-xl font-bold text-slate-900">Diagnostico de viewport mobile</h1>
      <p className="mt-2 text-sm text-slate-600">
        Abra esta pagina no aparelho com problema para validar se o Chrome esta em modo desktop.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Atualizado em</p>
        <p className="font-mono text-xs text-slate-800">{updatedAt || "-"}</p>
      </div>
      <pre className="mt-4 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-900">
        {snapshot ? JSON.stringify(snapshot, null, 2) : "Coletando dados..."}
      </pre>
    </main>
  );
}
