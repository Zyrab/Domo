import path from "path";
import fs from "fs";
import { hash } from "./utils.js";
import { getManifest, requestManifestWrite, flushManifestImmediately } from "./manifest.js";
import { renderToPng } from "./engine.js";
import { buildSvgFromConfig } from "./template-builder.js";
import { getDefaultConfig } from "./default-config.js";

let outputDirEnsured = false;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function generateOgImage(options) {
  const { slug, template, ogOutputPath, routeKey, ...flatParams } = options;

  if (!ogOutputPath) throw new Error("[Domo-OG] 'ogOutputPath' is required to save the generated images.");

  const key = routeKey || slug;
  let finalSvgContent;
  let fontPathToUse = null;

  let activeTemplate = template;
  if (!activeTemplate) activeTemplate = getDefaultConfig();

  fontPathToUse = activeTemplate.fontPath;
  finalSvgContent = await buildSvgFromConfig(activeTemplate, flatParams);

  const contentHash = hash(finalSvgContent);
  const manifestPath = path.join(ogOutputPath, "og-cache.json");
  const manifest = getManifest(manifestPath);

  if (manifest[key]?.hash === contentHash) {
    return manifest[key].path;
  }

  const uniqueId = hash(routeKey || slug);
  const hashedPath = `${slug}-${uniqueId}`;
  const pngRelativePath = `assets/og-images/${hashedPath}.png`;
  const pngPath = path.join(ogOutputPath, pngRelativePath);

  if (!outputDirEnsured) {
    ensureDir(path.join(ogOutputPath, "assets/og-images"));
    outputDirEnsured = true;
  }
  const fallbackFontFolder = path.join(ogOutputPath, "assets/fonts");
  try {
    const pngBuffer = await renderToPng(finalSvgContent, {
      fontPath: fontPathToUse,
      defaultFontDir: fallbackFontFolder,
    });
    fs.writeFileSync(pngPath, pngBuffer);

    manifest[key] = {
      path: pngRelativePath,
      hash: contentHash,
      title: flatParams.title || slug,
    };
    requestManifestWrite();

    return pngRelativePath;
  } catch (error) {
    console.error(`[Domo-OG] Fatal error generating image for ${key}:`, error);
    throw error;
  }
}

export { flushManifestImmediately };
