import { useState } from "react";

export function CookieConsent() {
  const [hidden, setHidden] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (choice: "yes" | "no") => {
    setLoading(true);
    try {
      const response = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ choice }),
        credentials: "same-origin"
      });
      if (!response.ok) throw new Error("Falha ao salvar preferência");
      setHidden(true);
      window.location.reload();
    } catch {
      setLoading(false);
    }
  };

  if (hidden) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-[var(--es-border)] bg-white p-4 shadow-[var(--es-shadow)] sm:left-auto"
      role="dialog"
      aria-label="Consentimento de cookies"
    >
      <p className="text-sm text-[var(--es-muted)]">
        Usamos cookies essenciais e, com seu consentimento, cookies de medição e publicidade.
      </p>
      {showPrefs && (
        <p className="mt-2 text-xs text-[var(--es-muted)]">
          Essenciais: sempre ativos. Medição e publicidade: opcionais. Você pode recusar sem perder acesso às vagas.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="es-btn es-btn-primary text-sm" disabled={loading} onClick={() => submit("yes")}>
          Aceitar
        </button>
        <button type="button" className="es-btn es-btn-secondary text-sm" disabled={loading} onClick={() => submit("no")}>
          Recusar
        </button>
        <button type="button" className="es-btn es-btn-secondary text-sm" onClick={() => setShowPrefs((value) => !value)} aria-expanded={showPrefs}>
          Preferências
        </button>
      </div>
    </div>
  );
}
