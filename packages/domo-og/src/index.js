import path from "path";
import os from "os";
import fs from "fs";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

import { getDefaultSvg } from "./svg-template.js";
import { logOnce, getTemplateHash, hash, formatTitleLines } from "./utils.js";
import { loadManifest, saveManifest } from "./manifest.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const platform = os.platform();
const binary = platform === "win32" ? "resvg.exe" : "resvg";
const rsvgPath = path.join(_dirname, `../bin/${platform}/${binary}`);
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Generates an Open Graph image (PNG) from a given SVG template with dynamic title injection.
 *
 * - Uses `resvg` binary to convert SVG to PNG.
 * - Caches outputs to avoid redundant rendering on unchanged content.
 * - Stores cache metadata in `og-cache.json`.
 * - Supports dynamic line-breaking via `formatTitleLines()`.
 * - Falls back to a default SVG template if none is provided.
 *
 * @function
 * @param {Object} options - OG image generation options.
 * @param {string} options.slug - Fallback filename base, not a unique identifier.
 * @param {string} options.title - Title text to insert into the SVG template.
 * @param {string} [options.svgTemplate] - SVG string containing `{{title}}` placeholder.
 * @param {string} [options.templateId] - Unique ID for the template; recommended for cache stability.
 * @param {string} options.outputDir - Absolute path to the build output directory.
 * @param {string} [options.routeKey] - Optional unique key to differentiate similar slugs.
 * @param {Object} [options.ogImageOptions] - Optional options to control line formatting.
 * @param {number} [options.ogImageOptions.x=600] - Horizontal text position (matches `x` in `<text>`).
 * @param {number} [options.ogImageOptions.maxLength=25] - Max characters per line before wrapping.
 * @param {number} [options.ogImageOptions.lineHeight=1.5] - Line spacing in `em` units.
 * @returns {string} Relative file path to the generated PNG image (e.g. `assets/og-images/slug-hash.png`)
 */
export function generateOgImage(oprions) {
  const { slug, title, svgTemplate, templateId, outputDir, routeKey, ogImageOptions = {} } = oprions;
  const key = routeKey || slug;

  // Determine template key: prefer stable templateId if given,
  // else fallback to hashed template string (cached for performance)
  const templateKey = templateId || (svgTemplate ? getTemplateHash(svgTemplate) : "default");

  if (!templateId && svgTemplate) {
    logOnce(
      "no-template-id",
      "🔥 [OG IMAGE] Warning: No 'templateId' provided. Using full template hash for caching which is slower. " +
        "To optimize builds, provide a stable 'templateId' that changes only when template changes."
    );
  }

  // Hash to detect changes: combines title + templateKey
  const contentHash = hash(title + templateKey);

  // Load manifest for caching info
  const manifestPath = path.join(outputDir, "og-cache.json");
  const manifest = loadManifest(manifestPath);

  // Return cached path if content hash matches
  if (manifest[key]?.hash === contentHash) {
    if (templateId)
      logOnce(
        "cache-hit",
        "🔥 [OG IMAGE] Using cached OG images. Cache invalidates if 'templateId' or content changes."
      );
    return manifest[key].path;
  }

  // Generate unique ID for file naming using routeKey + contentHash
  const uniqueId = hash(routeKey);
  const hashedPath = `${slug}-${uniqueId}`;
  const tempSvgPath = path.join(os.tmpdir(), `${hashedPath}.svg`);
  const pngRelativePath = `assets/og-images/${hashedPath}.png`;
  const pngPath = path.join(outputDir, pngRelativePath);

  // Prepare SVG content
  const svgContent = svgTemplate
    ? svgTemplate.replace("{{title}}", formatTitleLines(title, { ...(ogImageOptions || {}) }))
    : getDefaultSvg(title);

  ensureDir(pngPath);
  fs.writeFileSync(tempSvgPath, svgContent);

  // Render PNG from SVG
  execFileSync(rsvgPath, [tempSvgPath, pngPath]);
  fs.unlinkSync(tempSvgPath);

  // Update manifest cache
  manifest[key] = {
    path: pngRelativePath,
    hash: contentHash,
    title,
    templateId,
  };
  saveManifest(manifestPath, manifest);
  return pngRelativePath;
}
