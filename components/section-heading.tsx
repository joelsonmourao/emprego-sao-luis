export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "default",
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "default" | "light";
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-3xl min-w-0 space-y-3 ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p
          className={
            tone === "light"
              ? "text-xs font-semibold uppercase tracking-[0.28em] text-orange-100"
              : "text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]"
          }
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={
          tone === "light"
            ? "text-3xl font-black tracking-tight text-white break-words sm:text-4xl"
            : "text-3xl font-black tracking-tight text-[var(--brand-navy)] break-words sm:text-4xl"
        }
      >
        {title}
      </h2>
      {description ? (
        <p
          className={
            tone === "light"
              ? "text-base leading-8 text-white/90 break-words sm:text-lg"
              : "text-base leading-8 text-[var(--brand-text-secondary)] break-words sm:text-lg"
          }
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
