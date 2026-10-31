const GOOGLE_PUBLISHER_ID = /^pub-(?!0{16}$)\d{16}$/i;

export function normalizeGooglePublisherId(value: string) {
  const normalized = value.trim().replace(/^ca-/i, "").toLowerCase();
  return GOOGLE_PUBLISHER_ID.test(normalized) ? normalized : "";
}

export function validateAdsTxtContent(value: string) {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const output: string[] = [];
  const errors: Array<{ line: number; message: string }> = [];
  const seen = new Set<string>();
  for (const [index, line] of lines.entries()) {
    if (line.startsWith("#")) {
      if (!seen.has(line)) output.push(line);
      seen.add(line);
      continue;
    }
    const fields = line.split(",").map((field) => field.trim());
    const domain = fields[0] ?? "";
    const accountId = fields[1] ?? "";
    const validAccount =
      domain.toLowerCase() === "google.com"
        ? GOOGLE_PUBLISHER_ID.test(accountId)
        : /^pub-(?!0+$)\d+$/i.test(accountId);
    const valid = (fields.length === 3 || fields.length === 4)
      && /^[a-z0-9.-]+$/i.test(domain)
      && validAccount
      && /^(DIRECT|RESELLER)$/i.test(fields[2] ?? "")
      && (!fields[3] || /^[a-z0-9]+$/i.test(fields[3]));
    if (!valid) {
      errors.push({ line: index + 1, message: "Formato esperado: domínio, pub-ID válido, DIRECT|RESELLER, certificador opcional." });
      continue;
    }
    const normalized = `${domain.toLowerCase()}, ${accountId.toLowerCase()}, ${fields[2]!.toUpperCase()}${fields[3] ? `, ${fields[3]!.toLowerCase()}` : ""}`;
    const signature = normalized.toLowerCase();
    if (!seen.has(signature)) output.push(normalized);
    seen.add(signature);
  }
  return { valid: errors.length === 0, content: output.join("\n"), errors, duplicatesRemoved: lines.length - output.length - errors.length };
}

export function prepareAdsTxtContent(value: string) {
  const result = validateAdsTxtContent(value);
  if (!result.valid) return "";
  const hasSellerRecord = result.content
    .split(/\r?\n/)
    .some((line) => line.trim() && !line.trim().startsWith("#"));
  return hasSellerRecord ? `${result.content}\n` : "";
}
