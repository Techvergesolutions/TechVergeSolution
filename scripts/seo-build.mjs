/**
 * Post-vite SEO pipeline: sitemap → meta shells → HTML body capture → validate.
 */
import { loadEnvFiles } from "./load-env.mjs";
import { generateSitemap } from "./generate-sitemap.mjs";
import { optimizeBlogImages } from "./optimize-images.mjs";
import { prerenderMeta } from "./prerender-meta.mjs";
import { prerenderHtml } from "./prerender-html.mjs";
import { validateSeoDist } from "./validate-seo-dist.mjs";

async function main() {
  loadEnvFiles();
  console.log("[seo-build] Optimizing blog images…");
  await optimizeBlogImages();
  console.log("[seo-build] Generating sitemap…");
  await generateSitemap();
  console.log("[seo-build] Writing route meta HTML…");
  await prerenderMeta();
  console.log("[seo-build] Capturing rendered HTML bodies…");
  await prerenderHtml();
  console.log("[seo-build] Validating dist SEO artifacts…");
  await validateSeoDist();
  console.log("[seo-build] Done.");
}

main().catch((err) => {
  console.error("[seo-build] FAILED:", err);
  process.exit(1);
});
