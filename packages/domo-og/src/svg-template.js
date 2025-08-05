export function getDefaultSvg(title) {
  const lines = splitTitle(title);
  const svgLines = lines.map((line, i) => `<tspan x="600" dy="${i === 0 ? 0 : "1.5em"}">${line}</tspan>`).join("");
  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#272727"/>
    <rect width="1200" height="47" fill="#474444"/>
    <rect width="233" height="47" fill="#3A3838"/>
    <text id="JS" fill="#E9FA00" xml:space="preserve" style="white-space: pre" font-family="Fira Mono" font-size="26.4" font-weight="bold" letter-spacing="0.04em"><tspan x="5" y="32.344">JS</tspan></text>
    <text id="Zyrab.dev" fill="white" xml:space="preserve" style="white-space: pre" font-family="Fira Mono" font-size="26.4" letter-spacing="0.04em"><tspan x="50" y="32.344">Zyrab.dev</tspan></text>
    <text id="x" fill="#928585" xml:space="preserve" style="white-space: pre" font-family="Actor" font-size="28.8" letter-spacing="0.04em"><tspan x="213" y="33.2776">x</tspan></text>
    <ellipse id="Ellipse 21" cx="1095.84" cy="23.5" rx="11.232" ry="10.53" fill="#FF0000"/>
    <ellipse id="Ellipse 22" cx="1137.5" cy="23.5" rx="11.232" ry="10.53" fill="#FFFF00"/>
    <ellipse id="Ellipse 23" cx="1179.17" cy="23.5" rx="11.232" ry="10.53" fill="#008000"/>
    <text x="600" y="300" text-anchor="middle" dominant-baseline="middle" fill="#F5BC00" font-family="Cutive Mono" font-size="76" letter-spacing="0.04em" >
      ${svgLines}
    </text>  
  </svg>
`;
  return svg;
}

// this will split long titles on seprate lines.
function splitTitle(title, maxLength = 25) {
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
