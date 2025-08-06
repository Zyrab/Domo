# @zyrab/domo-og

Dynamic Open Graph image generator for use with [domo-ssg](https://github.com/Zyrab/Domo/tree/main/packages/domo-ssg). It takes an SVG template, replaces template variables (like `{{title}}`), and converts the result into a PNG using `resvg`.This is ideal for automating image generation during builds or static site generation.

## Features

- Simple `{{title}}` substitution in SVG templates
- Auto-wraps long titles with word-aware line breaking
- Converts final SVGs into PNGs using [`resvg`](https://github.com/RazrFalcon/resvg) v0.45.1
- Uses OS temp directory for intermediate files
- Built-in caching to skip unchanged renders
- Works cross-platform (Windows, Linux, macOS) using bundled binaries

## Usage

```js
import { generateOgImage } from "@zyrab/domo-og";

generateOgImage({
  slug: "home",
  title: "Welcome to My Site",
  svgTemplate: mySvgTemplate,
  templateId: "v1", // optional but recommended
  outputDir: "./public",
  routeKey: "/home",
  ogImageOptions: {
    maxLength: 30,
    lineHeight: 1.4,
    x: 600,
  },
});
```

## Template Format

Your SVG must include a `{{title}}` placeholder inside a `<text>` tag:

```xml
<text x="600" y="300" text-anchor="middle">
  {{title}}
</text>
```

This will be replaced with line-wrapped `<tspan>` elements automatically.

---

## Options

### Required:

| Name        | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `slug`      | `string` | Base name for image file          |
| `title`     | `string` | Title to render inside the SVG    |
| `outputDir` | `string` | Absolute path to output directory |

### Optional:

| Name             | Type     | Description                                                   |
| ---------------- | -------- | ------------------------------------------------------------- |
| `svgTemplate`    | `string` | SVG markup containing `{{title}}`                             |
| `templateId`     | `string` | Stable ID for this template (used for caching)                |
| `routeKey`       | `string` | Unique key for page/route; helps prevent hash collisions      |
| `ogImageOptions` | `object` | Controls line breaking                                        |
| └─ `x`           | `number` | Horizontal position for `<tspan>`s (default: `600`)           |
| └─ `maxLength`   | `number` | Max characters per line (default: `25`)                       |
| └─ `lineHeight`  | `number` | Vertical spacing between lines in `em` units (default: `1.5`) |

---

## Output

Images are saved to:

```
assets/og-images/<slug>-<hash>.png
```

Caching metadata is saved in:

```
<outputDir>/og-cache.json
```

---

## Caching

Caching is based on:

- Title + template ID (or hashed template string)
- Route key or slug

If nothing changes, existing PNG will be reused without re-rendering.

---

## 🧪 Requirements

- Node.js 18+
- `resvg` binary (included per platform under `bin/`)

---

## Internals

- `resvg` binary runs via `execFileSync`
- Temp SVGs are written to `os.tmpdir()`
- PNGs are written to `${outputDir}/assets/og-images`

---

## Example Output

Generated image path:

```
assets/og-images/home-83f920a712.png
```

---

## Notes

License
MIT © Zyrab
This project bundles the [resvg](https://github.com/linebender/resvg) binary, which is dual-licensed under MIT and Apache-2.0.  
We distribute it under the terms of the MIT license. See [RESVG-LICENSE](https://github.com/linebender/resvg/blob/main/LICENSE-MIT) for details.
