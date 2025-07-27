// src/route-handler.js
import Router from "@zyrab/domo-router";
import { getConfig } from "./config.js";
import { writeHTML } from "./file-utils.js";
import { writeJs } from "./event-utils.js";
import { normalizeAssets } from "./utils.js";

/**
 * Helper to join URL path segments correctly.
 * @param {...string} segments - Path segments to join.
 * @returns {string} The normalized joined path.
 */
export function joinPaths(...segments) {
  let pathStr = segments
    .filter(Boolean)
    .map((s) => String(s).replace(/(^\/+|\/+$)/g, ""))
    .join("/");

  return "/" + pathStr.replace(/\/+/g, "/");
}
/**
 * Handles the rendering and writing of a single route's HTML file.
 * @param {object} routeConfig - Configuration for the current route.
 * @param {string} routeConfig.path - The full URL path for this route (e.g., "/about", "/blog/post-1").
 * @param {object} routeConfig.props - Properties to pass to the component.
 * @param {Function} routeConfig.component - The component function that returns an HTMLElement or string.
 * @param {string} [routeConfig.script] - Optional script to include in the layout.
 * @param {object} [routeConfig.meta={}] - Optional metadata for the page (title, description).
 * @param {Function} renderLayout - The layout rendering function from the user's config.
 * @returns {Promise<void>}
 */

export async function handleRoute(params, renderLayout) {
  const { outDir, baseUrl, lang, author, theme, assets } = getConfig();
  const { path, props = {}, component, scripts = [], styles = [], fonts = [], meta = {} } = params;
  try {
    // Set router info for server-side context
    Router.setInfo(path, props);

    // Render the component content
    const content = await component(props);

    // --- Write JS file ---
    const embededScript = writeJs(content, outDir, path);
    // console.log([...styles, ...assets.styles]);
    const fontPaths = normalizeAssets([fonts, assets.fonts]);
    const stylePaths = normalizeAssets([styles, assets.styles]);
    const scriptPaths = normalizeAssets([embededScript, scripts, assets.scripts]);
    // Render the full HTML layout
    const html = await renderLayout(content, {
      scripts: scriptPaths,
      styles: stylePaths,
      fonts: fontPaths,
      favicon: assets?.favicon,
      baseUrl,
      lang,
      author,
      theme,
      ...meta,
    });

    // Write the generated HTML to a file
    writeHTML(outDir, path, html);
  } catch (e) {
    console.warn(`⚠️  Error rendering ${path}:\n${e.stack}`);
  }
}
