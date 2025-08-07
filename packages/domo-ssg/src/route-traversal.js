// src/route-traversal.js
import { handleRoute, joinPaths } from "./route-handler.js";

/**
 * Recursively builds HTML files for all defined routes, including nested and dynamic routes.
 * @param {object} routes - The route configuration object.
 * @param {Function} renderLayout - The layout rendering function.
 * @param {string} [parentPath=""] - The path accumulated from parent routes.
 * @param {object} [props={}] - Accumulated properties from parent dynamic routes.
 */

const RESERVED_KEYS = new Set(["component", "meta", "scripts", "fonts", "styles", "routeParams"]);

export async function buildRoutes(routes, renderLayout, parentPath = "", props = {}) {
  for (const routeSegment of Object.keys(routes)) {
    if (RESERVED_KEYS.has(routeSegment)) continue;

    const routeNode = routes[routeSegment];
    const currentRoute = joinPaths(parentPath, routeSegment);
    // Handle dynamic routes
    if (routeNode.routeParams) {
      try {
        const paramName = routeSegment.replace("/:", "");
        const parentRouteName = parentPath.split("/").filter(Boolean).pop();
        const resolvedParams = await routeNode.routeParams(parentRouteName);

        if (!Array.isArray(resolvedParams) || resolvedParams.length === 0) {
          console.warn(`⚠️  No items returned for dynamic route at ${currentRoute}`);
          continue;
        }

        for (const item of resolvedParams) {
          const segment = item[paramName];
          if (!segment) {
            console.warn(`⚠️  Missing parameter:'${paramName}' in item for dynamic route at ${currentRoute}`);
            continue;
          }

          const routePath = joinPaths(parentPath, segment);
          const meta = { ...routeNode.meta, ...item };
          const childProps = { ...props, [paramName]: segment };

          if (routeNode.component) {
            await handleRoute({ ...routeNode, path: routePath, props: childProps, meta }, renderLayout);
            await buildRoutes(routeNode, renderLayout, routePath, childProps);
          }
        }
      } catch (e) {
        console.warn(`⚠️  Skipped dynamic route generation for ${currentRoute}: ${e.message}`);
      }
      continue;
    }
    // Handle static routes
    if (routeNode.component) {
      await handleRoute({ path: currentRoute, ...routeNode, props }, renderLayout);
      await buildRoutes(routeNode, renderLayout, currentRoute, { ...props });
    }
    if (!routeNode.component && Object.keys(routeNode).length > 0) {
      console.warn(`⚠️  Route "${currentRoute}" has no component but contains other data.`);
    }
  }
}
