import { cn } from "@/lib/utils";

export function AdSlot({ label = "Publicidade", className }: { label?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-32 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-400",
        className
      )}
    >
      {label}
    </div>
  );
}
