import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "horizontal" | "mark";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ variant = "horizontal", className }: BrandLogoProps) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-12 w-12 shrink-0", className)}
        aria-hidden
      >
        <rect width="128" height="128" rx="30" fill="#1F2B24" />
        <circle cx="64" cy="42" r="22" fill="#F28C1B" />
        <rect x="48" y="56" width="32" height="10" rx="5" fill="#F28C1B" opacity="0.85" />
        <path d="M38 78h52v8c0 11-9 20-20 20h-12c-11 0-20-9-20-20v-8z" fill="#FFFFFF" opacity="0.95" />
        <text x="64" y="98" textAnchor="middle" fontFamily="Segoe UI, Arial, sans-serif" fontSize="28" fontWeight="800" fill="#F28C1B">
          ES
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 420 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto max-w-full sm:h-12 lg:h-14", className)}
      role="img"
      aria-label="Emprego São Luís"
    >
      <rect x="4" y="8" width="72" height="72" rx="20" fill="#1F2B24" />
      <circle cx="40" cy="30" r="14" fill="#F28C1B" />
      <rect x="30" y="40" width="20" height="6" rx="3" fill="#F28C1B" opacity="0.9" />
      <path d="M22 52h36v5c0 7.5-6 13.5-13.5 13.5h-9c-7.5 0-13.5-6-13.5-13.5v-5z" fill="#FFFFFF" opacity="0.95" />
      <text x="40" y="68" textAnchor="middle" fontFamily="Segoe UI, Arial, sans-serif" fontSize="18" fontWeight="800" fill="#F28C1B">
        ES
      </text>
      <text x="92" y="38" fontFamily="Segoe UI, Arial, sans-serif" fontSize="11" fontWeight="700" fill="#F28C1B" letterSpacing="3">
        MARANHÃO
      </text>
      <text x="92" y="62" fontFamily="Segoe UI, Arial, sans-serif" fontSize="24" fontWeight="800" fill="#FFFFFF">
        EMPREGO SÃO LUÍS
      </text>
      <text x="92" y="78" fontFamily="Segoe UI, Arial, sans-serif" fontSize="11" fill="#FFFFFF" opacity="0.72">
        Vagas em São Luís e região
      </text>
    </svg>
  );
}
