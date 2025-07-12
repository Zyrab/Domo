// Base.js
const isServer = typeof document === "undefined";

/**
 * @class Base
 * @description The foundational class for creating and managing DOM or virtual elements.
 * Handles the basic setup and provides access to the underlying element.
 */
class Base {
  /**
   * @private
   * @property {boolean} _virtual - True if running in a server-side (virtual DOM) environment.
   */
  _virtual;

  /**
   * @property {HTMLElement|object} element - The actual DOM element or its virtual representation.
   */
  element;

  /**
   * Creates an instance of Base.
   * @param {string} [el="div"] - The HTML tag name for the element to create (e.g., 'div', 'span', 'button').
   */
  constructor(el = "div") {
    this._virtual = isServer;
    this.element = this._virtual ? this._vel(el) : this.el(el);
  }

  /**
   * Creates a real HTML DOM element.
   * @param {string} el - The HTML tag name (e.g., 'div', 'p').
   * @returns {HTMLElement} The created DOM element.
   * @example
   * // Internally used:
   * // this.el('div'); // Creates a <div> element
   */
  el(el) {
    return document.createElement(String(el || "div").toLowerCase());
  }

  /**
   * Creates a simple JavaScript object representing a virtual element for server-side rendering.
   * @private
   * @param {string} el - The HTML tag name.
   * @returns {object} A plain object structure representing the virtual element.
   * @example
   * // Internally used for server-side:
   * // this._vel('div'); // Returns { _tag: 'div', _cls: [], ... }
   */
  _vel(el) {
    return {
      _tag: el,
      _cls: [],
      _data: {},
      _attr: {},
      _css: {},
      _child: [],
      _events: [],
    };
  }

  /**
   * In browser context, passes the actual DOM element to the callback.
   *
   * @param {function(HTMLElement|string): void} callback -
   *        Receives  the actual DOM element (in browser).
   *
   * @returns {this} The current Domo instance for chaining.

  **/
  ref(callback) {
    if (this._virtual) return this;
    if (typeof callback === "function") callback(this.element);

    return this;
  }
}

export default Base;
