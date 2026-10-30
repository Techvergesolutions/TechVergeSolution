/**
 * Load Vite-style env files into process.env (does not override existing keys).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Keys that are safe to load from `.env.example` (public client config only). */
const EXAMPLE_ALLOWLIST = new Set([
  "VITE_BOOKING_URL",
  "VITE_SANITY_PROJECT_ID",
  "VITE_SANITY_DATASET",
  "VITE_SANITY_API_VERSION",
]);

function applyEnvFile(file, { allowlist = null } = {}) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    // Never hydrate deprecated client-bundled Sanity tokens from disk.
    if (key === "VITE_SANITY_TOKEN") continue;
    if (allowlist && !allowlist.has(key)) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

/**
 * Load local env files. `.env.example` may supply public VITE_* defaults only.
 */
export function loadEnvFiles() {
  applyEnvFile(path.join(ROOT, ".env.local"));
  applyEnvFile(path.join(ROOT, ".env"));
  applyEnvFile(path.join(ROOT, ".env.example"), {
    allowlist: EXAMPLE_ALLOWLIST,
  });
}

export { ROOT };
