// src/index.js
import { pathToFileURL } from "url";
import { loadConfig } from "./config.js";
import { cleanOutputDir } from "./file-utils.js";
import { generateSitemap } from "./sitemap.js";
import { buildRoutes } from "./route-traversal.js";

async function main() {
  const config = await loadConfig();

  const { routes } = await import(pathToFileURL(config.routesFile).href);
  const { renderLayout } = await import(pathToFileURL(config.layout).href);

  console.log("[Domo-SSG] Starting Domo SSG build...");

  cleanOutputDir(config.outDir, config.exclude);

  await buildRoutes(routes, renderLayout);

  generateSitemap(config.outDir, config.baseUrl, config.exclude);

  console.log("[Domo-SSG] build complete!");
}

main().catch((error) => {
  console.error("[Domo-SSG] build failed:", error);
  process.exit(1);
});
