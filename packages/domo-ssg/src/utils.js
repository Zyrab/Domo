import Router from "@zyrab/domo-router";

export function normalizeAssets(arr) {
  if (!arr) return [];
  const flatArray = Array.isArray(arr) ? arr.flat() : [arr];
  const result = [];

  for (const item of flatArray) {
    if (!item) continue;
    if (typeof item === "string") result.push({ href: item });
    else if (typeof item === "object" && item.href) result.push(item);
    else if (typeof item === "object" && !item.href) {
      if (item.src) result.push({ ...item, href: item.src });
    }
  }

  return result;
}

export async function tryGenerateOgImage(routeMeta, ogOutputPath, path) {
  if (!routeMeta.generateOgImage) return;
  const slug = Router.info().segments.at(-1).slice(1);

  try {
    const { generateOgImage: generate } = await import("@zyrab/domo-og");

    const ogPath = generate({
      ...routeMeta,
      ogOutputPath,
      slug,
      routeKey: path,
    });

    return ogPath;
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND" || err.message.includes("Cannot find module")) {
      console.warn(`[Domo-SSG] OG image generation skipped for "${slug}" — install 'domo-og' to enable this feature.`);
    } else {
      console.warn(`[Domo-SSG] OG image generation failed for "${slug}":\n${err.stack}`);
    }
  }
}
