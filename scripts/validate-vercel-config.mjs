/**
 * Assert vercel.json exposes HTTPS redirects and global security headers.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./load-env.mjs";

const CONFIG = path.join(ROOT, "vercel.json");

function fail(message) {
  console.error(`\n[validate-vercel-config] FAIL: ${message}\n`);
  process.exit(1);
}

export function validateVercelConfig() {
  const raw = fs.readFileSync(CONFIG, "utf8");
  const config = JSON.parse(raw);

  const routes = config.routes ?? [];
  const hasHttpsRedirect = routes.some(
    (route) =>
      route.status === 308 &&
      route.headers?.Location?.startsWith("https://www.techvergesolution.com/") &&
      route.has?.some(
        (cond) =>
          cond.type === "header" && cond.key === "x-forwarded-proto" && cond.value === "http",
      ),
  );
  if (!hasHttpsRedirect) fail("Missing HTTP → HTTPS www redirect route");

  const hasApexRedirect = routes.some(
    (route) =>
      route.status === 308 &&
      route.has?.some((cond) => cond.type === "host" && cond.value === "techvergesolution\\.com"),
  );
  if (!hasApexRedirect) fail("Missing apex → www redirect route");

  const headers = config.headers ?? [];
  const global = headers.find((block) => block.source === "/(.*)");
  if (!global) fail('Missing global headers block for source "/(.*)"');

  const required = [
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
  ];
  const keys = new Set(global.headers.map((entry) => entry.key));
  for (const key of required) {
    if (!keys.has(key)) fail(`Missing security header ${key} in vercel.json`);
  }

  console.log("[validate-vercel-config] OK — HTTPS/www redirects and security headers");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  validateVercelConfig();
}
