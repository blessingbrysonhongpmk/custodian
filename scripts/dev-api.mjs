import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const apiDir = path.resolve(rootDir, "artifacts/api-server");

const buildProc = spawn("node", ["./build.mjs"], {
  cwd: apiDir,
  stdio: "inherit",
});

buildProc.on("exit", (code) => {
  if (code === 0) {
    spawn("node", ["--enable-source-maps", "./dist/index.mjs"], {
      cwd: apiDir,
      stdio: "inherit",
    });
  }
});
