/**
 * @file event_extraction.js
 * @description Logic for extracting events, state, and references for SSG/SPA bundling.
 */

import { createHash } from "crypto";

/**
 * Normalizes a function for the client.
 * Handlers will use 'state' and 'target' identifiers which are
 * consistently minified by esbuild alongside the listener scope.
 */
function transformHandler(handlerInfo) {
  const { type, selector, handler, name } = handlerInfo;
  let body = "";
  let fnSource = handler.toString();

  const isExternal = handlerInfo.path !== null;

  if (isExternal) {
    // If it's a named function from an external file, we just call it.
    body = `${name}(e${type !== "direct" ? ", target" : ""});`;
  } else {
    // Extract body from anonymous/inline function
    const match =
      fnSource.match(/^(?:async\s+)?(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>\s*\{?([\s\S]*?)\}?$/) ||
      fnSource.match(/^(?:async\s+)?function\s*[^(]*\([^)]*\)\s*\{([\s\S]*)\}$/);
    body = match ? match[1].trim() : fnSource;
  }

  // Wrap in blocks to isolate 'target'.
  if (type === "closest") {
    return `{\n    const target = e.target.closest("${selector}");\n    if (target) {\n      ${body}\n    }\n  }`;
  }

  if (type === "match") {
    return `{\n    if (e.target.matches("${selector}")) {\n      const target = e.target;\n      ${body}\n    }\n  }`;
  }

  return body;
}
function transformRef(refInfo) {
  const { handler, name } = refInfo;
  let fnSource = handler.toString();

  // Extract the body of the ref callback
  const match =
    fnSource.match(/^(?:async\s+)?(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>\s*\{?([\s\S]*?)\}?$/) ||
    fnSource.match(/^(?:async\s+)?function\s*[^(]*\([^)]*\)\s*\{([\s\S]*)\}$/);
  const body = match ? match[1].trim() : fnSource;

  return `{\n    const el = document.getElementById("${refInfo.id}");\n    if (el) {\n      const callback = (el) => { ${body} };\n      callback(el);\n    }\n  }`;
}

/**
 * Generates the ESM content for a specific element's events.
 */
export function generateElementScript(id, events, states, refs) {
  const imports = new Map();
  const listeners = [];
  const refLogics = [];

  events.forEach(({ event, handlers }) => {
    const logicBlocks = handlers
      .map((h) => {
        if (h.path) {
          if (!imports.has(h.path)) imports.set(h.path, new Set());
          imports.get(h.path).add(h.name);
        }
        return transformHandler(h);
      })
      .join("\n    ");

    // We inject the state declaration as a plain string at the top of the listener.
    // Because esbuild parses this whole block, it will minify the identifier 'state'
    // to the same name used in the 'logicBlocks' (e.g., const n = ...; n.toggled = ...).
    const stateInclusion =
      states && Object.keys(states).length
        ? Object.entries(states)
            .map(([key, val]) => `let ${key} = ${JSON.stringify(val)};`)
            .join("\n")
        : "";

    listeners.push(
      `${stateInclusion}\n  document.getElementById("${id}").addEventListener("${event}", async (e) => {${logicBlocks}\n  });`,
    );
  });
  refs.forEach((r) => {
    refLogics.push(transformRef({ ...r, id }));
  });

  let importStr = "";

  for (const [path, names] of imports) {
    importStr += `import { ${[...names].join(", ")} } from "${path}";\n`;
  }
  const combinedLogic = [...refLogics, ...listeners].join("\n");

  return `${importStr}\n(function() {\n${combinedLogic}\n})();`;
}

/**
 * Hash helper for caching
 */
export function getHash(content) {
  return createHash("sha1").update(content).digest("hex").slice(0, 8);
}
