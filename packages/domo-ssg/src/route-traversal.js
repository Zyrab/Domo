// src/route-traversal.js
import { handleRoute, joinPaths } from "./route-handler.js";

/**
 * Recursively builds HTML files for all defined routes, including nested and dynamic routes.
 * @param {object} routes - The route configuration object.
 * @param {Function} renderLayout - The layout rendering function.
 * @param {string} [parentPath=""] - The path accumulated from parent routes.
 * @param {object} [props={}] - Accumulated properties from parent dynamic routes.
 */
export async function buildRoutes(routes, renderLayout, parentPath = "", props = {}) {
  for (const routeSegment in routes) {
    const routeNode = routes[routeSegment];
    // Skip '/' if it's a child of another path (handled by parent's segment)
    if (parentPath !== "" && routeSegment === "/") continue;

    const currentRoute = joinPaths(parentPath, routeSegment);
    // Handle dynamic routes with routeParams
    if (routeNode.routeParams) {
      try {
        // Extract parameter name from dynamic segment (e.g., ":slug" -> "slug")
        const paramName = routeSegment.split(":").filter(Boolean).pop();
        // The last segment of the parent path is the slug for nested dynamic lists
        const parentRouteName = parentPath.split("/").filter(Boolean).pop();

        const resolvedParams = await routeNode.routeParams(parentRouteName);

        if (!Array.isArray(resolvedParams) || resolvedParams.length === 0) {
          console.warn(`⚠️  No items returned for dynamic route at ${currentRoute}`);
          continue;
        }

        for (const item of resolvedParams) {
          if (!item[paramName]) {
            console.warn(`⚠️  Missing required parameter '${paramName}' in item for dynamic route at ${currentRoute}`);
            continue;
          }

          const segment = item[paramName]; // Use the actual value from the item for the URL segment
          const meta = {
            title: item.title,
            description: item.description,
            type: item?.type,
            canonical: item?.canonical,
            ogImage: item?.ogImage,
            descriptionOG: item?.descriptionOG,
          }; // Merge item's meta with route's meta
          const routePath = joinPaths(parentPath, segment); // Full path for this specific dynamic item
          const childProps = { ...props, [paramName]: segment, itemData: item }; // Pass item data as prop

          if (routeNode.component) {
            await handleRoute({ ...routeNode, path: routePath, props: childProps, meta }, renderLayout);
          } else if (routeNode.children?.["/"]?.component) {
            // If dynamic route has children with a default component
            await handleRoute({ ...routeNode.children["/"], path: routePath, props: childProps, meta }, renderLayout);
            // Recursively build children of this dynamic item if they exist
            if (routeNode.children) {
              await buildRoutes(routeNode.children, renderLayout, routePath, childProps);
            }
          } else {
            console.warn(
              `⚠️  Dynamic route at ${routePath} missing a 'component' or a default 'children["/"].component'.`
            );
          }
        }
      } catch (e) {
        console.warn(`⚠️  Skipped dynamic route generation for ${currentRoute}: ${e.message}`);
      }
      continue; // Move to the next route key after handling dynamic list
    }

    // Handle static routes with a component
    if (routeNode.component) {
      await handleRoute({ path: currentRoute, ...routeNode, props }, renderLayout);
      // Continue to children if they exist for this static route
      if (routeNode.children) {
        await buildRoutes(routeNode.children, renderLayout, currentRoute, { ...props });
      }
      continue;
    }
    // Render the default child component ('/') for this path if it exists
    if (routeNode.children["/"]?.component) {
      await handleRoute({ path: currentRoute, ...routeNode.children["/"], props }, renderLayout);
    } else if (routeNode.children) {
      console.warn(`⚠️  Route at ${currentRoute} has children but no default component ('/')`);
    }
    // Recursively build the children
    await buildRoutes(routeNode.children, renderLayout, currentRoute, { ...props });
  }
}
