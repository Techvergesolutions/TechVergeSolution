import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync, writeFileSync } from "node:fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "NEXT_PUBLIC_");
  if (!process.env.NEXT_PUBLIC_SITE_URL && env.NEXT_PUBLIC_SITE_URL) {
    process.env.NEXT_PUBLIC_SITE_URL = env.NEXT_PUBLIC_SITE_URL;
  }
  const { siteUrl, defaultDescription } = await import("./src/lib/seo/config");
  const { organizationJsonLd } = await import("./src/lib/seo/schema");
  const publicSeoFiles = ["robots.txt"];
  const renderPublicSeoFile = (file: string) =>
    readFileSync(path.resolve("public", file), "utf8").replaceAll("%SEO_SITE_URL%", siteUrl);
  let outputDir = "dist";
  return {
    define: {
      "process.env.NEXT_PUBLIC_SITE_URL": JSON.stringify(siteUrl),
      "import.meta.env.NEXT_PUBLIC_GA_ID": JSON.stringify(env.NEXT_PUBLIC_GA_ID?.trim() || ""),
      "import.meta.env.IS_PRODUCTION_DEPLOY": JSON.stringify(mode === "production" && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production") ? "1" : "0"),
    },
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      {
        name: "shared-seo-config",
        configResolved(config) {
          outputDir = config.build.outDir;
        },
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const file = req.url?.split("?")[0].slice(1);
            if (!file || !publicSeoFiles.includes(file)) return next();
            res.setHeader("Content-Type", file.endsWith("xml") ? "application/xml" : "text/plain");
            res.end(renderPublicSeoFile(file));
          });
        },
        writeBundle() {
          for (const file of publicSeoFiles) {
            writeFileSync(path.resolve(outputDir, file), renderPublicSeoFile(file));
          }
        },
        transformIndexHtml: {
          order: "pre",
          handler(html) {
          const verification = env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
          const verificationTag = verification ? `<meta name="google-site-verification" content="${verification.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}" />` : "";
          return html
            .replace("</head>", `${verificationTag}\n  </head>`)
            .replaceAll("%SEO_SITE_URL%", siteUrl)
            .replaceAll("%SEO_DEFAULT_DESCRIPTION%", defaultDescription.replaceAll("&", "&amp;").replaceAll('"', "&quot;"))
            .replaceAll("%SEO_ORGANIZATION_JSON_LD%", JSON.stringify(organizationJsonLd()).replaceAll("<", "\\u003c"));
          },
        },
      } satisfies Plugin,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
