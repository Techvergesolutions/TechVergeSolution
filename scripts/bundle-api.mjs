/**
 * Bundle each api/*.ts entry so Vercel Node ESM can run without
 * resolving extensionless ../src/lib/server/* imports.
 *
 * Bundles land in .api-bundle/ (outside /api, so they are not extra functions).
 * On Vercel the original api/*.ts files are replaced with a re-export so the
 * existing functions config (api/blog-page.ts) still matches.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API_DIR = path.join(ROOT, "api");
const SRC_DIR = path.join(ROOT, "src");
const OUT_DIR = path.join(ROOT, ".api-bundle");
const onVercel = process.env.VERCEL === "1";

function apiEntries() {
  return fs
    .readdirSync(API_DIR)
    .filter((name) => name.endsWith(".ts") && !name.endsWith(".d.ts"))
    .map((name) => path.join(API_DIR, name));
}

async function bundleEntry(entry) {
  const name = path.basename(entry, ".ts");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outfile = path.join(OUT_DIR, `${name}.js`);
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
    for (const { name } of written) {
      const stub = `export { default } from "../.api-bundle/${name}.js";\n`;
      fs.writeFileSync(path.join(API_DIR, `${name}.ts`), stub, "utf8");
    }
    console.log(
      `[bundle-api] Wrote ${written.length} bundles and pointed api/*.ts at them for Vercel`,
    );
  } else {
    console.log(
      `[bundle-api] Wrote ${written.length} bundled files to .api-bundle/`,
    );
  }
  process.exit(0);
}

main().catch((error) => {
  console.error("[bundle-api] FAILED:", error);
  process.exit(1);
});
