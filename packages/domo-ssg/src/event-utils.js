import { writeFileSync, mkdirSync, existsSync, rmSync, readFileSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { build } from "esbuild";
import { generateElementScript, getHash } from "./event-extraction.js";

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
  events: new Map(), // hash -> file
  islands: new Map(), // hash -> file
};

/**
 * Plugin to convert imports of 'domo' into the global 'Domo' variable
 */
const makeDomoExternalPlugin = {
  name: "domo-external",
  setup(build) {
    // Intercept any import relating to domo
    build.onResolve({ filter: /^domo$|^@zyrab\/domo/ }, (args) => {
      return { path: args.path, external: true };
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

  if (el?._island) {
    out.islands.push({
      id: el._attr["data-domo-id"] || el._attr["id"],
      path: el.__file,
    });
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
    minify: false,
    format: "iife",
    globalName: "Domo",
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

  const hash = getHash(raw);
  if (cache.events.has(hash)) return cache.events.get(hash);

  const file = `${hash}.events.js`;
  const entry = join(tempDir, `${hash}.entry.js`);

  writeFileSync(entry, raw, "utf8");

  await build({
    entryPoints: [entry],
    bundle: true,
    minify: false,
    format: "iife",
    outfile: join(jsDir, file),
    platform: "browser",
  });

  rmSync(entry);

  cache.events.set(hash, file);
  return file;
}

/**
 * Bundle islands (deduped by CONTENT, not path)
 */
async function bundleIslands(metadata, jsDir, tempDir) {
  const results = [];
  const islandsToBundle = metadata.islands.filter((i) => i.path);

  await Promise.all(
    islandsToBundle.map(async (island) => {
      const { path: filePath, id } = island;
      const content = readFileSync(filePath, "utf8");
      const hash = getHash(content);

      if (cache.islands.has(hash)) {
        results.push({ path: filePath, file: cache.islands.get(hash) });
        return;
      }

      const file = `${hash}.island.js`;
      const entryPath = join(tempDir, `${hash}.island.entry.js`);

      // wrapper: hydrate island at the correct element
      const wrapper = `
            import Island from "${filePath.replace(/\\/g, "/")}";

            (function() {
              const el = document.querySelector('[data-domo-id="${id}"]');
              if (el) {
                const instance = Island();
                if (instance && instance._isDomo) {
                  const built = instance.build();
                  el.replaceWith(built);
                }
              }
            })();
            `;

      writeFileSync(entryPath, wrapper, "utf8");

      await build({
        entryPoints: [entryPath],
        bundle: true,
        minify: false,
        format: "iife",
        outfile: join(jsDir, file),
        platform: "browser",
        plugins: [makeDomoExternalPlugin],
      });

      rmSync(entryPath);
      cache.islands.set(hash, file);
      results.push({ path: filePath, file });
    }),
  );

  return results;
}
/**
 * Main orchestrator
 */
export async function writeJs(content, outputDir) {
  const metadata = collectMetadata(content);

  const hasInteractivity = metadata.events.length > 0 || metadata.islands.length > 0;

  if (!hasInteractivity) return null;

  const jsDir = join(outputDir, "js");
  const tempDir = join(outputDir, ".domo_temp");

  if (!existsSync(jsDir)) mkdirSync(jsDir, { recursive: true });
  if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true });

  const [runtime, events, islands] = await Promise.all([
    bundleRuntime(outputDir),
    bundleEvents(metadata, jsDir, tempDir),
    bundleIslands(metadata, jsDir, tempDir),
  ]);

  return [runtime, events, ...islands.map((i) => i.file)].filter(Boolean);
}
