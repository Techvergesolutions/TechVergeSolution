/**
 * Post-vite SEO pipeline: sitemap → meta shells → HTML body capture → validate.
 */
import { loadEnvFiles } from "./load-env.mjs";
import { generateSitemap } from "./generate-sitemap.mjs";
import { optimizeBlogImages } from "./optimize-images.mjs";
import { prerenderMeta } from "./prerender-meta.mjs";
import { injectBlogHtml } from "./inject-blog-html.mjs";
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
  console.log("[seo-build] Injecting Markdown blog HTML into shells…");
  await injectBlogHtml();
  console.log("[seo-build] Capturing rendered HTML bodies…");
  let playwrightOk = false;
  try {
    await prerenderHtml();
    playwrightOk = true;
  } catch (error) {
    console.error(
      "[seo-build] Playwright capture failed; Markdown inject still present:",
      error.message || error,
    );
  }
  console.log("[seo-build] Validating dist SEO artifacts…");
  await validateSeoDist({ allowShellOnly: !playwrightOk });

  // After a production Vercel build, notify IndexNow that blog URLs are live.
  if (process.env.VERCEL === "1" || process.env.INDEXNOW_PING_ON_BUILD === "1") {
    try {
      const { pingIndexNow } = await import("./ping-indexnow.mjs");
      const { collectBlogPosts } = await import("./collect-blog-posts.mjs");
      const site = (process.env.SITE_URL || "https://www.techvergesolution.com").replace(
        /\/$/,
        "",
      );
      const posts = await collectBlogPosts();
      const urls = [
        `${site}/`,
        `${site}/blog`,
        `${site}/sitemap.xml`,
        ...posts.map((p) => `${site}/blog/${p.slug}`),
      ];
      console.log("[seo-build] Pinging IndexNow…");
      await pingIndexNow(urls);
    } catch (error) {
      console.warn(
        "[seo-build] IndexNow ping skipped/failed (non-fatal):",
        error?.message || error,
      );
    }
  }

  console.log("[seo-build] Done.");
}

main().catch((err) => {
  console.error("[seo-build] FAILED:", err);
  process.exit(1);
});

