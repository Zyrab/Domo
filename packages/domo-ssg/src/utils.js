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
