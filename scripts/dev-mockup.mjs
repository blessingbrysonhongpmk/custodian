import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const appDir = path.resolve(rootDir, "artifacts/mockup-sandbox");

function start() {
  const proc = spawn("pnpm run dev", {
    cwd: appDir,
    stdio: "inherit",
    shell: true,
  });

  proc.on("error", () => {
    spawn("npx vite --config vite.config.ts --host 0.0.0.0", {
      cwd: appDir,
      stdio: "inherit",
      shell: true,
    });
  });
}

start();
