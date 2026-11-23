import { spawn } from "node:child_process";
import process from "node:process";

const child = spawn(process.execPath, ["apps/web/dist/server/entry.mjs"], { stdio: ["ignore", "inherit", "inherit"], env: { ...process.env, HOST: "127.0.0.1", PORT: "4321", NODE_ENV: "production" } });
child.once("spawn", () => process.stdout.write("LHCI_READY\n"));
child.once("exit", (code) => process.exit(code ?? 1));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
