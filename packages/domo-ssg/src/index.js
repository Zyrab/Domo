// src/index.js
import { pathToFileURL } from "url";
import { loadConfig } from "./config.js";
import { cleanOutputDir, copyStaticFolder, scanRoutes } from "./file-utils.js";
import { generateSitemap } from "./sitemap.js";
import { buildRoutes } from "./route-traversal.js";
import { registry } from "./Registry.js";
import { join } from "path";

async function main() {
  const config = await loadConfig();
  const routePaths = scanRoutes(config.scanDir);

  registry.setRoutes(routePaths);
  const { routes } = await import(pathToFileURL(config.routesFile).href);
  const { renderLayout } = await import(pathToFileURL(config.layout).href);

  console.log("[Domo-SSG] Starting Domo SSG build...");

  cleanOutputDir(config.outDir, config.exclude);
  config.assetsDir.forEach((f) => copyStaticFolder(join(process.cwd(), f.current), join(config.outDir, f.final)));

  await buildRoutes(routes, renderLayout);

  generateSitemap(config.outDir, config.baseUrl, config.exclude);

  console.log("[Domo-SSG] build complete!");
}

main().catch((error) => {
  console.error("[Domo-SSG] build failed:", error);
  process.exit(1);
});

// import { writeFileSync } from "fs";
// import { build } from "esbuild";

// // Your existing plugin to cleanly handle Domo
// const rewriteDomoPlugin = {
//   name: "rewrite-domo",
//   setup(build) {
//     build.onResolve({ filter: /^@zyrab\/domo$|^domo$/ }, () => {
//       return { path: "/js/domo.runtime.js", external: true };
//     });
//   },
// };

// export async function preBundleAssets(routePaths, outputDir) {
//   // Grab all file paths from your registry/scanner
//   const allSourceFiles = Object.values(routePaths);

//   const result = await build({
//     entryPoints: allSourceFiles,
//     outdir: join(outputDir, "js"),
//     entryNames: "[dir]/[name]-[hash]", // e.g., islands/header-A1B2C.js
//     format: "esm",
//     bundle: true,
//     splitting: true,
//     minify: true, // Minify everything!
//     metafile: true,
//     packages: "external",
//     plugins: [rewriteDomoPlugin],
//   });

//   // --- GENERATE THE MANIFEST ---
//   const manifest = {};
//   const outputs = result.metafile.outputs;

//   for (const [outputPath, info] of Object.entries(outputs)) {
//     // If this output file was generated from an entry point, map it!
//     if (info.entryPoint) {
//       // Normalize paths for lookup
//       const originalPath = info.entryPoint.replace(/\\/g, "/");
//       const finalBrowserPath = `/${outputPath.replace(/\\/g, "/").split("/").slice(1).join("/")}`;

//       manifest[originalPath] = finalBrowserPath;
//     }
//   }

//   // Save manifest so the SSG can use it
//   writeFileSync(join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));
//   console.log("[Domo-SSG] Client assets pre-bundled. Manifest generated.");

//   return manifest;
// }
