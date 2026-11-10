import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import type { Connect, Plugin } from "vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readFileSync, writeFileSync } from "node:fs";
import { componentTagger } from "lovable-tagger";

/**
 * Prefer prerendered dist/<route>/index.html over SPA fallback to /index.html
 * so `vite preview` + curl see real blog HTML without JavaScript.
 * Also gzip text assets so local Lighthouse matches production compression.
 */
function prerenderedHtmlPreview(): Plugin {
  return {
    name: "prerendered-html-preview",
    configurePreviewServer(server) {
      server.middlewares.use((req: Connect.IncomingMessage, res, next) => {
        const accept = req.headers["accept-encoding"] || "";
        const wantsGzip = String(accept).includes("gzip");
        const urlPath = (req.url || "/").split("?")[0];
        const dist = path.resolve(server.config.root, server.config.build.outDir);

        if (!path.extname(urlPath)) {
          const rel =
            urlPath === "/"
              ? "index.html"
              : path.join(urlPath.replace(/^\/+|\/+$/g, ""), "index.html");
          const candidate = path.join(dist, rel);
          if (fs.existsSync(candidate)) {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            const body = fs.readFileSync(candidate);
            if (wantsGzip) {
              res.setHeader("Content-Encoding", "gzip");
              res.end(zlib.gzipSync(body));
            } else {
              res.end(body);
            }
            return;
          }
          return next();
        }

        // Compress JS/CSS/SVG/JSON/XML for fair local Lighthouse scores.
        if (
          wantsGzip &&
          /\.(js|css|svg|json|xml|txt|mjs)$/i.test(urlPath)
        ) {
          const filePath = path.join(dist, urlPath.replace(/^\//, ""));
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const types: Record<string, string> = {
              ".js": "application/javascript; charset=utf-8",
              ".mjs": "application/javascript; charset=utf-8",
              ".css": "text/css; charset=utf-8",
              ".svg": "image/svg+xml",
              ".json": "application/json",
              ".xml": "application/xml",
              ".txt": "text/plain; charset=utf-8",
            };
            res.setHeader("Content-Type", types[ext] || "application/octet-stream");
            res.setHeader("Content-Encoding", "gzip");
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
            res.end(zlib.gzipSync(fs.readFileSync(filePath)));
            return;
          }
        }

        return next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "NEXT_PUBLIC_");
  if (!process.env.NEXT_PUBLIC_SITE_URL && env.NEXT_PUBLIC_SITE_URL) {
    process.env.NEXT_PUBLIC_SITE_URL = env.NEXT_PUBLIC_SITE_URL;
  }
  const { siteUrl, defaultDescription } = await import("./src/lib/seo/config");
  const { organizationJsonLd } = await import("./scripts/seo-prerender-data.mjs");
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
      prerenderedHtmlPreview(),
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
          const escapeMeta = (value: string) =>
            value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
          const googleVerification = env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
          const bingVerification = env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
          const verificationTags = [
            googleVerification ? `<meta name="google-site-verification" content="${escapeMeta(googleVerification)}" />` : "",
            bingVerification ? `<meta name="msvalidate.01" content="${escapeMeta(bingVerification)}" />` : "",
          ]
            .filter(Boolean)
            .join("\n    ");
          return html
            .replace("</head>", `${verificationTags ? `${verificationTags}\n  ` : ""}</head>`)
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
    build: {
    cssCodeSplit: true,
    cssMinify: true,
    minify: "esbuild",
    sourcemap: false,
    target: "es2020",
    modulePreload: {
      polyfill: false,
      resolveDependencies(filename, deps) {
        // Homepage only needs react-vendor; defer radix/markdown/motion/query
        // until their routes or widgets actually import them.
        if (filename.includes("index") && filename.endsWith(".js")) {
          return deps.filter((dep) => dep.includes("react-vendor"));
        }
        return deps.filter(
          (dep) =>
            !dep.includes("markdown") &&
            !dep.includes("motion") &&
            !dep.includes("query"),
        );
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("react-router") || id.includes("react-dom") || id.includes("/react/")) {
            return "react-vendor";
          }
          if (id.includes("@tanstack")) return "query";
          if (id.includes("marked") || id.includes("gray-matter")) return "markdown";
        },
      },
    },
    },
  };
});
