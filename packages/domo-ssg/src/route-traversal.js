// src/route-traversal.js
import { handleRoute, joinPaths } from "./route-handler.js";

/**
 * Recursively builds HTML files for all defined routes, including nested and dynamic routes.
 * @param {object} routes - The route configuration object.
 * @param {string} [parentPath=""] - The path accumulated from parent routes.
 * @param {object} [props={}] - Accumulated properties from parent dynamic routes.
 * @param {Function} renderLayout - The layout rendering function.
 * @param {string} outputDir - The base output directory.
 * @returns {Promise<void>}
 */
export async function buildRoutes(routes, parentPath = "", props = {}, renderLayout, outputDir) {
  for (const routeKey in routes) {
    const r = routes[routeKey];
    // Skip '/' if it's a child of another path (handled by parent's segment)
    if (parentPath !== "" && routeKey === "/") continue;

    // Handle dynamic routes with getDinamicList
    if (r.getDinamicList) {
      try {
        // Extract parameter name from dynamic segment (e.g., ":slug" -> "slug")
        const paramKey = routeKey.split(":").filter(Boolean).pop();
        // The last segment of the parent path is the slug for nested dynamic lists
        const slugParam = parentPath.split("/").filter(Boolean).pop();

        const list = await r.getDinamicList(slugParam);

        if (!Array.isArray(list) || list.length === 0) {
          console.warn(`⚠️  No items returned for dynamic route at ${joinPaths(parentPath, routeKey)}`);
          continue;
        }

        for (const item of list) {
          if (!item[paramKey]) {
            console.warn(
              `⚠️  Missing required parameter '${paramKey}' in item for dynamic route at ${joinPaths(
                parentPath,
                routeKey
              )}`
            );
            continue;
          }

          const segment = item[paramKey]; // Use the actual value from the item for the URL segment
          const meta = { title: item.title, description: item.description, ...item.meta }; // Merge item's meta with route's meta
          const routePath = joinPaths(parentPath, segment); // Full path for this specific dynamic item
          const childProps = { ...props, [paramKey]: segment, itemData: item }; // Pass item data as prop

          if (r.component) {
            await handleRoute(
              {
                path: routePath,
                props: childProps,
                script: r.script,
                component: r.component,
                meta,
              },
              renderLayout,
              outputDir
            );
          } else if (r.children?.["/"]?.component) {
            // If dynamic route has children with a default component
            await handleRoute(
              {
                path: routePath,
                props: childProps,
                script: r.children["/"].script,
                component: r.children["/"].component,
                meta: r.children["/"].meta || meta, // Children's meta takes precedence
              },
              renderLayout,
              outputDir
            );
            // Recursively build children of this dynamic item if they exist
            if (r.children) {
              await buildRoutes(r.children, routePath, childProps, renderLayout, outputDir);
            }
          } else {
            console.warn(
              `⚠️  Dynamic route at ${routePath} missing a 'component' or a default 'children["/"].component'.`
            );
          }
        }
      } catch (e) {
        console.warn(`⚠️  Skipped dynamic route generation for ${joinPaths(parentPath, routeKey)}: ${e.message}`);
      }
      continue; // Move to the next route key after handling dynamic list
    }

    // Handle static routes with a component
    if (r.component) {
      const routePath = joinPaths(parentPath, routeKey);
      await handleRoute(
        {
          path: routePath,
          props,
          script: r.script,
          component: r.component,
          meta: r.meta,
        },
        renderLayout,
        outputDir
      );
      // Continue to children if they exist for this static route
      if (r.children) {
        await buildRoutes(r.children, routePath, { ...props }, renderLayout, outputDir);
      }
      continue;
    }

    // Handle routes with only children (e.g., a folder route with no direct component, but an index component)
    if (r.children) {
      const routePath = joinPaths(parentPath, routeKey);
      // Render the default child component ('/') for this path if it exists
      if (r.children["/"]?.component) {
        await handleRoute(
          {
            path: routePath,
            props,
            script: r.children["/"].script,
            component: r.children["/"].component,
            meta: r.children["/"].meta,
          },
          renderLayout,
          outputDir
        );
      } else {
        console.warn(`⚠️  Route at ${routePath} has children but no default component ('/')`);
      }
      // Recursively build the children
      await buildRoutes(r.children, routePath, { ...props }, renderLayout, outputDir);
    }
  }
}
