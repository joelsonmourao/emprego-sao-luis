/** Placeholder quando o visitante e admin autenticado: evita carregar/clicar em AdSense no site publico. */
export function AdminAdPlaceholder({ slotId }: { slotId: string }) {
  return (
    <div
      className="hidden min-h-0"
      aria-hidden
      data-ad-suppressed="admin"
      data-ad-slot-id={slotId}
      dangerouslySetInnerHTML={{ __html: "<!-- Ad slot hidden for admin -->" }}
    />
  );
}
