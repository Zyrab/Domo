/**
 * @file event_extraction.js
 */
import { createHash } from "crypto";
import { resolve } from "path";
import { registry } from "./Registry.js";
import { formatComponentName } from "./utils.js";

const indent = (code, spaces = 2) =>
  code
    .split("\n")
    .map((line) => " ".repeat(spaces) + line)
    .join("\n");

function destructureFunction(fnSource) {
  const match =
    fnSource.match(/^(?:async\s+)?(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>\s*\{?([\s\S]*?)\}?$/) ||
    fnSource.match(/^(?:async\s+)?function\s*[^(]*\([^)]*\)\s*\{([\s\S]*)\}$/);

  const nameMatch = fnSource.match(/function\s+([a-zA-Z0-9_$]+)/);

  return {
    name: nameMatch ? nameMatch[1] : null,
    body: match ? match[1].trim() : fnSource.trim(),
  };
}

/**
 * NEW HELPER: Analyzes ANY handler (event or ref) and figures out
 * if it needs to be imported, inlined as a closure, or stringified.
 */
function resolveDependency(handlerObj) {
  const { handler, path: providedPath, name: providedName } = handlerObj;
  const fnSource = handler.toString();
  const { name: extractedName, body } = destructureFunction(fnSource);

  let funcName = providedName || handler.name || extractedName;

  // Ignore auto-inferred object keys like "#box" or ".btn"
  if (funcName && !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(funcName)) {
    funcName = null;
  }

  let resolvedPath = providedPath;

  // Registry lookup
  if (!resolvedPath && funcName) {
    const fileKey = formatComponentName(funcName);
    const lookupPath = registry.getRoute(fileKey);
    if (lookupPath) resolvedPath = lookupPath;
  }

  return { funcName, resolvedPath, fnSource, body };
}

export function generateElementScript(id, events = [], states = {}, refs = []) {
  const imports = new Map();
  const closureFunctions = [];
  const listeners = [];
  let matchCounter = 0;

  // 1. Process Events
  events.forEach(({ event, handlers }) => {
    const logicLines = [];

    handlers.forEach((h) => {
      const { type, selector } = h;

      // Use our new smart helper!
      const { funcName, resolvedPath, fnSource, body } = resolveDependency(h);

      // Register imports or closures globally for this file BEFORE writing logic
      if (resolvedPath) {
        if (!imports.has(resolvedPath)) imports.set(resolvedPath, new Set());
        imports.get(resolvedPath).add(funcName);
      } else if (funcName) {
        closureFunctions.push(fnSource);
      }

      // ---> BUILD THE LOGIC LINES <---
      if (type === "closest") {
        const matchVar = `match${++matchCounter}`;
        logicLines.push(`const ${matchVar} = e.target.closest("${selector}");`);

        if (resolvedPath || funcName) {
          logicLines.push(`if (${matchVar}) ${funcName}(e, ${matchVar});`);
        } else {
          const adjustedBody = body.replace(/\btarget\b/g, matchVar);
          logicLines.push(`if (${matchVar}) {\n${indent(adjustedBody, 2)}\n}`);
        }
      } else if (type === "match") {
        const matchExpr = `e.target.matches("${selector}")`;

        if (resolvedPath || funcName) {
          logicLines.push(`if (${matchExpr}) ${funcName}(e, e.target);`);
        } else {
          const adjustedBody = body.replace(/\btarget\b/g, "e.target");
          logicLines.push(`if (${matchExpr}) {\n${indent(adjustedBody, 2)}\n}`);
        }
      } else if (type === "direct") {
        // THIS COVERS YOUR .on() METHODS
        if (resolvedPath || funcName) {
          logicLines.push(`${funcName}(e);`);
        } else {
          logicLines.push(body);
        }
      }
    });

    const handlerBody = `async function(e) { e.pre\n${indent(logicLines.join("\n"), 1)}\n}`;
    listeners.push(`document.querySelector('[data-domo-id="${id}"]').addEventListener("${event}", ${handlerBody});`);
  });

  // 2. Process Refs (Now using the exact same smart lookup!)
  const refLogics = refs
    .map((r) => {
      const { funcName, resolvedPath, fnSource, body } = resolveDependency(r);

      // Track imports/closures just like events
      if (resolvedPath) {
        if (!imports.has(resolvedPath)) imports.set(resolvedPath, new Set());
        imports.get(resolvedPath).add(funcName);
      } else if (funcName) {
        closureFunctions.push(fnSource);
      }

      // Output the Ref logic
      if (resolvedPath || funcName) {
        // If it's a named/imported function, pass the element to it: myRefFunction(el)
        return `{\n  const el = document.querySelector('[data-domo-id="${id}"]');\n  if (el) ${funcName}(el);\n}`;
      } else {
        // If anonymous, inline the body
        return `{\n  const el = document.querySelector('[data-domo-id="${id}"]');\n  if (el) {\n${indent(body, 4)}\n  }\n}`;
      }
    })
    .join("\n");

  // 3. Assemble State
  const stateInclusion = Object.entries(states)
    .map(([key, val]) => `let ${key} = ${JSON.stringify(val)};`)
    .join("\n");

  // 4. Assemble Imports
  let importStr = "";
  for (const [path, names] of imports) {
    const absolutePath = resolve(process.cwd(), path).replace(/\\/g, "/");
    importStr += `import { ${[...names].join(", ")} } from "${absolutePath}";\n`;
  }

  // 5. Final Assembly
  const closures = closureFunctions.length
    ? `\n\n// Inline Functions\n${indent(closureFunctions.join("\n\n"), 2)}`
    : "";

  const combinedLogic = [stateInclusion, refLogics, ...listeners].filter(Boolean).join("\n\n");

  return `${importStr}{\n${indent(combinedLogic, 2)}${closures}\n}`.trim();
}

export function getHash(content) {
  return createHash("sha1").update(content).digest("hex").slice(0, 8);
}
