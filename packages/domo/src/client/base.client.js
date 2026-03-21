/**
 * @class BaseClient
 * @description Foundational class for Client-side Domo elements.
 */
class BaseClient {
  /**
   * @property {HTMLElement} element - The actual DOM element.
   */
  element;

  /**
   * @property {boolean} _isDomo - Flag to identify Domo instances.
   */
  _isDomo = true;

  /**
   * Creates an instance of BaseClient.
   * @param {string} [el="div"] - The HTML tag name.
   */
  constructor(el = "div") {
    this.element = document.createElement(String(el || "div").toLowerCase());
  }
  island(component, enabled = true) {
    this.element.appendChild(this._handleElementInstance(component()));
    return this;
  }
  /**
   * In browser context, passes the actual DOM element to the callback.
   * @param {function(HTMLElement): void} callback
   * @returns {this}
   */
  ref(callback) {
    if (typeof callback === "function") callback(this.element);
    return this;
  }
}

export default BaseClient;
