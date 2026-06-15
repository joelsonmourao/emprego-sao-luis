import { cn } from "@/lib/utils";

type BlogCoverGraphicProps = {
  title: string;
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

export function BlogCoverGraphic({ title, slug, className }: BlogCoverGraphicProps) {
  const accent = accentFromSlug(slug);

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden bg-[var(--brand-beige)]", className)}
      role="img"
      aria-label={`Capa do artigo: ${title}`}
    >
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[var(--brand-brick)]" />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, rgba(245,242,235,1) 0%, rgba(255,255,255,0.96) 48%, rgba(239,231,220,0.92) 100%), radial-gradient(circle at ${18 + (accent % 18)}% ${24 + (accent % 12)}%, rgba(123,44,40,0.1), transparent 42%)`
        }}
      />
      <div className="absolute bottom-0 left-0 h-1 w-1/3 bg-[var(--brand-brick)]/70" />
      <span className="absolute bottom-3 right-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[var(--brand-brick)]/35">
        Emprego São Luís
      </span>
    </div>
  );
}
