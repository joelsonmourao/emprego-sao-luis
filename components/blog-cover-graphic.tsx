import { cn } from "@/lib/utils";

type BlogCoverGraphicProps = {
  title: string;
  category?: string;
  slug: string;
  className?: string;
};

function accentFromSlug(slug: string) {
  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash + slug.charCodeAt(index) * (index + 1)) % 360;
  }
  return hash;
}

export function BlogCoverGraphic({ title, category, slug, className }: BlogCoverGraphicProps) {
  const accent = accentFromSlug(slug);

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[170px] w-full flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#F5F2EB_0%,#FFFFFF_54%,#efe7dc_100%)] p-5 sm:p-6",
        className
      )}
      role="img"
      aria-label={`Capa do artigo: ${title}`}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--brand-brick)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at ${12 + (accent % 20)}% ${18 + (accent % 15)}%, rgba(123,44,40,0.1), transparent 34%), radial-gradient(circle at ${78 + (accent % 12)}% ${72 + (accent % 10)}%, rgba(31,43,36,0.08), transparent 30%)`
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="" aria-hidden className="h-10 w-10 shrink-0 object-contain" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--brand-brick)]">Emprego Sao Luis</p>
            <p className="text-xs font-semibold text-[var(--brand-green)]">Blog Maranhao</p>
          </div>
        </div>
        {category ? (
          <span className="rounded-full border border-[rgba(123,44,40,0.18)] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--brand-brick)]">
            {category}
          </span>
        ) : null}
      </div>

      <div className="relative mt-6 flex items-end justify-between gap-4">
        <div>
          <div className="mb-3 h-1 w-16 rounded-full bg-[var(--brand-brick)]" />
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--brand-green)]">Guia de carreira</p>
        </div>
        <div className="h-12 w-12 rounded-full border border-[rgba(123,44,40,0.16)] bg-white/80" />
      </div>
    </div>
  );
}
