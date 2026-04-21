import path from "node:path";

import { prisma } from "../lib/db";
import { processScheduledJobsWorkbook } from "../lib/scheduled-jobs";

function readCliOption(flag: string) {
  const entry = process.argv.find((value) => value.startsWith(`${flag}=`));
  return entry ? entry.slice(flag.length + 1) : undefined;
}

async function main() {
  try {
    const workbookPath = readCliOption("--file");
    const sheetName = readCliOption("--sheet");
    const logDir = readCliOption("--log-dir");

    const result = await processScheduledJobsWorkbook({
      workbookPath: workbookPath ? path.resolve(workbookPath) : undefined,
      sheetName,
      logDir: logDir ? path.resolve(logDir) : undefined
    });

    console.log(JSON.stringify(result, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha inesperada ao processar a publicacao agendada."
      },
      null,
      2
    )
  );
  process.exitCode = 1;
});
