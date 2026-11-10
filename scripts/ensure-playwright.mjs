/**
 * Ensure Playwright Chromium is available for prerender-html (local + CI/Vercel).
 */
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const onCi = process.env.VERCEL === "1" || process.env.CI === "true";
const force = process.argv.includes("--force");

function chromiumInstalled() {
  try {
    const exe = chromium.executablePath();
    return Boolean(exe && fs.existsSync(exe));
  } catch {
    return false;
  }
}

/** Playwright can use installed Chrome/Edge via channel when bundled Chromium is missing. */
function systemBrowserLikelyAvailable() {
  if (process.platform === "win32") {
    const candidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    ];
    return candidates.some((p) => fs.existsSync(p));
  }
  return process.platform === "darwin" || process.platform === "linux";
}

const shouldInstall =
  force || onCi || (!chromiumInstalled() && !systemBrowserLikelyAvailable());

if (!shouldInstall) {
  if (!chromiumInstalled() && systemBrowserLikelyAvailable()) {
    console.log(
      "[ensure-playwright] Bundled Chromium missing; prerender will use system Chrome/Edge",
    );
  }
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
