import Domo from "@zyrab/domo";
import DSVG from "@zyrab/domo-svg";
import icons from "../../assets/preview-images/icons.js";

export default function createIcon({ icon, size, alt = "" }) {
  let child;
  if (!size) {
    console.warn(`Icon ${icon} missing 'size'. Set the size property or style manually via CSS.`);
  }
  const iconLib = icons?.[icon] || icon;

  if (typeof icon === "string" && !iconLib?.viewBox) {
    child = Domo("img")
      .css(size ? { width: size, height: size } : "")
      .attr({
        loading: "lazy",
        src: icon,
        alt,
        "aria-hidden": alt ? "false" : "true",
      });
  } else if (iconLib?.viewBox && Array.isArray(iconLib?.paths)) {
    const isDecorative = !alt;

    child = DSVG("svg")
      .css(size ? { width: size, height: size } : "")
      .attr({
        viewBox: iconLib?.viewBox,
        role: "img",
        "aria-hidden": isDecorative ? "true" : "false",
        "aria-label": isDecorative ? null : alt,
        focusable: "false",
      })
      .child(
        [
          !isDecorative ? Domo("title").txt(alt) : null,
          ...iconLib.paths.map((shape) => DSVG("path").attr(shape)),
        ].filter(Boolean),
      );
  } else {
    console.warn("No icon");
    child = null;
  }

  return Domo("span")
    .cls("icon-component")
    .child(child ? [child] : []);
}
