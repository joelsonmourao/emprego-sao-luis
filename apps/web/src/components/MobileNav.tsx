import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  current?: boolean;
}

interface Props {
  items: NavItem[];
  ctaHref: string;
  ctaLabel: string;
}

export function MobileNav({ items, ctaHref, ctaLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="es-btn es-btn-secondary px-3 py-2 text-sm"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      {open && (
        <nav id="mobile-nav-panel" className="absolute right-4 top-full z-50 mt-2 grid min-w-52 gap-1 rounded-2xl border border-[var(--es-border)] bg-white p-3 shadow-[var(--es-shadow)]" aria-label="Menu mobile">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${item.current ? "bg-[color-mix(in_srgb,var(--brand-primary)_10%,white)] text-[var(--brand-primary)]" : "hover:bg-[var(--es-cream-dark)]"}`}
              aria-current={item.current ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href={ctaHref} className="es-btn es-btn-primary mt-1 text-sm" onClick={() => setOpen(false)}>
            {ctaLabel}
          </a>
        </nav>
      )}
    </div>
  );
}
