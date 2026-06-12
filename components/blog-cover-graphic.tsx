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
        "relative flex h-full min-h-[180px] w-full flex-col justify-between overflow-hidden bg-[var(--brand-green)] p-5 sm:p-6",
        className
      )}
      role="img"
      aria-label={`Capa do artigo: ${title}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at ${12 + (accent % 20)}% ${18 + (accent % 15)}%, rgba(242,140,27,0.28), transparent 34%), radial-gradient(circle at ${78 + (accent % 12)}% ${72 + (accent % 10)}%, rgba(123,44,40,0.22), transparent 30%)`
        }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-orange)] text-lg font-black text-white shadow-md">
            ES
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-100/90">Emprego São Luís</p>
            <p className="text-xs font-semibold text-white/78">Blog · Maranhão</p>
          </div>
        </div>
        {category ? (
          <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white/90">
            {category}
          </span>
        ) : null}
      </div>
      <div className="relative mt-6">
        <div className="mb-3 h-1 w-16 rounded-full bg-[var(--brand-orange)]" />
        <p className="text-lg font-extrabold leading-snug text-white sm:text-xl">{shortTitle}</p>
      </div>
    </div>
  );
}
