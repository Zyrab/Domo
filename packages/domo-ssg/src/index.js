// src/index.js
import { pathToFileURL } from "url";
import { loadConfig } from "./config.js";
import { cleanOutputDir } from "./file-utils.js";
import { generateSitemap } from "./sitemap.js";
import { buildRoutes } from "./route-traversal.js";

async function main() {
  const config = await loadConfig();

  // Import layout and route tree using pathToFileURL and .href for dynamic imports
  const { routes } = await import(pathToFileURL(config.routesFile).href);
  const { renderLayout } = await import(pathToFileURL(config.layout).href);

  console.log("🚀 Starting Domo SSG build...");
  console.log(`📁 Output directory: ${config.outDir}`);
  console.log(`🗺️  Routes file: ${config.routesFile}`);
  console.log(`🧩  Layout file: ${config.layout}`);

  // 1. Clean the output directory
  cleanOutputDir(config.outDir, config.exclude);

  // 2. Build all routes recursively
  await buildRoutes(routes, renderLayout);

  // 3. Generate sitemap
  generateSitemap(config.outDir, config.baseUrl, config.exclude);

  console.log("✅ Domo SSG build complete!");
}

// Execute the build process
main().catch((error) => {
  console.error("❌ Domo SSG build failed:", error);
  process.exit(1); // Exit with a non-zero code to indicate failure
});
