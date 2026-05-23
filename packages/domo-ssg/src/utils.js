import Router from "@zyrab/domo-router";

/**
 * Normalizes a mixed list of asset descriptors (strings, objects, nested arrays)
 * into a flat, deduplicated array of { href, ...rest } objects.
 *
 * Accepts any combination of:
 *   - strings: "global.css"
 *   - objects with href: { href: "global.css", preload: true }
 *   - objects with src (legacy): { src: "script.js" }
 *   - arrays of any of the above, at any nesting depth
 *   - null / undefined (skipped)
 *
 * Deduplication: if the same href appears in both global assets and a route's
 * specific assets, it is only included once (first occurrence wins).
 */
export function normalizeAssets(...groups) {
  // Accept either normalizeAssets(a, b, c) or normalizeAssets([a, b, c])
  const input = groups.length === 1 && Array.isArray(groups[0]) ? groups[0] : groups;
  // console.log(groups);

  // Flatten everything to a single 1-D list, regardless of nesting depth
  const flat = input.flat(Infinity);

  const seen = new Set();
  const result = [];

  for (const item of flat) {
    if (item === null || item === undefined) continue;

    let normalized;

    if (typeof item === "string") {
      if (!item) continue;
      normalized = { href: item };
    } else if (typeof item === "object") {
      if (item.href) {
        normalized = item;
      } else if (item.src) {
        // Legacy { src } shape — promote to { href }
        const { src, ...rest } = item;
        normalized = { ...rest, href: src };
      } else {
        continue; // object with no usable path
      }
    } else {
      continue;
    }

    // Deduplicate by href — first occurrence (usually route-specific) wins
    if (seen.has(normalized.href)) continue;
    seen.add(normalized.href);
    result.push(normalized);
  }

  return result;
}

export async function tryGenerateOgImage(routeMeta, ogOutputPath, path) {
  if (!routeMeta.generateOgImage) return;
  const slug = Router.info().segments.at(-1).slice(1);

  try {
    const { generateOgImage: generate } = await import("@zyrab/domo-og");
    const ogPath = generate({ ...routeMeta, ogOutputPath, slug, routeKey: path });

    return ogPath;
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND" || err.message.includes("Cannot find module")) {
      console.warn(`[Domo-SSG] OG image generation skipped for "${slug}" — install 'domo-og' to enable this feature.`);
    } else {
      console.warn(`[Domo-SSG] OG image generation failed for "${slug}":\n${err.stack}`);
    }
  }
}

export function formatComponentName(funcName) {
  if (!funcName) return "";

  // Helper to turn camelCase or PascalCase into kebab-case
  const toKebab = (str) => {
    return str
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .replace(/^-/, ""); // Catch accidental leading dashes
  };

  // Rule 1: UI Components (Start with "create")
  if (funcName.startsWith("create")) {
    const strippedName = funcName.replace(/^create/, "");
    return toKebab(strippedName);
  }

  // Rule 2: Handlers (Everything else gets a "handle-" prefix)
  else {
    const baseName = toKebab(funcName);

    // Just a safety check in case you occasionally name the function "handleSomething"
    if (baseName.startsWith("handle-")) {
      return baseName;
    }

    return `handle-${baseName}`;
  }
}
