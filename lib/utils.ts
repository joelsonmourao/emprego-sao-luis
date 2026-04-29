import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { formatBrazilDateLong } from "@/lib/date-utils";
import { getSiteUrl } from "@/lib/site-url";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(pathname: string) {
  return getSiteUrl(pathname);
}

export function formatDate(date: string | Date) {
  return formatBrazilDateLong(date);
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
