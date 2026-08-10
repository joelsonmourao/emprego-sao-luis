export const MAX_IMPORT_BYTES = 20 * 1024 * 1024;
export type ImportFileExtension = "xlsx" | "csv";

export type ImportFileValidation =
  | { ok: true; extension: ImportFileExtension }
  | { ok: false; status: 400 | 413 | 415; code: string; error: string };

export function validateImportFile(name: string, size: number, bytes?: Uint8Array): ImportFileValidation {
  if (size === 0) return { ok: false, status: 400, code: "EMPTY_FILE", error: "Arquivo vazio." };
  if (size > MAX_IMPORT_BYTES) {
    return { ok: false, status: 413, code: "PAYLOAD_TOO_LARGE", error: "Arquivo muito grande." };
  }

  const extension = name.split(".").pop()?.toLowerCase();
  if (extension !== "xlsx" && extension !== "csv") {
    return { ok: false, status: 415, code: "UNSUPPORTED_FILE_TYPE", error: "Extensão não suportada." };
  }
  if (!bytes) return { ok: true, extension };

  if (extension === "xlsx" && !(bytes[0] === 0x50 && bytes[1] === 0x4b)) {
    return { ok: false, status: 415, code: "FILE_SIGNATURE_MISMATCH", error: "O conteúdo do arquivo não corresponde a uma planilha XLSX." };
  }
  if (extension === "csv" && bytes.includes(0)) {
    return { ok: false, status: 415, code: "FILE_SIGNATURE_MISMATCH", error: "O arquivo CSV contém dados binários inválidos." };
  }
  return { ok: true, extension };
}
