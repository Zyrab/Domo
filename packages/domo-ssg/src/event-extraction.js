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

/**
 * Walks from `src[0]` (which must be `{`) and returns the content between
 * the first `{` and its matching closing `}`, using a depth counter so nested
 * braces inside object literals, if-blocks etc. are handled correctly.
 */
function extractBraceBody(src) {
  let depth = 0;
  let bodyStart = -1;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    // Skip string literals so braces inside strings don't count
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      i++;
      while (i < src.length && src[i] !== quote) {
        if (src[i] === "\\") i++; // skip escaped char
        i++;
      }
      continue;
    }
    if (ch === "{") {
      if (depth === 0) bodyStart = i + 1;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) return src.slice(bodyStart, i);
    }
  }
  return null; // unmatched — caller will fall back
}

/**
 * Extracts the body and optional name from a function source string.
 * Handles all common shapes:
 *   - `() => expr`               → body = "expr"
 *   - `() => { stmt; }`          → body = "stmt;"
 *   - `(e) => e.foo`             → body = "e.foo"
 *   - `async (e) => { ... }`     → body = "..."
 *   - `function() { stmt; }`     → body = "stmt;"
 *   - `function foo(e) { ... }`  → body = "...", name = "foo"
 */
function destructureFunction(fnSource) {
  const src = fnSource.trim();

  // Extract named function identifier (works for both regular functions and named arrow assignments)
  const nameMatch = src.match(/^(?:async\s+)?function\s+([a-zA-Z0-9_$]+)/);
  const funcName = nameMatch ? nameMatch[1] : null;

  // --- Arrow function ---
  const arrowMatch = src.match(/^(?:async\s+)?(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>\s*/);
  if (arrowMatch) {
    const afterArrow = src.slice(arrowMatch[0].length); // everything after "=>"

    if (afterArrow.trimStart().startsWith("{")) {
      // Block body: use brace counter to extract inner content
      const body = extractBraceBody(afterArrow.trimStart());
      return { name: funcName, body: body !== null ? body.trim() : afterArrow.trim() };
    } else {
      // Expression body: the entire remainder is the body (e.g. `handleLangChange(n.lang)`)
      return { name: funcName, body: afterArrow.trim() };
    }
  }

  // --- Regular function expression / declaration ---
  const braceIdx = src.indexOf("{");
  if (braceIdx !== -1) {
    const body = extractBraceBody(src.slice(braceIdx));
    return { name: funcName, body: body !== null ? body.trim() : src.trim() };
  }

  // Fallback: couldn't parse — return the full source so the caller can use (fnSource)(e)
  return { name: funcName, body: null };
}


/**
 * Analyzes ANY handler (event or ref) and figures out
 * if it needs to be imported, inlined as a closure, or stringified.
 */
function resolveDependency(handlerObj) {
  const { handler, path: providedPath, name: providedName } = handlerObj;
  const fnSource = handler.toString();
  const { name: extractedName, body } = destructureFunction(fnSource);

  // The Domo library stores name: "anonymous" as a sentinel when no real name
  // is available (handler.name === "" for arrow functions). Treat "anonymous"
  // and empty string the same as null — they are not real importable identifiers.
  const isSentinel = (n) => !n || n === "anonymous";

  const rawName = isSentinel(handler.name) ? null : handler.name;
  const cleanProvided = isSentinel(providedName) ? null : providedName;
  const cleanExtracted = isSentinel(extractedName) ? null : extractedName;

  let funcName = cleanProvided || rawName || cleanExtracted;

  // Ignore CSS-selector-style names like "#box" or ".btn" that esbuild
  // sometimes infers from object keys
  if (funcName && !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(funcName)) {
    funcName = null;
  }

  let resolvedPath = providedPath || null;

  // Registry lookup: if we have a real name, try to find its source file
  if (!resolvedPath && funcName) {
    const fileKey = formatComponentName(funcName);
    const lookupPath = registry.getRoute(fileKey);
    if (lookupPath) resolvedPath = lookupPath;
  }

  // isUnsafeClosure = true means: anonymous function with no importable path.
  // The caller will inline the body and auto-scan for registry references.
  const isUnsafeClosure = !funcName && !resolvedPath;

  return { funcName, resolvedPath, fnSource, body, isUnsafeClosure };
}

/**
 * Scans a function body string for identifiers that look like function calls
 * and tries to resolve each one against the registry. Returns a Map of
 * resolvedPath -> Set<funcName> for any that are found.
 *
 * This is what makes anonymous inline functions work: if the body calls
 * `handleLangChange(...)` and that name is registered, we auto-import it
 * so esbuild can resolve it in the browser bundle.
 */
const JS_BUILTINS = new Set([
  "if", "for", "while", "switch", "function", "async", "await", "return",
  "const", "let", "var", "new", "typeof", "instanceof", "void", "delete",
  "console", "document", "window", "navigator", "location", "history",
  "JSON", "Object", "Array", "String", "Number", "Boolean", "Symbol",
  "Promise", "Math", "Date", "Error", "Map", "Set", "WeakMap", "WeakSet",
  "parseInt", "parseFloat", "isNaN", "isFinite", "encodeURIComponent",
  "decodeURIComponent", "setTimeout", "setInterval", "clearTimeout",
  "clearInterval", "requestAnimationFrame", "fetch", "localStorage",
  "sessionStorage", "CustomEvent", "Event", "URL", "URLSearchParams",
]);

function scanBodyForImports(body) {
  const found = new Map();
  // Match identifiers immediately followed by "(" — i.e., function calls
  const callPattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
  let match;
  while ((match = callPattern.exec(body)) !== null) {
    const name = match[1];
    if (JS_BUILTINS.has(name)) continue;

    const fileKey = formatComponentName(name);
    const lookupPath = registry.getRoute(fileKey);
    if (lookupPath) {
      if (!found.has(lookupPath)) found.set(lookupPath, new Set());
      found.get(lookupPath).add(name);
    }
  }
  return found;
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

      const { funcName, resolvedPath, fnSource, body, isUnsafeClosure } = resolveDependency(h);

      // ── REGISTRATION: figure out imports / closures ──────────────────────
      if (resolvedPath) {
        // External file — will be imported at the top of the bridge
        if (!imports.has(resolvedPath)) imports.set(resolvedPath, new Set());
        imports.get(resolvedPath).add(funcName);
      } else if (type !== "direct") {
        // For closest/match: named local functions are kept as named closures so
        // they can be called with (e, target) / (e, e.target) arguments.
        // Arrow fnSource would be a bare expression, so wrap it as a declaration.
        if (funcName) {
          // Re-wrap arrow expressions as a proper named function declaration
          const decl = fnSource.trim().startsWith("function")
            ? fnSource                                          // already a declaration
            : `function ${funcName}(...args) { return (${fnSource})(...args); }`;
          closureFunctions.push(decl);
        } else {
          // Anonymous — scan body for registry deps
          const autoImports = scanBodyForImports(body || fnSource);
          for (const [p, names] of autoImports) {
            if (!imports.has(p)) imports.set(p, new Set());
            for (const n of names) imports.get(p).add(n);
          }
        }
      } else {
        // direct type (named-local OR anonymous) — will inline the body below.
        // Scan for any registry-known function calls so they get imported.
        const autoImports = scanBodyForImports(body || fnSource);
        for (const [p, names] of autoImports) {
          if (!imports.has(p)) imports.set(p, new Set());
          for (const n of names) imports.get(p).add(n);
        }
        if (autoImports.size === 0 && (body || fnSource)) {
          console.warn(
            `[Domo-SSG] Inlining handler on "${id}" (event: "${event}") as best-effort.\n` +
            `  Any captured local variables (e.g. loop state) won't be available at runtime.`
          );
        }
      }

      // ── BUILD THE LOGIC LINES ────────────────────────────────────────────
      if (type === "closest") {
        const matchVar = `match${++matchCounter}`;
        logicLines.push(`const ${matchVar} = e.target.closest("${selector}");`);

        if (resolvedPath || funcName) {
          logicLines.push(`if (${matchVar}) ${funcName}(e, ${matchVar});`);
        } else {
          const adjustedBody = (body || "").replace(/\btarget\b/g, matchVar);
          logicLines.push(`if (${matchVar}) {\n${indent(adjustedBody, 2)}\n}`);
        }
      } else if (type === "match") {
        const matchExpr = `e.target.matches("${selector}")`;

        if (resolvedPath || funcName) {
          logicLines.push(`if (${matchExpr}) ${funcName}(e, e.target);`);
        } else {
          const adjustedBody = (body || "").replace(/\btarget\b/g, "e.target");
          logicLines.push(`if (${matchExpr}) {\n${indent(adjustedBody, 2)}\n}`);
        }
      } else if (type === "direct") {
        if (resolvedPath) {
          // External imported function — call by name
          logicLines.push(`${funcName}(e);`);
        } else if (body !== null && body !== undefined && body !== "") {
          // Named-local OR anonymous — inline the extracted body directly
          logicLines.push(body);
        } else {
          // Body extraction failed — call the full source as an IIFE
          logicLines.push(`(${fnSource})(e);`);
        }
      }
    });

    // Only emit a listener if there's actual logic to run
    if (logicLines.length > 0) {
      const handlerBody = `async function(e) {\n${indent(logicLines.join("\n"), 1)}\n}`;
      listeners.push(`document.querySelector('[data-domo-id="${id}"]').addEventListener("${event}", ${handlerBody});`);
    }
  });

  // 2. Process Refs - Wrapped in IIFE to allow top-level returns and async
  const refLogics = refs
    .map((r) => {
      const { funcName, resolvedPath, fnSource, body } = resolveDependency(r);

      if (resolvedPath) {
        if (!imports.has(resolvedPath)) imports.set(resolvedPath, new Set());
        imports.get(resolvedPath).add(funcName);
        return `{\n  const el = document.querySelector('[data-domo-id="${id}"]');\n  if (el) ${funcName}(el);\n}`;
      }

      // Anonymous Ref: inline the body in an async IIFE, or call the full source if body is null
      const refBody = body !== null && body !== undefined ? body : `(${fnSource})(el)`;
      return `{\n  const el = document.querySelector('[data-domo-id="${id}"]');\n  if (el) {\n    (async () => {\n${indent(refBody, 6)}\n    })();\n  }\n}`;
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
