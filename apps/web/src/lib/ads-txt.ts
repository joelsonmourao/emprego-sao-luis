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
    const valid = (fields.length === 3 || fields.length === 4)
      && /^[a-z0-9.-]+$/i.test(fields[0] ?? "")
      && /^pub-\d+$/i.test(fields[1] ?? "")
      && /^(DIRECT|RESELLER)$/i.test(fields[2] ?? "")
      && (!fields[3] || /^[a-z0-9]+$/i.test(fields[3]));
    if (!valid) {
      errors.push({ line: index + 1, message: "Formato esperado: domínio, pub-ID, DIRECT|RESELLER, certificador opcional." });
      continue;
    }
    const normalized = `${fields[0]!.toLowerCase()}, ${fields[1]!.toLowerCase()}, ${fields[2]!.toUpperCase()}${fields[3] ? `, ${fields[3]!.toLowerCase()}` : ""}`;
    const signature = normalized.toLowerCase();
    if (!seen.has(signature)) output.push(normalized);
    seen.add(signature);
  }
  return { valid: errors.length === 0, content: output.join("\n"), errors, duplicatesRemoved: lines.length - output.length - errors.length };
}
