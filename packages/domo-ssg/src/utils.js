import Router from "@zyrab/domo-router";
export function normalizeAssets(arr) {
  if (!arr) return []; // Handle null/undefined safely
  const flatArray = Array.isArray(arr) ? arr.flat() : [arr]; // Support single string/object
  const result = [];

  for (const item of flatArray) {
    if (!item) continue; // Skip null/undefined/false
    if (typeof item === "string") {
      result.push({ href: item });
    } else if (typeof item === "object" && item.href) {
      result.push(item);
    } else if (typeof item === "object" && !item.href) {
      // For objects without href, attempt to normalize keys like { src: "..." }
      if (item.src) result.push({ ...item, href: item.src });
    }
  }

  return result;
}

export async function tryGenerateOgImage(routeMeta, outputDir) {
  if (!routeMeta.generateOgImage) return;
  const slug = Router.info().segments.at(-1).slice(1);

  try {
    const { generateOgImage: generate } = await import("@zyrab/domo-og");

    const ogPath = await generate({
      ...routeMeta,
      outputDir,
      slug,
    });

    return ogPath;
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND" || err.message.includes("Cannot find module")) {
      console.warn(`⚠️  OG image generation skipped for "${slug}" — install 'domo-og' to enable this feature.`);
    } else {
      console.warn(`⚠️  OG image generation failed for "${slug}":\n${err.stack}`);
    }
  }
}
