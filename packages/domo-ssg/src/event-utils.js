// src/event-utils.js

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export function generateScriptContent(events) {
  return events
    .map(({ id, event, handlers }) => {
      const varSet = new Set();
      const logicLines = [];
      const closureFunctions = [];
      let matchCounter = 0;

      for (const { type, selector, handler } of handlers) {
        const fnSource = handler.toString();
        const { name, body } = destructureFunction(fnSource);
        const vars = extractExposedVariables(body);
        vars.forEach((v) => varSet.add(v));

        if (type === "closest") {
          const matchVar = `match${++matchCounter}`;
          logicLines.push(`const ${matchVar} = e.target.closest("${selector}");`);

          if (name) {
            logicLines.push(`if (${matchVar}) ${name}(e, ${matchVar});`);
            closureFunctions.push(fnSource);
          } else {
            const adjustedBody = body.replace(/\btarget\b/g, matchVar);
            logicLines.push(`if (${matchVar}) {\n${indent(adjustedBody, 2)}\n}`);
          }
        } else if (type === "match") {
          const matchExpr = `e.target.matches("${selector}")`;

          if (name) {
            logicLines.push(`if (${matchExpr}) ${name}(e, e.target);`);
            closureFunctions.push(fnSource);
          } else {
            const adjustedBody = body.replace(/\btarget\b/g, "e.target");
            logicLines.push(`if (${matchExpr}) {\n${indent(adjustedBody, 2)}\n}`);
          }
        } else if (type === "direct") {
          logicLines.push(body);
        }
      }

      const varsStr = [...varSet].join("\n");
      const handlerBody = `function(e) {\n${indent(logicLines.join("\n"), 1)}\n}`;
      const closures = closureFunctions.length ? `\n\n${closureFunctions.join("\n\n")}` : "";

      return `${
        varsStr ? varsStr + "\n\n" : ""
      }document.getElementById("${id}").addEventListener("${event}", ${handlerBody});${closures}`;
    })
    .join("\n\n\n");
}

export function collectEvents(node, out = []) {
  if (!node || typeof node !== "object") return out;
  const el = node.element;
  if (Array.isArray(el._events) && el._events.length > 0) {
    out.push(...el._events);
  }

  if (Array.isArray(el._child)) {
    for (const child of el._child) {
      collectEvents(child, out);
    }
  }

  return out;
}

export function writeJs(constent, outputDir, path) {
  const events = collectEvents(constent);
  if (events.length <= 0) return;
  const jsDir = join(outputDir, "js");
  if (!existsSync(jsDir)) mkdirSync(jsDir);

  const fileName = path === "/" ? "index.js" : path.replace(/^\/|\/$/g, "").replace(/\//g, "-") + ".js";
  const jsContent = generateScriptContent(events);
  writeFileSync(join(jsDir, fileName), jsContent, "utf8");

  return join("js", fileName);
}

function extractExposedVariables(source) {
  const lines = source.split("\n");
  const injected = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") continue;

    if (trimmed.startsWith("// @ssg-let")) {
      const decl = trimmed.replace("// @ssg-let", "").replace(/;$/, "").trim();
      injected.push(`let ${decl};`);
    } else if (trimmed.startsWith("// @ssg-const")) {
      const decl = trimmed.replace("// @ssg-const", "").replace(/;$/, "").trim();
      injected.push(`const ${decl};`);
    } else if (!trimmed.startsWith("//")) {
      break; // stop at first non-comment code line
    }
  }

  return injected;
}

function destructureFunction(fnSource) {
  const funcMatch = fnSource.match(/^function\s*([a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{([\s\S]*)\}$/);
  if (funcMatch) {
    const [, name, body] = funcMatch;
    return { name: name.trim(), body: body.trim() };
  }

  const arrowMatch = fnSource.match(/^\(?[a-zA-Z0-9_,\s]*\)?\s*=>\s*\{([\s\S]*)\}$/);
  if (arrowMatch) {
    return { name: "", body: arrowMatch[1].trim() };
  }

  return { name: "", body: "" };
}

function indent(str, level = 1) {
  const pad = "  ".repeat(level);
  return str
    .split("\n")
    .map((line) => pad + line)
    .join("\n");
}
