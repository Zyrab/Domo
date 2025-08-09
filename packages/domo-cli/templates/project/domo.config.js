// domo.config.js
export default {
    outDir: "./public",
    routesFile: "./src/pages/index.js",
    layout: "./src/components/layout/static-layout.js",
    author: "Zyrab",
    baseUrl: "https://www.zyrab.dev",
    lang: "en",
    theme: "dark",
    exclude: ["js", "css", "app-ads.txt", "assets", "data"],
    assets: {
        styles: ["base.css", "utils.css"],
        fonts: [{ href: "cutivemono.woff2", preload: true }],
        favicon: "favicon.ico",
    },
};
