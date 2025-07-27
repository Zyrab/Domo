// domo.config.js
export default {
  outDir: "./dist",
  routesFile: "./routes.js",
  layout: "./layout.js",
  author: "Domo SSG",
  baseUrl: "https://www.domo.zyrab.dev",
  lang: "en",
  theme: "auto",
  exclude: ["js", "css", "app-ads.txt", "assets", "data"],
  assets: {
    scripts: ["test.js", "global.js", { href: "theme-toggle.js", preload: true }],
    styles: [{ href: "main.css", prefetch: false }, "hoora.css"],
    fonts: [{ href: "wohaha.woff2", preload: true }, "yasWemadeIt.woff2"],
    favicon: "path/to/fivicon.ico",
  },
};
