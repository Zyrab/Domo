import { createHash } from "crypto";

const logOnceFlags = new Set();

export function logOnce(key, msg) {
  if (!logOnceFlags.has(key)) {
    console.info(msg);
    logOnceFlags.add(key);
  }
}
// Cache for hashing large templates to avoid repeated hashing per run
const templateHashCache = new Map();

export function getTemplateHash(template) {
  if (!templateHashCache.has(template)) {
    templateHashCache.set(template, hash(template));
  }
  return templateHashCache.get(template);
}

export function hash(input) {
  return createHash("sha256").update(input).digest("hex").slice(0, 10);
}

function splitTitle(title, maxLength) {
  const words = title.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length <= maxLength) {
      current += (current ? " " : "") + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function formatTitleLines(title, ogImageOptions) {
  const { maxLength = 25, x = 600, lineHeightEm = 1.5 } = ogImageOptions;
  const lines = splitTitle(title, maxLength);

  return lines
    .map((line, i) => {
      const dy = i === 0 ? 0 : `${lineHeightEm}em`;
      return `<tspan x="${x}" dy="${dy}">${line}</tspan>`;
    })
    .join("");
}
