# @zyrab/domo-ssg

**Minimal static site generator (SSG) for Domo**  
Write JavaScript templates using [@zyrab/domo](https://www.npmjs.com/package/@zyrab/domo), define routes and layouts, and generate static HTML files with optional event hydration.

---

## Features

- Declarative page structure with `Domo` and `DomoSVG`
- Simple nested route tree (`routes.js`)
- Custom layout wrapper (`layout.js`)
- Virtual DOM-like output (no DOM dependency during build)
- Hydration-ready: automatic inline scripts for events
- Built-in cleanup and sitemap generation

---

## Installation

```bash
pnpm add -D @zyrab/domo-ssg
```

Note: Use in a pnpm monorepo if you're working with other Domo packages like @zyrab/domo or @zyrab/domo-router.

## Usage

### 1. Scaffold basic structure

```bash
pnpm exec domo-ssg-init
```

This will create:

```js
domo.config.js;
routes.js;
layout.js;
```

### 2. Add a script to your root package.json

```json
{
  "scripts": {
    "build": "pnpm --filter @zyrab/domo-ssg exec node src/index.js"
  }
}
```

### 3. Run the generator

```bash
pnpm build
```

# Project Structure

| File             | Purpose                             |
| ---------------- | ----------------------------------- |
| `routes.js`      | Your route tree (nested supported)  |
| `layout.js`      | Optional layout wrapper             |
| `domo.config.js` | Customize output dir, base URL, etc |

# Example Route File

```js
import Domo from "@zyrab/domo";

export const routes = {
  "/": () => Domo("div").txt("Hello Home"),
  "/about": () => Domo("div").txt("About Page"),
};
```

# Configuration (domo.config.js)

```js
export default {
  outDir: "./dist",
  routesFile: "./routes.js",
  layout: "./layout.js",
  exclude: ["css", "js", "assets"],
  baseUrl: "https://example.com",
};
```

# License

MIT — © Zyrab
