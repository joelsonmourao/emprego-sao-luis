import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "horizontal" | "mark";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ variant = "horizontal", className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src={variant === "mark" ? "/icon.png" : "/logo-horizontal.png"}
      alt="Emprego Sao Luis"
      width={variant === "mark" ? 190 : 322}
      height={variant === "mark" ? 190 : 117}
      priority={priority}
      className={cn(variant === "mark" ? "h-12 w-12 object-contain" : "h-14 w-auto object-contain", className)}
    />
  );
}
