// import { fileURLToPath } from "url";
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
      __island: null,
      _state: {},
    };
  }

  /**
   * Manually mark this element/component as an island.
   * This signals the SSG to bundle the Domo client runtime.
   */
  island(component, enabled = true) {
    this.element._island = enabled;
    this._getOrSetId();

    if (enabled) {
      this.element.__island = component;
    }

    return this;
  }

  /**
   * On the server, captures the reference handler's name for ESM extraction.
   * @param {Function} callback
   * @returns {this}
   */
  ref(callback) {
    if (typeof callback === "function") {
      this.element._refs.push({
        // 2. Use callback.name, or fallback to "anonymous"
        // (Removed 'meta' reference which caused the crash)
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
    const existing = this.element._attr["data-domo-id"];
    if (existing) {
      return existing;
    }
    const hash = Math.random().toString(36).substring(2, 7);
    const id = `d-${hash}`;
    this.element._attr["data-domo-id"] = id;
    return id;
  }
}

export default BaseServer;
