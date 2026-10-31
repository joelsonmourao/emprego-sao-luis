import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";
import { describe, expect, it } from "vitest";
import { IMPORT_EXAMPLE_MARKER, IMPORT_TEMPLATE_HEADERS } from "@es/shared";

const here = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.resolve(here, "../../public/modelos/modelo-importacao-vagas.xlsx");

describe("downloadable import template", () => {
  it("is a readable XLSX with documented headers and a protected example marker", () => {
    expect(fs.existsSync(templatePath)).toBe(true);
    const workbook = XLSX.readFile(templatePath);
    expect(workbook.SheetNames).toEqual(expect.arrayContaining(["Vagas", "Instruções"]));
    const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets.Vagas!, { header: 1 });
    expect(rows[0]).toEqual(IMPORT_TEMPLATE_HEADERS);
    expect(rows.flat().map(String)).toContain(IMPORT_EXAMPLE_MARKER);
  });
});
