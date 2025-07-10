// src/sitemap.js
import fs from "fs";
import path from "path";

/**
 * Generates an XML sitemap based on the generated HTML files in the output directory.
 * @param {string} outputDir - The directory containing the generated HTML files.
 * @param {string} baseUrl - The base URL of the website (e.g., "https://example.com").
 * @param {string[]} exclude - Array of file/folder names to exclude from the sitemap.
 * @returns {void}
 */
export function generateSitemap(outputDir, baseUrl, exclude) {
  const urls = [];

  function walk(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (exclude.includes(entry.name)) continue;

      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const indexPath = path.join(fullPath, "index.html");
        if (fs.existsSync(indexPath)) {
          let relative = path.relative(outputDir, fullPath);
          // Convert Windows backslashes to forward slashes for URLs
          let urlPath = "/" + relative.replace(/\\/g, "/");
          // Handle root path specifically for sitemap
          if (urlPath === "//" || urlPath === "/.") {
            urlPath = "/";
          }
          urls.push(`${baseUrl}${urlPath}`);
        }
        walk(fullPath);
      }
    }
  }

  walk(outputDir);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(outputDir, "sitemap.xml"), xml, "utf8");
  console.log(`Generated sitemap.xml at: ${path.join(outputDir, "sitemap.xml")}`);
}
