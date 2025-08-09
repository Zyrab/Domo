// loadJson.js
export async function loadJson(path) {
  if (typeof window === "undefined") {
    // Node / SSG context
    const { promises: fs } = await import("fs");
    const { resolve } = await import("path");
    const filePath = resolve(process.cwd(), path.replace(/^\/+/, ""));
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } else {
    // Browser context
    const res = await fetch(path);
    return await res.json();
  }
}
