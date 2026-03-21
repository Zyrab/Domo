# Changelog

## [0.7.2] - 2026-03-21

### Fixed

- **Ref Hydration Logic**: Resolved an issue where local (non-registry) `ref` functions were incorrectly injected.
  - Fixed "ghosting" where function bodies were dumped into the bundle as unused expressions.
  - Corrected the logic to prioritize **IIFE inlining** for local functions, ensuring `el` is correctly scoped and passed to the handler.
  - Prevented the "Top-level return" error by ensuring all inlined ref bodies are wrapped in an asynchronous functional scope.

---

## [0.7.1] - 2026-03-21

### Fixed

- **Critical Build Failure**: Resolved `ReferenceError: join is not defined` in `packages/domo-ssg/src/index.js` by adding the missing `node:path` import. This fix restores the SSG build process which was broken in the previous release.

---

## [0.7.0] - 2026-03-21 (Internal Testing)

### Added

- **Asset Pipeline & Static Copying**: Introduced a new `assetsDir` configuration for mapping multiple source directories (e.g., `src/assets`, `src/styles`) to custom build destinations. Added `copyStaticFolder` utility for robust, recursive asset synchronization.
- **Strict Naming Conventions**: Implemented `formatComponentName` to enforce a bridge between function names and file system registry:
  - **UI Components**: `createNavbar()` maps to `navbar.js`.
  - **Event Handlers**: `handleClick()` maps to `handle-handle-click.js`.
- **Centralized Build Registry**: Added a `BuildRegistry` class to manage and resolve route paths across the entire build process, ensuring component-to-file mapping is consistent.

### Changed

- **Advanced Event Extraction**: Re-engineered the event handling logic to support hydration for all attachment types (Refs and Islands). It now correctly groups events and bundles imported functions.
- **Smart Island Hydration**: Improved bundling logic to detect and extract only necessary files for islands. This significantly reduces output size compared to a full SPA bundle while maintaining interactivity.
- **Enhanced Configuration Loader**: Refactored `loadConfig` to use `pathToFileURL`, resolving pathing issues with ESM imports and improving reliability across different operating systems.
- **Refactored Entry Point**: Updated `src/index.js` to coordinate the new registry, asset copying, and route traversal sequence.

### Technical Note

- Functions not following the `create[Name]` or `handle-` conventions will now be stringified and embedded as anonymous/in-line functions rather than being bundled as separate, cacheable island files.

---

## [0.6.0] - 2026-03-20 (Internal Testing)

### Added

- **Global Runtime Architecture**: The client-side library (`domo.runtime.js`) is now bundled as an IIFE with a global `Domo` namespace. This prevents redundant code duplication across multiple island bundles.
- **Production-Ready Package Resolution**: Replaced relative pathing with `createRequire` resolution. The builder now correctly locates `@zyrab/domo` within `node_modules` across different package managers (NPM, PNPM, Bun).
- **External Dependency Mapping**: Introduced an esbuild plugin to "externalize" Domo imports within Islands. This ensures that Component source code can still use `import Domo from 'domo'` for IDE support and linting, but the final bundle skips the import and references the global `window.Domo` instead.

### Changed

- **Island Bundling Strategy**: Islands are now wrapped in a hydration script that detects the global `Domo` instance before mounting, significantly reducing the footprint of individual `.island.js` files.
- **Minification**: Enabled production minification by default for all generated assets (`runtime`, `events`, and `islands`).

### Internal

- **Testing Mode**: This version is currently in **Testing Mode**. Internal path resolution is being verified for compatibility with monorepo symlinks and flattened `node_modules` structures.
- **Optimized Deduplication**: Updated `bundleIslands` to use content-based hashing for deduplication, ensuring that identical components across different routes share a single cached JS file.

---

## [0.5.4] - 2026-03-13

### Changed

- Removed `dotenv/config` import env variable should be set outside the package.
- Removed `process.env.DOMO_SSG = true` .
- Updated `domo-ssg` internals to make sure competance with new Domo-og versions.

---

## [0.5.3] - 2026-02-04

### Changed

- Added `dotenv/config` import in the build entry to automatically load environment variables from `.env` files.
- Introduced `process.env.DOMO_SSG = true` during the build to indicate static site generation mode.
- Updated `domo-ssg` dependencies to use `peerDependencies` for `@zyrab/domo-router` and `@zyrab/domo-og` to ensure a single shared instance and avoid router state conflicts.
- Router singleton now works consistently between `domo-ssg` and project components, preventing null `Router.info` errors during SSG builds.

