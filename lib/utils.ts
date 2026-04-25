import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getSiteUrl } from "@/lib/site-url";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(pathname: string) {
  return getSiteUrl(pathname);
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) {
    return "Data indisponivel";
  }
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(d);
  } catch {
    return "Data indisponivel";
  }
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
