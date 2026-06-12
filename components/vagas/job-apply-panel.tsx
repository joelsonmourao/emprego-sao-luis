"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Mail, MessageCircle } from "lucide-react";

import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { Button } from "@/components/ui/button";
import { parseApplyDestination, type ApplyDestination } from "@/lib/apply-destination";

type JobApplyPanelProps = {
  applyUrl: string;
  jobSlug: string;
};

type JobApplyMobileBarProps = {
  applyUrl: string;
  jobSlug: string;
  jobTitle: string;
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={async () => {
        const ok = await copyText(value);
        if (ok) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        }
      }}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copiado" : label}
    </Button>
  );
}

function EmailApplyActions({ destination, jobSlug }: { destination: ApplyDestination; jobSlug: string }) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <Button type="button" size="lg" className="w-full gap-2 rounded-2xl" onClick={() => setRevealed(true)}>
        <Mail className="h-4 w-4" />
        Ver e-mail para candidatura
      </Button>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-mist)] p-4">
      <div>
        <p className="text-sm font-bold text-[var(--brand-charcoal)]">Envie seu currículo para este e-mail</p>
        <p className="mt-3 break-all rounded-xl border border-[var(--brand-line)] bg-white px-4 py-3 text-base font-semibold text-[var(--brand-brick)]">
          {destination.display}
        </p>
        <p className="mt-3 text-xs leading-5 text-[var(--brand-text-secondary)]">
          Envie seu currículo informando o nome da vaga no assunto.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <CopyButton label="Copiar e-mail" value={destination.value} />
        {destination.href ? (
          <Button asChild size="sm" variant="secondary" className="gap-2">
            <TrackedExternalLink
              href={destination.href}
              eventName="apply_click"
              entityType="job"
              entitySlug={jobSlug}
              metadata={{ applyType: "email" }}
            >
              <Mail className="h-4 w-4" />
              Abrir no e-mail
            </TrackedExternalLink>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function WhatsAppApplyActions({ destination, jobSlug }: { destination: ApplyDestination; jobSlug: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[var(--brand-charcoal)]">{destination.display}</p>
      <div className="flex flex-col gap-2">
        {destination.href ? (
          <Button asChild size="lg" className="w-full gap-2 rounded-2xl">
            <TrackedExternalLink
              href={destination.href}
              target="_blank"
              rel="noopener noreferrer"
              eventName="apply_click"
              entityType="job"
              entitySlug={jobSlug}
              metadata={{ applyType: "whatsapp" }}
            >
              <MessageCircle className="h-4 w-4" />
              Chamar no WhatsApp
            </TrackedExternalLink>
          </Button>
        ) : null}
        <CopyButton label="Copiar número" value={destination.display} />
      </div>
    </div>
  );
}

function UrlApplyActions({ destination, jobSlug }: { destination: ApplyDestination; jobSlug: string }) {
  if (!destination.href) return null;

  return (
    <div className="space-y-3">
      <Button asChild size="lg" className="w-full gap-2 rounded-2xl">
        <TrackedExternalLink
          href={destination.href}
          target="_blank"
          rel="noopener noreferrer"
          eventName="apply_click"
          entityType="job"
          entitySlug={jobSlug}
          metadata={{ applyType: "url" }}
        >
          Candidatar-se à vaga
          <ExternalLink className="h-4 w-4" />
        </TrackedExternalLink>
      </Button>
      <p className="text-xs leading-5 text-[var(--brand-text-secondary)]">
        Você será direcionado a um site externo para concluir a candidatura fora do Emprego São Luís.
      </p>
    </div>
  );
}

export function JobApplyPanel({ applyUrl, jobSlug }: JobApplyPanelProps) {
  const destination = parseApplyDestination(applyUrl);

  switch (destination.type) {
    case "email":
      return <EmailApplyActions destination={destination} jobSlug={jobSlug} />;
    case "whatsapp":
      return <WhatsAppApplyActions destination={destination} jobSlug={jobSlug} />;
    case "url":
      return <UrlApplyActions destination={destination} jobSlug={jobSlug} />;
    default:
      return (
        <p className="rounded-2xl border border-dashed border-[var(--brand-line)] bg-white px-4 py-3 text-sm text-[var(--brand-text-secondary)]">
          Link de candidatura indisponível no momento. Entre em contato com a empresa ou volte mais tarde.
        </p>
      );
  }
}

export function JobApplyMobileBar({ applyUrl, jobSlug, jobTitle }: JobApplyMobileBarProps) {
  const destination = parseApplyDestination(applyUrl);
  const [emailOpen, setEmailOpen] = useState(false);

  return (
    <>
      {emailOpen && destination.type === "email" ? (
        <div className="fixed inset-x-0 bottom-[4.5rem] z-40 mx-4 rounded-2xl border border-[var(--brand-line)] bg-white p-4 shadow-xl lg:hidden">
          <p className="text-sm font-bold text-[var(--brand-charcoal)]">Envie seu currículo para este e-mail</p>
          <p className="mt-2 break-all text-sm font-semibold text-[var(--brand-brick)]">{destination.display}</p>
          <p className="mt-2 text-xs text-[var(--brand-text-secondary)]">Informe o nome da vaga no assunto.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton label="Copiar e-mail" value={destination.value} />
            <Button type="button" variant="ghost" size="sm" onClick={() => setEmailOpen(false)}>
              Fechar
            </Button>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--brand-line)] bg-white/98 shadow-[0_-12px_40px_-20px_rgba(26,26,26,0.25)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--brand-orange)]">Candidatura</p>
            <p className="truncate text-sm font-bold text-[var(--brand-charcoal)]">{jobTitle}</p>
          </div>
          <div className="shrink-0">
            {destination.type === "email" ? (
              <Button type="button" size="sm" className="gap-1.5 rounded-xl px-4" onClick={() => setEmailOpen((value) => !value)}>
                <Mail className="h-4 w-4" />
                Ver e-mail
              </Button>
            ) : destination.type === "whatsapp" && destination.href ? (
              <Button asChild size="sm" className="gap-1.5 rounded-xl px-4">
                <TrackedExternalLink
                  href={destination.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="apply_click"
                  entityType="job"
                  entitySlug={jobSlug}
                  metadata={{ applyType: "whatsapp", surface: "mobile-bar" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </TrackedExternalLink>
              </Button>
            ) : destination.type === "url" && destination.href ? (
              <Button asChild size="sm" className="gap-1.5 rounded-xl px-4">
                <TrackedExternalLink
                  href={destination.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="apply_click"
                  entityType="job"
                  entitySlug={jobSlug}
                  metadata={{ applyType: "url", surface: "mobile-bar" }}
                >
                  Candidatar-se
                  <ExternalLink className="h-3.5 w-3.5" />
                </TrackedExternalLink>
              </Button>
            ) : (
              <Button size="sm" disabled className="rounded-xl">
                Indisponível
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