---

## [0.5.2] - 2025-08-07

- patch to support new domo-og

## [0.5.1] - 2025-08-07

### Added

- Modified Logs for better visibilite and messaging

---

## [0.5.0] - 2025-08-06

### Added

- Added support for automatic OG image generation via `generateOgImage` flag in route meta.
- Uses the `@zyrab/domo-og` package (must be installed separately).
- SVG templates with a `{{title}}` placeholder can be used to create custom OG images.
- Output PNGs are saved under `assets/og-images/`.
- Caching prevents regeneration when titles or templates haven’t changed.
- Feature is non-breaking and opt-in — no changes required for existing routes.

### Example usage:

```js
meta: {
  title: "Post Title",
  generateOgImage: true,
  svgTemplate: myTemplate,
  templateId: "blog-v1"
}
```

---

## [0.4.0] - 2025-07-27

### Added

- Sitemap generation Now includes more automatic metadata. Manual configuration for certain metadata fields is planned for future updates.

### Changed

- In Route object structure Removed the `children` key from route definitions.

### Internal

- Refactored `buildRoutes()`:
  - Removed handling of the `children` key.
  - Skips irrelevant keys.
  - Enhanced error detection:
    - Detects when metadata is provided but no component is present.
    - Flags inaccessible `routeParams` in dynamic routes.
    - Validates incorrect dynamic parameters.
  - Improved readability and performance.

- Optimized `routeHandler` Refactored for better clarity and speed.

---

## [0.3.1] - 2025-07-25

### Fix

- Fixed `ogDescription` desclaration and handlin in layout.

---

## [0.3.0] - 2025-07-25

### Added

- Global asset support in config:
  - `js`, `css`, `fonts`, `favicon` can be declared globally.
  - Each asset can have `preload: true` to emit `<link rel="preload">`.
  - Set `lang`, `author`, and `theme` types for semantic markup.

-Per-route metadata support:

- `description`, `ogDescription`, `ogImage`, `type` (e.g. for Twitter cards), and `canonical` URL handling.

- Route-level asset and metadata overrides.
- Favicon support via config.

### Changed

- Improved HTML layout and semantics for better accessibility.
- Now use `routProps` for dynamic props:
  - Example: for a route `/blog/:slug`, pass an array of objects with matching keys (`slug`, etc.) to generate individual pages.

### Internal

- Refactored internal functions for cleaner config parsing and asset injection.
- Dynamic route rendering enhanced to handle prop arrays directly.

---

## [0.2.0] - 2025-07-01

### Changed

- Refactored JS file generation to avoid duplication across dynamic pages.
- Event handler logic is now normalized and hashed to detect identical scripts reused across different pages.
- Script filenames are derived from content hashes (sha1) instead of page paths (/user/1 → user-1.js), improving browser cache effectiveness.

### Internal

- Added `normalizeEventLogic()` and `hashContent()` to stabilize and deduplicate logic across builds.
- Introduced a temporary in-memory Map cache to track already-generated scripts.

---

## [0.1.0] - 2025-07-07

### Added

- Initial release of `@zyrab/domo-ssg`, a simple static site generator designed for Domo-based virtual DOM.
- Support for custom layout rendering via `renderLayout()` function.
- Recursive route tree traversal using a virtual DOM structure.
- Automatic generation of `sitemap.xml` with support for `baseUrl` and `exclude` filters.
- Optional `domo.config.js` for user-defined config overrides (`outDir`, `routesFile`, `layout`, etc).
- Filesystem-safe output path handling for route-based pages.
- Clean output directory before build.
- Auto-injection of client-side JavaScript per page via extracted `on(...)` event metadata from virtual DOM.

### Server-side event delegation support

- Virtual `.on(...)`, `.onClosest(...)`, `.onMatch(...)` handlers now capture metadata during SSG.
- `event-utils.js` extracts and serializes event listeners for runtime hydration:
  - Supports event type `direct`, `closest`, and `match`.
  - Functions can expose variables using `// @ssg-let` and `// @ssg-const` to ensure availability in hydrated JS.
  - Closure support and selector-aware event bindings.

### Monorepo & Build

- Designed to work inside monorepos via `pnpm workspaces`.
- CLI support via `node src/index.js` for both root and filtered workspace usage.
- Package is `type: module` and compatible with ESM.
