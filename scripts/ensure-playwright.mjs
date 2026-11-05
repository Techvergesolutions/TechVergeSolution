/**
 * Install Playwright Chromium on CI/Vercel so prerender-html runs during seo-build.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const onCi = process.env.VERCEL === "1" || process.env.CI === "true";
const force = process.argv.includes("--force");

if (!onCi && !force) {
  process.exit(0);
}

console.log("[ensure-playwright] Installing Chromium for HTML prerender…");
const result = spawnSync("npx playwright install chromium", {
  cwd: ROOT,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
