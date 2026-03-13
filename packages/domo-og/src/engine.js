import { Resvg, initWasm } from "@resvg/resvg-wasm";
import { readFile, readdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
import fs from "fs";
import { fetchAsBuffer } from "./fetchers.js";

let isWasmInitialized = false;
let cachedFontBuffer = null;

async function initEngine() {
  if (isWasmInitialized) return;

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const wasmPath = join(__dirname, "../node_modules/@resvg/resvg-wasm/index_bg.wasm");
    const wasmBuffer = await readFile(wasmPath);

    await initWasm(wasmBuffer);
    isWasmInitialized = true;
  } catch (error) {
    console.error("[Domo-OG] Failed to initialize resvg WASM engine:", error);
    throw error;
  }
}
async function getFontBuffer(fontSource, defaultFontDir) {
  if (cachedFontBuffer) return cachedFontBuffer;
  if (fontSource) {
    try {
      const { buffer } = await fetchAsBuffer(fontSource);
      cachedFontBuffer = buffer;
      return cachedFontBuffer;
    } catch (error) {
      throw new Error(`[Domo-OG] Font Loading Error: Could not load the provided font. ${error.message}`);
    }
  }

  if (fs.existsSync(defaultFontDir)) {
    const files = await readdir(defaultFontDir);
    const fontFile = files.find((file) => {
      const ext = extname(file).toLowerCase();
      return ext === ".ttf" || ext === ".otf" || ext === ".woff";
    });

    if (fontFile) {
      const targetFontPath = join(defaultFontDir, fontFile);
      cachedFontBuffer = await readFile(targetFontPath);
      return cachedFontBuffer;
    }
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fallbackFontPath = join(__dirname, "../fonts/default.otf");

  if (fs.existsSync(fallbackFontPath)) {
    cachedFontBuffer = await readFile(fallbackFontPath);
    return cachedFontBuffer;
  }

  throw new Error(
    "[Domo-OG] Critical Error: No font file found! The WASM engine requires a .ttf, .otf, or .woff file to draw text. " +
    "Provide a 'fontPath' URL/path, place a font inside " +
    defaultFontDir +
    ", or ensure " + fallbackFontPath + " exists.",
  );
}

export async function renderToPng(svgString, options = {}) {
  await initEngine();

  const { fontPath, defaultFontDir } = options;
  const fontBuffer = await getFontBuffer(fontPath, defaultFontDir);

  const opts = {
    fitTo: { mode: "width", value: 1200 },
    font: {
      loadSystemFonts: false,
      fontBuffers: [fontBuffer],
    },
  };

  const resvg = new Resvg(svgString, opts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
}
