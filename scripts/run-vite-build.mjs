/**
 * Run `vite build` with public env loaded (including allowlisted `.env.example` keys)
 * so VITE_SANITY_PROJECT_ID is embedded for client Sanity CDN reads.
 */
import { spawnSync } from "node:child_process";
import { loadEnvFiles } from "./load-env.mjs";

loadEnvFiles();

if (!process.env.VITE_SANITY_PROJECT_ID?.trim()) {
  console.warn(
    "[run-vite-build] VITE_SANITY_PROJECT_ID is unset — Sanity posts will not render in the client bundle.",
  );
}

const result = spawnSync("npx", ["vite", "build"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
