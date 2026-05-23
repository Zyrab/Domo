import fs from "fs";
import path from "path";
import { existsSync, cpSync } from "fs";

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
  // console.log(`Generated: ${path.relative(outputDir, outPath)}`);
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
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

/**
 * Recursively copies a folder from source to destination.
 * @param {string} srcPath - The file to copy.
 * @param {string[]} destPath - A path to put copied file in.
 */
export function copyStaticFolder(srcPath, destPath) {
  // If the folder doesn't exist, just silently skip it
  if (!existsSync(srcPath)) return;

  try {
    // cpSync copies the whole folder and its contents synchronously
    cpSync(srcPath, destPath, { recursive: true });
    console.log(`[Domo-SSG] Copied static folder: ${srcPath} -> ${destPath}`);
  } catch (error) {
    console.error(`[Domo-SSG] Failed to copy ${srcPath}:`, error);
  }
}

/**
 * Recursively Scans the folders in a directory given and returns structure file with component export names and file paths.
 * @param {string} dir - The drectory to scan.
 */
export function scanRoutes(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const routes = {};

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      Object.assign(routes, scanRoutes(fullPath));
    } else {
      if (!entry.name.endsWith(".js")) continue;

      const fileName = path.basename(entry.name, ".js");

      routes[fileName] = fullPath;
    }
  }

  return routes;
}
