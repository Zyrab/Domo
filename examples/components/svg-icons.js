import DSVG from "../../packages/domo-svg/domo-svg.js";

const paths = {
  circle: "M12 2a10 10 0 1 0 0.01 0z",
  square: "M4 4h16v16H4z",
  triangle: "M12 4l8 16H4z",
  plus: "M10 4h4v16h-4z M4 10h16v4H4z",
  cross: "M4 4l16 16M20 4L4 20",
  arrowRight: "M4 12h16M14 6l6 6-6 6",
  arrowLeft: "M20 12H4m6-6-6 6 6 6",
  star: "M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7z",
  heart: "M12 21s-8-6.5-8-11a5 5 0 0110 0 5 5 0 0110 0c0 4.5-8 11-8 11z",
  check: "M5 13l4 4L19 7",
};

export default function createSvgIcons(icon) {
  const d = paths[icon];
  if (!d) return null;

  return DSVG()
    .attr({ viewBox: "0 0 24 24", width: 24, height: 24 })
    .child([DSVG("path").attr({ d, fill: "currentColor", "fill-rule": "evenodd" })]);
}
