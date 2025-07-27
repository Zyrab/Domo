import fs from "fs";
import path from "path";

/**
 * Generates an XML sitemap with lastmod, priority, and changefreq
 * using automatic heuristics.
 *
 * @param {string} outputDir - The directory with generated HTML files.
 * @param {string} baseUrl - The website base URL (e.g., "https://example.com").
 * @param {string[]} exclude - Array of file/folder names to exclude from the sitemap.
 */
export function generateSitemap(outputDir, baseUrl, exclude = []) {
  const urls = [];

  const rootIndex = path.join(outputDir, "index.html");
  if (fs.existsSync(rootIndex)) {
    const stats = fs.statSync(rootIndex);
    urls.unshift({
      loc: `${baseUrl}/`,
      lastmod: stats.mtime.toISOString(),
      changefreq: "daily",
      priority: "1.0",
    });
  }

  function walk(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (exclude.includes(entry.name)) continue;

      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const indexPath = path.join(fullPath, "index.html");

        if (fs.existsSync(indexPath)) {
          let relative = path.relative(outputDir, fullPath);
          let urlPath = "/" + relative.replace(/\\/g, "/");

          // Root correction
          if (urlPath === "//" || urlPath === "/.") {
            urlPath = "/";
          }

          const stats = fs.statSync(indexPath);
          const lastmod = stats.mtime.toISOString();

          // Priority & changefreq based on URL depth
          const depth = urlPath.split("/").filter(Boolean).length;
          const priority = depth === 0 ? "1.0" : (1 - Math.min(depth * 0.2, 0.8)).toFixed(1);
          const changefreq = depth === 0 ? "daily" : depth === 1 ? "weekly" : "monthly";

          urls.push({ loc: `${baseUrl}${urlPath}`, lastmod, priority, changefreq });
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
    ({ loc, lastmod, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(outputDir, "sitemap.xml"), xml, "utf8");
  console.log(`Generated sitemap.xml at: ${path.join(outputDir, "sitemap.xml")}`);
}
