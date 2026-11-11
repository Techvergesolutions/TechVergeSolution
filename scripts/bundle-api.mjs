/**
 * Bundle each api/*.ts entry so Vercel Node ESM can run it without
 * resolving extensionless ../src/lib/server/* imports.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API_DIR = path.join(ROOT, "api");
const SRC_DIR = path.join(ROOT, "src");
const onVercel = process.env.VERCEL === "1";

function apiEntries() {
  return fs
    .readdirSync(API_DIR)
    .filter((name) => name.endsWith(".ts") && !name.endsWith(".d.ts"))
    .map((name) => path.join(API_DIR, name));
}

async function bundleEntry(entry) {
  const name = path.basename(entry, ".ts");
  const outDir = onVercel ? API_DIR : path.join(ROOT, ".api-bundle");
  fs.mkdirSync(outDir, { recursive: true });
  const outfile = path.join(outDir, `${name}.js`);
  await esbuild.build({
    absWorkingDir: ROOT,
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    packages: "external",
    legalComments: "none",
    sourcemap: false,
    logLevel: "warning",
    alias: { "@": SRC_DIR },
  });
  return { name, outfile };
}

async function main() {
  const entries = apiEntries();
  if (!entries.length) {
    console.warn("[bundle-api] No api/*.ts files found");
    return;
  }

  const written = [];
  for (const entry of entries) {
    written.push(await bundleEntry(entry));
  }

  if (onVercel) {
    for (const entry of entries) {
      fs.renameSync(entry, `${entry}.source`);
    }
    console.log(
      `[bundle-api] Wrote ${written.length} bundled functions and hid .ts entries for Vercel`,
    );
  } else {
    console.log(
      `[bundle-api] Wrote ${written.length} bundled files to .api-bundle/`,
    );
  }
}

main().catch((error) => {
  console.error("[bundle-api] FAILED:", error);
  process.exit(1);
});
