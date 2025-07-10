import { DomoClass } from "../domo/src/domo.js"; // Assuming this path points to the main DomoClass export

/**
 * @class DomoSVG
 * @augments DomoClass
 * @description Extends the core DomoClass to provide specialized creation and manipulation
 * of SVG (Scalable Vector Graphics) elements, ensuring correct SVG namespace handling.
 * Only accepts valid SVG tag names.
 */
class DomoSVG extends DomoClass {
  /**
   * Creates an instance of DomoSVG.
   * @param {string} [tag="svg"] - The SVG tag name for the element to create (e.g., 'svg', 'path', 'circle').
   * @throws {Error} If the provided tag is not a valid SVG element tag.
   */
  constructor(tag = "svg") {
    // Call the parent DomoClass constructor with the tag
    super(tag);
    // In a browser environment, perform the SVG tag validation immediately.
    // In a virtual (SSR) environment, this check is less critical here as it's just building an object.
    if (typeof document !== "undefined" && !this.isSVGTag(tag)) {
      throw new Error(`Invalid SVG tag: ${tag}`);
    }
  }

  /**
   * Checks if the given tag is a recognized SVG element tag.
   * This is used internally to validate SVG element creation.
   * @param {string} tag - The tag name to check (e.g., "svg", "circle", "g").
   * @returns {boolean} `true` if the tag is a valid SVG element, `false` otherwise.
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
   * Overrides the `el` method from `DomoClass` to create SVG elements
   * within the correct SVG namespace. This is crucial for SVG elements
   * to render correctly in the browser.
   * @override
   * @param {string} tag - The SVG tag name (e.g., "rect", "circle").
   * @returns {SVGElement} The created SVG element.
   */
  el(tag) {
    // Only create with NS if it's an SVG tag. Fallback to regular DOM creation if not (though constructor validates this).
    return this.isSVGTag(tag) ? document.createElementNS("http://www.w3.org/2000/svg", tag) : super.el(tag); // Fallback to regular DOM creation
  }

  /**
   * Overrides the `attr` method from `DomoClass` to correctly set attributes
   * for SVG elements using `setAttributeNS` with a `null` namespace,
   * which is the standard for most SVG attributes.
   *
   * @override
   * @param {Record<string, any>} [attributes={}] - An object where keys are attribute names and values are their desired values.
   * Attributes starting with "on" (event handlers) and attributes with `null` values are skipped.
   * @returns {this} The current DomoSVG instance for chaining.
   * @example
   * DSVG('circle').attr({ cx: 50, cy: 50, r: 40, fill: 'red' });
   * // Equivalent to: <circle cx="50" cy="50" r="40" fill="red"></circle>
   */
  attr(attributes = {}) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith("on")) return; // Skip event attributes
      if (value === null) return; // Skip null values

      if (this._virtual) {
        this.element._attr[key] = value;
      } else {
        // Use setAttributeNS with null namespace for most SVG attributes
        this.element.setAttributeNS(null, key, value);
      }
    });
    return this;
  }
}

/**
 * A factory function to create a new `DomoSVG` element instance.
 * This is the recommended way to start building SVG elements, avoiding the need for the `new` keyword.
 * @param {string} [el="svg"] - The SVG tag name for the element to create (e.g., 'svg', 'circle', 'path').
 * @returns {DomoSVG} A new DomoSVG instance, ready for method chaining.
 * @example
 * // Create a basic SVG container:
 * const mySVG = DSVG('svg').attr({ width: 100, height: 100 });
 *
 * // Create a circle inside an SVG:
 * const myCircle = DSVG('circle').attr({ cx: 50, cy: 50, r: 20, fill: 'blue' });
 * mySVG.child(myCircle).appendTo(document.body);
 */
function DSVG(el = "svg") {
  return new DomoSVG(el);
}

// Export the factory function as the default export
export default DSVG;

/**
 * The `DomoSVG` class itself.
 * Exported for scenarios where direct class access or extension is required,
 * though the `DSVG` factory function is preferred for standard usage.
 * @type {DomoSVG}
 */
export { DomoSVG };
