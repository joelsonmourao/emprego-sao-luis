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
  const shortTitle = title.length > 72 ? `${title.slice(0, 69)}...` : title;

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[180px] w-full flex-col justify-between overflow-hidden bg-[var(--brand-beige)] p-5 sm:p-6",
        className
      )}
      role="img"
      aria-label={`Capa do artigo: ${title}`}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--brand-brick)] via-[var(--brand-orange)] to-[var(--brand-brick)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at ${12 + (accent % 20)}% ${18 + (accent % 15)}%, rgba(242,140,27,0.18), transparent 34%), radial-gradient(circle at ${78 + (accent % 12)}% ${72 + (accent % 10)}%, rgba(123,44,40,0.14), transparent 30%)`
        }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-orange)] text-lg font-black text-white shadow-md">
            ES
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--brand-brick)]">Emprego São Luís</p>
            <p className="text-xs font-semibold text-[var(--brand-text-secondary)]">Blog · Maranhão</p>
          </div>
        </div>
        {category ? (
          <span className="rounded-full border border-[rgba(123,44,40,0.16)] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--brand-brick)]">
            {category}
          </span>
        ) : null}
      </div>
      <div className="relative mt-6">
        <div className="mb-3 h-1 w-16 rounded-full bg-[var(--brand-orange)]" />
        <p className="text-lg font-extrabold leading-snug text-[var(--brand-charcoal)] sm:text-xl">{shortTitle}</p>
      </div>
    </div>
  );
}
