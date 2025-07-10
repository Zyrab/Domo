import Router from "../../../packages/domo-router/src/core.js";
import createHeader from "./header.js";
export async function renderLayout(content, { title, description, script, baseDepth = 0 }) {
  const prefix = "../".repeat(baseDepth);
  const routeInfo = Router.info();
  const fullUrl = "https://zyrab.dev" + routeInfo.base;
  const scriptTags = Array.isArray(script)
    ? script.map((file) => `<script defer src="${prefix}js/${file}"></script>`).join("\n")
    : script
    ? `<script defer src="${prefix}js/${script}"></script>`
    : "";
  return `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <meta name="description" content="${description}" />

      <meta name="robots" content="index, follow" />
      
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="Explore the work of Zyrab - tools, apps, and ideas, all in one place." />
      <meta property="og:image" content="https://zyrab.dev/assets/og-image.png" />
      <meta property="og:url" content="https://zyrab.dev" />
      <meta name="twitter:card" content="summary_large_image" />
      
      <link rel="icon" href="https://zyrab.dev/assets/favicon.ico" type="image/x-icon" />
      
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=VT323&display=swap" rel="stylesheet" />
      
      <link rel="stylesheet" href="${prefix}css/base.css" media="print" onload="this.media='all'" />
      <link rel="stylesheet" href="${prefix}css/utils.css" media="print" onload="this.media='all'" />
      
      <meta http-equiv="Permissions-Policy" content="interest-cohort=()" />
    </head>
    <body>
    ${createHeader()}
      <main>
        ${content}
      </main>
    </body>
    <script defer src="${prefix}js/theme-toggle.js"></script>
    ${scriptTags}
  </html>
  `;
}
