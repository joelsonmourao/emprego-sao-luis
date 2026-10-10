import { describe, expect, it } from "vitest";
import { MAX_IMPORT_BYTES, validateImportFile } from "./import-file-validation";

describe("validação de arquivo de importação", () => {
  it("aceita CSV textual", () => {
    const bytes = new TextEncoder().encode("titulo,empresa\nAnalista,Empresa");
    expect(validateImportFile("vagas.csv", bytes.length, bytes)).toEqual({ ok: true, extension: "csv" });
  });

  it("aceita assinatura ZIP de XLSX", () => {
    const bytes = Uint8Array.from([0x50, 0x4b, 0x03, 0x04]);
    expect(validateImportFile("vagas.xlsx", bytes.length, bytes)).toEqual({ ok: true, extension: "xlsx" });
  });

  it.each([
    ["vazio.csv", 0, new Uint8Array(), 400, "EMPTY_FILE"],
    ["grande.csv", MAX_IMPORT_BYTES + 1, undefined, 413, "PAYLOAD_TOO_LARGE"],
    ["vagas.exe", 10, new Uint8Array(10), 415, "UNSUPPORTED_FILE_TYPE"],
    ["falso.xlsx", 4, Uint8Array.from([1, 2, 3, 4]), 415, "FILE_SIGNATURE_MISMATCH"],
    ["binario.csv", 3, Uint8Array.from([65, 0, 66]), 415, "FILE_SIGNATURE_MISMATCH"]
  ])("rejeita %s com status controlado", (name, size, bytes, status, code) => {
    expect(validateImportFile(name as string, size as number, bytes as Uint8Array | undefined)).toMatchObject({ ok: false, status, code });
  });
});
