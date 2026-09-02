import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

console.log("\x1b[36m%s\x1b[0m", "🚀 Starting Vanam-Kuri API Server and Frontend...");

const api = spawn("node", ["./scripts/dev-api.mjs"], {
  cwd: rootDir,
  stdio: "inherit",
});

const frontend = spawn("node", ["./scripts/dev.mjs"], {
  cwd: rootDir,
  stdio: "inherit",
});

process.on("SIGINT", () => {
  api.kill();
  frontend.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  api.kill();
  frontend.kill();
  process.exit(0);
});
