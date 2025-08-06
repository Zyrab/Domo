// domo.config.js
export default {
  outDir: "./dist",
  routesFile: "./examples/routes.js",
  layout: "./examples/components/layout/static-layout.js",
  author: "Zyrab this works",
  baseUrl: "https://www.zyrab.dev",
  lang: "en",
  theme: "auto",
  exclude: ["js", "css", "app-ads.txt", "assets", "data", "og-cache.json"],

  assets: {
    scripts: ["test.js", "global.js", { href: "theme-toggle.js", preload: true }],
    styles: [{ href: "main.css", prefetch: false }, "hoora.css"],
    fonts: [{ href: "wohaha.woff2", preload: true }, "yasWemadeIt.woff2"],
    favicon: "path/to/fivicon.ico",
  },
};
