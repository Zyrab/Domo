import Domo from "./Domo.js";
class DomoSVG extends Domo {
  constructor(tag = "svg") {
    super(tag); // Call Domo constructor with tag
    if (!this.isSVGTag(tag)) {
      throw new Error(`Invalid SVG tag: ${tag}`);
    }
  }

  /**
   * Check if the tag is a valid SVG element.
   * @param {string} tag
   * @returns {boolean}
   */
  isSVGTag(tag) {
    const svgTags = [
      "svg",
      "path",
      "circle",
      "rect",
      "line",
      "ellipse",
      "polygon",
      "g",
      "text",
      "use",
      "defs",
      "clipPath",
      "marker",
      "mask",
      "style",
      "linearGradient",
      "radialGradient",
      "stop",
    ];
    return svgTags.includes(tag);
  }

  /**
   * Override the el method to handle SVG namespace creation.
   * @param {string} tag
   * @returns {HTMLElement}
   */
  el(tag) {
    return this.isSVGTag(tag)
      ? document.createElementNS("http://www.w3.org/2000/svg", tag)
      : super.el(tag); // Fallback to regular DOM creation
  }

  /**
   * Set attributes specific to SVG elements.
   * @param {Record<string, any>} attributes
   * @returns {DomoSVG}
   */
  attr(attributes = {}) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith("on")) return;
      if (value != null) {
        this.element.setAttributeNS(null, key, value); // Set using SVG-specific namespace
      }
    });
    return this;
  }
}
export default DomoSVG;
