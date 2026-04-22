export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "default",
  align = "left",
  titleLevel = "h2"
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "default" | "light";
  align?: "left" | "center";
  /** Use h1 apenas uma vez por pagina (ex.: titulo principal da vaga). */
  titleLevel?: "h1" | "h2";
}) {
  return (
    <div className={`max-w-3xl min-w-0 space-y-3 ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p
          className={
            tone === "light"
              ? "text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-100 sm:text-xs sm:tracking-[0.28em]"
              : "text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-orange)] sm:text-xs sm:tracking-[0.28em]"
          }
        >
          {eyebrow}
        </p>
      ) : null}
      {titleLevel === "h1" ? (
        <h1
          className={
            tone === "light"
              ? "text-[1.9rem] font-black tracking-tight text-white break-words leading-[1.08] sm:text-4xl"
              : "text-[1.9rem] font-black tracking-tight text-[var(--brand-navy)] break-words leading-[1.08] sm:text-4xl"
          }
        >
          {title}
        </h1>
      ) : (
        <h2
          className={
            tone === "light"
              ? "text-[1.9rem] font-black tracking-tight text-white break-words leading-[1.08] sm:text-4xl"
              : "text-[1.9rem] font-black tracking-tight text-[var(--brand-navy)] break-words leading-[1.08] sm:text-4xl"
          }
        >
          {title}
        </h2>
      )}
      {description ? (
        <p
          className={
            tone === "light"
              ? "text-[15px] leading-7 text-white/90 break-words sm:text-lg sm:leading-8"
              : "text-[15px] leading-7 text-[var(--brand-text-secondary)] break-words sm:text-lg sm:leading-8"
          }
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
