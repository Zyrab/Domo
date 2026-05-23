import { writeFileSync, mkdirSync, existsSync, rmSync, readFileSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { build } from "esbuild";
import { createRequire } from "module";
import { generateElementScript, getHash } from "./event-extraction.js";
import { registry } from "./Registry.js";
import { formatComponentName } from "./utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const DOMO_CLIENT_PACKAGE = "@zyrab/domo/client";
let DOMO_CLIENT_SOURCE;

try {
  // This works across different package managers
  DOMO_CLIENT_SOURCE = require.resolve(DOMO_CLIENT_PACKAGE);
} catch (e) {
  // Fallback for local dev if not linked
  DOMO_CLIENT_SOURCE = join(__dirname, "../../domo/src/client/domo.client.js");
}
const cache = {
  runtime: null,
  events: new Map(), // normalizedHash -> file
  islands: new Map(), // hash -> file
};

/**
 * Converts a function name to your file naming convention based on strict patterns.
 * @param {string} funcName - e.g., "createHeader", "createPreviewPage", "copyCode"
 * @returns {string} - e.g., "header", "preview-page", "handle-copy-code"
 */
const rewriteDomoPlugin = {
  name: "rewrite-domo",
  setup(build) {
    build.onResolve({ filter: /^@zyrab\/domo$|^domo$/ }, (args) => {
      // Points the browser to your pre-bundled runtime
      return { path: "/js/domo.runtime.js", external: true };
    });
  },
};

/**
 * Traverses the Domo tree to find all elements with events or islands.
 */
export function collectMetadata(node, out = { events: [], islands: [] }) {
  if (!node || typeof node !== "object") return out;

  const el = node.element;
  if ((el?._events?.length > 0 || el?._refs?.length > 0) && !el?._island) {
    out.events.push({
      id: el._attr["data-domo-id"] || el._attr["id"],
      events: el._events || [],
      states: el._state || {},
      refs: el._refs || [],
    });
  }

  if (el?._island && el?.__island) {
    const rawName = el.__island.name; // e.g., "createPreviewPage"
    const fileKey = formatComponentName(rawName); // "preview-page"

    // Look up the exact file path from your singleton
    const filePath = registry.getRoute(fileKey);
    if (!filePath) {
      console.warn(`[Domo-SSG] Could not find file for island component: ${rawName}`);
    } else {
      out.islands.push({
        id: el._attr["data-domo-id"] || el._attr["id"],
        path: filePath,
      });
    }
  }
  if (Array.isArray(el?._child)) {
    for (const child of el._child) {
      collectMetadata(child, out);
    }
  }

  return out;
}

/**
 * Bundle runtime (once)
 */
async function bundleRuntime(outputDir) {
  if (cache.runtime) return cache.runtime;

  const file = "domo.runtime.js";
  const out = join(outputDir, "js", file);

  await build({
    entryPoints: [DOMO_CLIENT_SOURCE],
    bundle: true,
    minify: true,
    format: "esm",
    outfile: out,
    platform: "browser",
  });

  cache.runtime = file;
  return file;
}

/**
 * Bundle event logic
 */
async function bundleEvents(metadata, jsDir, tempDir) {
  if (metadata.events.length === 0) return null;
  const raw = metadata.events
    .map(({ id, events, states, refs }) => generateElementScript(id, events, states, refs))
    .join("\n\n");

  if (cache.events.has(id)) return cache.events.get(id);

  const file = `${id}.events.js`;
  const entry = join(tempDir, `${id}.entry.js`);

  writeFileSync(entry, raw, "utf8");

  await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: "esm",
    outfile: join(jsDir, file),
    packages: "external",

    plugins: [rewriteDomoPlugin],

    platform: "browser",
  });

  rmSync(entry);

  cache.events.set(id, file);
  return file;
}

async function bundleIslands(metadata, jsDir, tempDir) {
  const islandsToBundle = metadata.islands.filter((i) => i.path);
  if (islandsToBundle.length === 0) return [];

  const entryPoints = {};

  // Create wrappers for the islands
  for (const island of islandsToBundle) {
    const { path: filePath, id } = island;
    const content = readFileSync(filePath, "utf8");
    const hash = getHash(content);

    const entryPath = join(tempDir, `${hash}.entry.js`);
    const absolutePath = resolve(process.cwd(), filePath).replace(/\\/g, "/");

    const wrapper = `
      import Island from "${absolutePath}";

      const el = document.querySelector('[data-domo-id="${id}"]');
      if (el) {
        const instance = Island();
        if (instance && instance._isDomo) {
          el.appendChild(instance.build());
        } else if (instance instanceof DocumentFragment || instance instanceof HTMLElement) {
          el.appendChild(instance);
        }
      }
    `;

    writeFileSync(entryPath, wrapper, "utf8");

    // Outputs to: dist/js/islands/hash.js
    entryPoints[`islands/${hash}`] = entryPath;
  }

  // 2. The Modern esbuild Call
  const result = await build({
    entryPoints,
    bundle: true,
    splitting: true,
    minify: true,
    format: "esm",
    outdir: jsDir,

    // --> THE MAGIC BULLET FOR NPM PACKAGES <--
    packages: "external",

    plugins: [rewriteDomoPlugin], // Injects our Domo rewrite

    // Tells esbuild how to name the shared files so it looks like your project
    // instead of random chunk strings
    chunkNames: "components/[name]-[hash]",

    metafile: true,
    platform: "browser",
  });

  // Clean up temp files
  Object.values(entryPoints).forEach((entryPath) => rmSync(entryPath));

  // Extract generated paths for injection
  const allGeneratedPaths = Object.keys(result.metafile.outputs).map((filePath) => {
    const relativeToDist = filePath.replace(/\\/g, "/").split("/").slice(1).join("/");
    let path = `/${relativeToDist}`;

    // 3. Remove "js/" specifically if it appears immediately after the leading slash
    // This transforms "/js/main.js" -> "main.js"
    return path.replace(/^\/js\//, "");
  });
  return allGeneratedPaths.filter((path) => path.endsWith(".js"));
}
/**
 * Main orchestrator
 */
export async function writeJs(content, outputDir) {
  const metadata = collectMetadata(content);
  const hasInteractivity = metadata.events.length > 0 || metadata.islands.length > 0;

  if (!hasInteractivity) return null;
  // console.log(metadata);

  const jsDir = join(outputDir, "js");
  const tempDir = join(outputDir, ".domo_temp");

  if (!existsSync(jsDir)) mkdirSync(jsDir, { recursive: true });
  if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true });

  const hasIslands = metadata.islands.length > 0;

  const [runtime, events, islands] = await Promise.all([
    // Only bundle the client runtime when there are actual islands (R4)
    hasIslands ? bundleRuntime(outputDir) : Promise.resolve(null),
    bundleEvents(metadata, jsDir, tempDir),
    bundleIslands(metadata, jsDir, tempDir),
  ]);

  return [runtime, events, ...islands].filter(Boolean);
}
