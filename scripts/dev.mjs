import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const appDir = path.resolve(rootDir, "artifacts/vanam-kuri");

const isWindows = process.platform === "win32";

function start() {
  const cmd = isWindows ? "pnpm run dev" : "pnpm run dev";
  const proc = spawn(cmd, {
    cwd: appDir,
    stdio: "inherit",
    shell: true,
  });

  proc.on("error", () => {
    const fallbackCmd = "npx vite --config vite.config.ts --host 0.0.0.0";
    spawn(fallbackCmd, {
      cwd: appDir,
      stdio: "inherit",
      shell: true,
    });
  });
}

start();
