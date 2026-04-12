export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "default"
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "default" | "light";
}) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? (
        <p className={tone === "light" ? "text-xs font-semibold uppercase tracking-[0.28em] text-violet-100" : "text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-cobalt)]"}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={tone === "light" ? "text-3xl font-black tracking-tight text-white sm:text-4xl" : "text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"}>{title}</h2>
      {description ? <p className={tone === "light" ? "text-base leading-8 text-white/82 sm:text-lg" : "text-base leading-8 text-slate-600 sm:text-lg"}>{description}</p> : null}
    </div>
  );
}
