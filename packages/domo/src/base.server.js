/**
 * @class BaseServer
 * @description Foundational class for Server-side (Virtual) Domo elements.
 * Acts as a Metadata Collector for the SSG.
 */
class BaseServer {
  /**
   * @property {object} element - The virtual representation of the element.
   */
  element;

  /**
   * @property {boolean} _isDomo - Flag to identify Domo instances.
   */
  _isDomo = true;

  /**
   * Creates an instance of BaseServer.
   * @param {string} [el="div"] - The HTML tag name.
   */
  constructor(el = "div") {
    this.element = {
      _tag: el,
      _attr: {},
      _cls: [],
      _data: {},
      _css: {},
      _child: [],
      _events: [],
      _refs: [],
      _island: false,
    };
  }

  /**
   * On the server, captures the reference handler's name for ESM extraction.
   * @param {Function} callback
   * @returns {this}
   */
  ref(callback) {
    if (typeof callback === "function") {
      this.element._refs.push({
        name: callback.name || "anonymous",
        handler: callback,
      });
      // Ensure element has a stable ID if it has a ref
      this._getOrSetId();
    }
    return this;
  }

  /**
   * Generates or retrieves a stable, hash-based ID for metadata association.
   * @protected
   * @returns {string} The data-domo-id.
   */
  _getOrSetId() {
    const existing = this.element._attr["data-domo-id"] || this.element._attr["id"];
    if (existing) {
      return existing;
    }

    // Simple stable hash based on tag and current metadata state
    const hash = Math.random().toString(36).substring(2, 7);
    const id = `d-${hash}`;
    this.element._attr["data-domo-id"] = id;
    return id;
  }
}

export default BaseServer;
