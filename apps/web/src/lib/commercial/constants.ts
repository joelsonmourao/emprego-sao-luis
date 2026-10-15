export const PAYMENT_STATUSES = [
  "CREATED",
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
  "MANUAL_REVIEW"
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAID_STATUSES: PaymentStatus[] = ["PAID"];
export const BLOCKING_STATUSES: PaymentStatus[] = ["CREATED", "PENDING", "PROCESSING", "MANUAL_REVIEW"];

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function appendTimeline(timeline: unknown, entry: Record<string, unknown>) {
  const list = Array.isArray(timeline) ? [...timeline] : [];
  list.push({ ...entry, at: new Date().toISOString() });
  return list;
}
