function stripLeadingListMarker(value: string) {
  return value
    .trim()
    .replace(/^[*\u2022]+\s*/, "")
    .replace(/^(?:-\s*)+/, "")
    .trim();
}

export function normalizeListItem(value: unknown) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return stripLeadingListMarker(text);
}

export function normalizeListValues(values: unknown[]) {
  return values.map((value) => normalizeListItem(value)).filter(Boolean);
}
