// src/config.js
import path from "path";
import { pathToFileURL } from "url";
import { normalizeAssets } from "./utils.js";

let mergedConfig = null;

export async function loadConfig() {
  if (mergedConfig) return mergedConfig;
  const userConfigPath = path.resolve(process.cwd(), "domo.config.js");

  // Default configuration values
  const defaultConfig = {
    outDir: "./dist",
    routesFile: "./routes.js",
    layout: "./layout.js",
    lang: "en",
    author: "Domo",
    exclude: ["css", "js", "assets", "robots.txt", "admin"],
    baseUrl: "http://localhost:3000",
    assets: {
      styles: [],
      scripts: [],
      fonts: [],
      favicon: "",
    },
  };

  let userConfig = {};
  try {
    const importedConfig = await import(pathToFileURL(userConfigPath).href);
    userConfig = importedConfig.default || importedConfig;
  } catch (error) {
    console.warn(`⚠️  No custom config file found at ${configFilePath}. Using default settings.`);
  }
  mergedConfig = {
    ...defaultConfig,
    ...userConfig,
    outDir: path.resolve(process.cwd(), userConfig.outDir || defaultConfig.outDir),
    routesFile: path.resolve(process.cwd(), userConfig.routesFile || defaultConfig.routesFile),
    layout: path.resolve(process.cwd(), userConfig.layout || defaultConfig.layout),
    assets: {
      ...userConfig?.assets,
      styles: normalizeAssets(userConfig.assets?.styles || defaultConfig.assets.styles),
      scripts: normalizeAssets(userConfig.assets?.scripts || defaultConfig.assets.scripts),
      fonts: normalizeAssets(userConfig.assets?.fonts || defaultConfig.assets.fonts),
    },
  };
  return mergedConfig;
}

export function getConfig() {
  if (!mergedConfig) {
    throw new Error("Interal Error: Config has not been loaded yet. Call loadConfig() first.");
  }
  return mergedConfig;
}
