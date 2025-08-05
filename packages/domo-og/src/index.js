import path from "path";
import os, { tmpdir } from "os";
import fs from "fs";
import { execFileSync } from "child_process";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { getDefaultSvg } from "./svg-template.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const platform = os.platform();
const binary = platform === "win32" ? "resvg.exe" : "resvg";
const rsvgPath = path.join(_dirname, `../bin/${platform}/${binary}`);

export function generateOgImage({
  slug,
  title,
  svgTemplate, // optional
  outputDir,
}) {
  const tempSvgPath = path.join(tmpdir(), `${slug}-${randomUUID()}.svg`);
  const pngRelativePath = `assets/og-images/${slug}.png`;
  const pngPath = path.join(outputDir, pngRelativePath);

  const svgContent = svgTemplate ? svgTemplate.replace("{{title}}", title) : getDefaultSvg(title);

  fs.mkdirSync(path.dirname(pngPath), { recursive: true });
  fs.writeFileSync(tempSvgPath, svgContent);

  // Execute resvg
  execFileSync(rsvgPath, [tempSvgPath, pngPath]);

  // Cleanup
  fs.unlinkSync(tempSvgPath);
  console.log(pngRelativePath);
  return pngRelativePath;
}
