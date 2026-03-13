import { createHash } from "crypto";

const logOnceFlags = new Set();

export function logOnce(key, msg) {
  if (!logOnceFlags.has(key)) {
    console.info(msg);
    logOnceFlags.add(key);
  }
}

export function hash(input) {
  return createHash("sha256").update(input).digest("hex").slice(0, 10);
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// replacec {{dynamic}} tag insde template content ex: content: Hello {{name}} freind . {{name}} will be replaced from route content name
export function injectData(input, data) {
  if (typeof input === "string") {
    let result = input;

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string" || typeof value === "number") {
        result = result.split(`{{${key}}}`).join(value);
      }
    }

    return result;
  }

  if (Array.isArray(input)) return input.map((v) => injectData(v, data));

  if (input && typeof input === "object") {
    const out = {};
    for (const key in input) out[key] = injectData(input[key], data);
    return out;
  }

  return input;
}

export function calculateLayout(el, canvasWidth, canvasHeight) {
  const padding = el.padding || 0;

  let x;
  if (el.type === "image") {
    const w = el.width || 100;
    if (el.horizontalAlign === "left") x = padding;
    else if (el.horizontalAlign === "center") x = (canvasWidth - w) / 2;
    else if (el.horizontalAlign === "right") x = canvasWidth - w - padding;
    else x = el.x ?? 0;
  } else {
    if (el.horizontalAlign === "left") x = padding;
    else if (el.horizontalAlign === "center") x = canvasWidth / 2;
    else if (el.horizontalAlign === "right") x = canvasWidth - padding;
    else x = el.x ?? 0;
  }

  let y;
  if (el.type === "image") {
    const h = el.height || 100;
    if (el.verticalAlign === "top") y = padding;
    else if (el.verticalAlign === "middle") y = (canvasHeight - h) / 2;
    else if (el.verticalAlign === "bottom") y = canvasHeight - h - padding;
    else y = el.y ?? 0;
  } else if (el.type === "text") {
    const fontSize = el.fontSize || 32;
    if (el.verticalAlign === "top") y = padding + fontSize;
    else if (el.verticalAlign === "middle") y = canvasHeight / 2 + (fontSize * 0.35);
    else if (el.verticalAlign === "bottom") y = canvasHeight - padding - (fontSize * 0.25);
    else y = el.y ?? fontSize;
  } else {
    y = el.y ?? 0;
  }

  return { x, y };
}

function splitText(text, maxLength) {
  if (!text) return [];

  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    if ((current + (current ? " " : "") + word).trim().length <= maxLength) {
      current += (current ? " " : "") + word;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function formatTextLines(text, options = {}) {
  const { maxLength = 25, x = 0, lineHeightEm = 1.2, verticalAlign = "top", fontSize = 32 } = options;

  const lines = splitText(text, maxLength);

  if (!lines.length) return { svg: "", textWidth: 0, textHeight: 0 };

  const totalExtraHeight = (lines.length - 1) * lineHeightEm;

  const longestLineLength = Math.max(...lines.map((l) => l.length));
  const textWidth = longestLineLength * (fontSize * 0.6);
  const textHeight = lines.length * fontSize * lineHeightEm;

  const svg = lines
    .map((line, i) => {
      let dy = 0;

      if (i === 0) {
        if (verticalAlign === "bottom") dy = -totalExtraHeight;
        else if (verticalAlign === "middle") dy = -totalExtraHeight / 2;
      } else dy = lineHeightEm;

      const dyStr = dy === 0 ? "0" : `${dy}em`;
      return `<tspan x="${x}" dy="${dyStr}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return { svg, textWidth, textHeight };
}
