import Router from "../../../packages/domo-router/src/core.js";
import createHeader from "./header.js";
export async function renderLayout(content, data) {
  const {
    title,
    description,
    descriptionOG,
    scripts,
    styles,
    fonts,
    favicon,
    baseUrl,
    canonical,
    lang,
    author,
    type,
    ogImage,
    theme,
  } = data;

  const canonicalUrl = baseUrl + (canonical || Router.path());

  const scriptTags = scripts
    .map((file) =>
      file.preload
        ? `<link rel="preload" as="script" href="/js/${file.href}">
          <script defer src="/js/${file.href}"></script>`
        : `<script defer src="/js/${file.href || file}"></script>`
    )
    .join("\n");

  const styleTags = styles
    .map((style) =>
      style.preload
        ? `<link rel="preload" href="/css/${style.href}" as="style" onload="this.rel='stylesheet'">`
        : `<link rel="stylesheet" href="/css/${style.href || style}">`
    )
    .join("\n");

  const fontTags = fonts
    .map((font) =>
      font.preload
        ? `<link rel="preload" href="/assets/fonts/${font.href}" as="font" type="font/woff2" crossorigin="anonymous">`
        : `<link rel="stylesheet" href="/assets/fonts/${font.href || font}">`
    )
    .join("\n");

  const themeColor =
    theme === "auto" || theme === "toggle"
      ? ` <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
          <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
          <meta name="color-scheme" content="light dark">`
      : ` <meta name="theme-color" content="${theme === "dark" ? "#000000" : "#ffffff"}">
          <meta name="color-scheme" content="${theme}">`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="author" content="${author}">
  <meta name="robots" content="index, follow">
  
  <!-- Canonical -->
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Social: OpenGraph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${descriptionOG || description}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${baseUrl}${Router.path()}">
  <meta property="og:type" content="${type || "website"}">

  <!-- Social: Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${descriptionOG || description}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- Favicon and Touch Icon -->
  <link rel="icon" href="/assets/${favicon}" type="image/x-icon">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">

  <!-- Theme Colors -->
  ${themeColor}

  <!-- Performance -->
  ${fontTags}
  ${styleTags}

  <!-- Privacy & Security -->
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta http-equiv="Permissions-Policy" content="interest-cohort=()">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'">

  
  <!-- Scripts: preload or noraml injection -->
  ${scriptTags}
  
</head>
<body>
  ${createHeader()}
  <main>
    ${content.build()}
  </main>
</body>
</html>`;
}
