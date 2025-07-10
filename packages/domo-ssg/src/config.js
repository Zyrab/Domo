// src/config.js
import path from "path";

/**
 * Loads and processes the SSG configuration.
 * @param {string} configFilePath - Absolute path to the user's config file.
 * @returns {Promise<object>} The resolved configuration object.
 */
export async function loadConfig(configFilePath) {
  // Default configuration values
  const defaultConfig = {
    outDir: "./dist",
    routesFile: "./routes.js", // Assuming a common name for routes
    layout: "./layout.js", // Assuming a common name for layout
    exclude: ["css", "js", "assets", "robots.txt", "admin"],
    baseUrl: "http://localhost:3000", // Default base URL for sitemap
  };

  let userConfig = {};
  try {
    const importedConfig = await import(configFilePath);
    userConfig = importedConfig.default || importedConfig;
  } catch (error) {
    console.warn(`⚠️  No custom config file found at ${configFilePath}. Using default settings.`);
  }

  // Merge user config with defaults
  const mergedConfig = { ...defaultConfig, ...userConfig };

  // Resolve paths relative to the current working directory of the build script
  // This assumes the config file itself specifies paths relative to its own location
  mergedConfig.outDir = path.resolve(process.cwd(), mergedConfig.outDir);
  mergedConfig.routesFile = path.resolve(process.cwd(), mergedConfig.routesFile);
  mergedConfig.layout = path.resolve(process.cwd(), mergedConfig.layout);

  return mergedConfig;
}
