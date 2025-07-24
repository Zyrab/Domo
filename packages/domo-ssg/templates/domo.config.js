// domo.config.js
export default {
  outDir: "./dist",
  routesFile: "./examples/routes.js",
  layout: "./examples/components/layout/static-layout.js",
  baseUrl: "www.zyrab.dev",
  author: "Zyrab this works",
  lang: "en",
  exclude: ["js", "css", "app-ads.txt", "assets", "data"],
  assets: {
    scripts: ["test.js", "global.js"],
    styles: [{ href: "main.css", preload: false }, "hoora.css"],
    fonts: [{ href: "wohaha.woff2", preload: true }, "yasWemadeIt.woff2"],
    favicon: "path/to/fivicon.ico",
  },
};
