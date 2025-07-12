// src/route-handler.js
import Router from "@zyrab/domo-router";
import { writeHTML } from "./file-utils.js";
import { writeJs } from "./event-utils.js";

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
 * @param {string} outputDir - The base output directory for generated files.
 * @returns {Promise<void>}
 */

export async function handleRoute({ path, props, component, script, meta = {} }, renderLayout, outputDir) {
  try {
    // Set router info for server-side context
    Router.setInfo(path, props);

    // Calculate base depth for relative paths in layout if needed
    const baseDepth = path === "/" ? 0 : path.split("/").filter(Boolean).length;

    // Render the component content
    const content = await component(props);

    // --- Write JS file ---
    const eScript = writeJs(content, outputDir, path);
    let allScript = [];
    if (Array.isArray(script) && script.length > 0) {
      allScript.push(...script);
    }
    if (eScript && typeof eScript === "string" && eScript.trim() !== "") {
      allScript.push(eScript);
    }

    // Render the full HTML layout
    const html = await renderLayout(content, {
      title: meta.title || "",
      description: meta.description || "",
      script: allScript,
      baseDepth,
    });

    // Write the generated HTML to a file
    writeHTML(outputDir, path, html);
  } catch (e) {
    console.warn(`⚠️  Error rendering ${path}:\n${e.stack}`);
  }
}
