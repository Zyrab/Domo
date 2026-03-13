import { readFile, stat } from "fs/promises";
import path from "path";

const MAX_BUILD_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_CACHE_ITEMS = 50;
const bufferCache = new Map();

export async function fetchAsBuffer(source) {
  if (bufferCache.has(source)) return bufferCache.get(source);

  try {
    let result;

    if (source.startsWith("http://") || source.startsWith("https://")) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(source, {
        signal: controller.signal,
        headers: { "User-Agent": "Domo-OG-Builder/1.0" },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`[Domo-OG] HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      if (arrayBuffer.byteLength > MAX_BUILD_FILE_SIZE) {
        throw new Error(`[Domo-OG] Remote file exceeds 20MB limit.`);
      }

      result = {
        buffer: Buffer.from(arrayBuffer),
        mimeType: response.headers.get("content-type") || "image/png",
      };
    } else {
      const resolvedPath = path.resolve(process.cwd(), source);

      const fileStats = await stat(resolvedPath);
      if (fileStats.size > MAX_BUILD_FILE_SIZE) {
        throw new Error(`[Domo-OG] Local file exceeds 20MB limit.`);
      }

      const buffer = await readFile(resolvedPath);

      let mimeType = "image/png";
      const ext = path.extname(resolvedPath).toLowerCase();
      if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
      if (ext === ".svg") mimeType = "image/svg+xml";
      if (ext === ".webp") mimeType = "image/webp";

      result = { buffer, mimeType };
    }

    if (bufferCache.size >= MAX_CACHE_ITEMS) {
      const oldestKey = bufferCache.keys().next().value;
      bufferCache.delete(oldestKey);
    }

    bufferCache.set(source, result);
    return result;
  } catch (error) {
    throw new Error(`[Domo-OG] Failed to load source '${source}'. Reason: ${error.message}`);
  }
}
export async function fetchImageAsBase64(source) {
  const { buffer, mimeType } = await fetchAsBuffer(source);
  const base64String = buffer.toString("base64");
  return `data:${mimeType};base64,${base64String}`;
}
