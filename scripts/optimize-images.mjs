/**
 * Generate responsive WebP variants for blog images under public/images/blog.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { ROOT } from "./load-env.mjs";

const BLOG_DIR = path.join(ROOT, "public", "images", "blog");
const WIDTHS = [640, 960, 1400];

export async function optimizeBlogImages() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn("[optimize-images] No blog image directory");
    return [];
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.webp$/i.test(f) && !/-\d+w\.webp$/i.test(f));

  const written = [];
  for (const file of files) {
    const input = path.join(BLOG_DIR, file);
    const base = file.replace(/\.webp$/i, "");
    const meta = await sharp(input).metadata();
    for (const width of WIDTHS) {
      if (meta.width && meta.width < width) continue;
      const outName = `${base}-${width}w.webp`;
      const outPath = path.join(BLOG_DIR, outName);
      await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
      written.push(outName);
    }
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
