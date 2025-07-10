// src/file-utils.js
import fs from "fs";
import path from "path";

/**
 * Ensures that the directory for a given file path exists.
 * Creates directories recursively if they don't.
 * @param {string} filePath - The full path to the file.
 * @returns {void}
 */
export function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

/**
 * Writes HTML content to a file in the output directory.
 * @param {string} outputDir - The base output directory.
 * @param {string} routePath - The URL path of the route (e.g., "/about", "/").
 * @param {string} html - The HTML content to write.
 * @returns {void}
 */
export function writeHTML(outputDir, routePath, html) {
  // Adjust output path for root (/) and 404 (*) routes
  const fileName = routePath === "/*" ? "404" : routePath === "/" ? "" : routePath;
  const outPath = path.join(outputDir, fileName, "index.html");
  ensureDir(outPath);
  fs.writeFileSync(outPath, html, "utf8");
  console.log(`Generated: ${path.relative(outputDir, outPath)}`);
}

/**
 * Cleans the output directory by removing all content except specified exclusions.
 * @param {string} outputDir - The directory to clean.
 * @param {string[]} exclude - An array of file/folder names to exclude from cleaning.
 * @returns {void}
 */
export function cleanOutputDir(outputDir, exclude) {
  if (fs.existsSync(outputDir)) {
    const entries = fs.readdirSync(outputDir);
    for (const entry of entries) {
      if (exclude.includes(entry)) continue;
      const entryPath = path.join(outputDir, entry);
      fs.rmSync(entryPath, { recursive: true, force: true });
    }
    console.log(`Cleaned output directory: ${outputDir}`);
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  }
}
