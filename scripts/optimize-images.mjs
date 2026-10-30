/**
 * Generate responsive WebP + AVIF variants for blog and team images.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { ROOT } from "./load-env.mjs";

const BLOG_DIR = path.join(ROOT, "public", "images", "blog");
const PUBLIC_DIR = path.join(ROOT, "public");
const WIDTHS = [640, 960, 1400];
const TEAM_WIDTHS = [160, 320, 640];

async function writeVariants(input, outDir, baseName, widths) {
  const written = [];
  const meta = await sharp(input).metadata();
  for (const width of widths) {
    if (meta.width && meta.width < width) continue;
    const webpName = `${baseName}-${width}w.webp`;
    const avifName = `${baseName}-${width}w.avif`;
    const webpPath = path.join(outDir, webpName);
    const avifPath = path.join(outDir, avifName);

    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpPath);
    written.push(webpName);

    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 55 })
      .toFile(avifPath);
    written.push(avifName);
  }
  return written;
}

export async function optimizeBlogImages() {
  const written = [];

  if (fs.existsSync(BLOG_DIR)) {
    const files = fs
      .readdirSync(BLOG_DIR)
      .filter((f) => /\.webp$/i.test(f) && !/-\d+w\.(webp|avif)$/i.test(f));

    for (const file of files) {
      const input = path.join(BLOG_DIR, file);
      const base = file.replace(/\.webp$/i, "");
      written.push(...(await writeVariants(input, BLOG_DIR, base, WIDTHS)));
    }
  } else {
    console.warn("[optimize-images] No blog image directory");
  }

  // Team / brand portraits in public/*.webp
  const teamFiles = fs
    .readdirSync(PUBLIC_DIR)
    .filter((f) => /\.webp$/i.test(f) && !/-\d+w\./i.test(f) && !/^og-image/i.test(f));

  for (const file of teamFiles) {
    const input = path.join(PUBLIC_DIR, file);
    const base = file.replace(/\.webp$/i, "");
    written.push(...(await writeVariants(input, PUBLIC_DIR, base, TEAM_WIDTHS)));
  }

  // Drop unused HEIC originals that hurt deploys / crawlers
  const heic = path.join(PUBLIC_DIR, "Aliza.HEIC");
  if (fs.existsSync(heic)) {
    fs.unlinkSync(heic);
    console.log("[optimize-images] Removed unused Aliza.HEIC");
  }

  console.log(`[optimize-images] Wrote ${written.length} responsive variants`);
  return written;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  optimizeBlogImages().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
