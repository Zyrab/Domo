import { fetchImageAsBase64 } from "./fetchers.js";
import { formatTextLines, injectData, calculateLayout } from "./utils.js";

export async function buildSvgFromConfig(config, data = {}) {
  const filledConfig = injectData(config, data);
  const { width = 1200, height = 630, background, elements = [] } = filledConfig;

  let svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

  if (background) {
    if (background.type === "color")
      svgContent += `<rect width="${width}" height="${height}" fill="${background.value}" />`;
    else if (background.type === "image") {
      const base64Data = await fetchImageAsBase64(background.src);
      svgContent += `<image href="${base64Data}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />`;
    }
  }

  for (const el of elements) {
    const { x, y } = calculateLayout(el, width, height);

    if (el.type === "image") {
      const base64Data = await fetchImageAsBase64(el.src);
      svgContent += `<image href="${base64Data}" x="${x}" y="${y}" width="${el.width || 100}" height="${el.height || 100}" preserveAspectRatio="xMidYMid slice"/>`;
      continue;
    }

    if (el.type === "text") {
      const fontSize = el.fontSize || 32;
      const lineHeightEm = el.lineHeightEm || 1.2;

      const calculatedMaxLength = el.maxLength || Math.floor((el.width || width) / (fontSize * 0.6));
      const {
        svg: textContent,
        textWidth,
        textHeight,
      } = formatTextLines(el.content, {
        x,
        maxLength: calculatedMaxLength,
        lineHeightEm,
        verticalAlign: el.verticalAlign,
        fontSize,
      });

      if (el.backgroundColor && textContent !== "") {
        const bgPadding = el.bgPadding || 10;

        let rectX = x - bgPadding;
        if (el.horizontalAlign === "center") rectX = x - textWidth / 2 - bgPadding;
        if (el.horizontalAlign === "right") rectX = x - textWidth - bgPadding;

        let rectY = y - fontSize - bgPadding;
        if (el.verticalAlign === "middle") rectY = y - (fontSize * 0.35) - textHeight / 2 - bgPadding;
        if (el.verticalAlign === "bottom") rectY = y + (fontSize * 0.25) - textHeight - bgPadding;

        svgContent += `<rect x="${rectX}" y="${rectY}"
          width="${textWidth + bgPadding * 2}"
          height="${textHeight + bgPadding * 2}"
          fill="${el.backgroundColor}"
          rx="${el.borderRadius || 0}"
        />`;
      }

      let textAnchor = "start";
      if (el.horizontalAlign === "center") textAnchor = "middle";
      if (el.horizontalAlign === "right") textAnchor = "end";

      svgContent += `<text x="${x}" y="${y}" fill="${el.color}" font-family="${el.fontFamily}" font-size="${fontSize}" text-anchor="${textAnchor}">
        ${textContent}
      </text>`;
    }
  }

  svgContent += `</svg>`;
  return svgContent;
}
