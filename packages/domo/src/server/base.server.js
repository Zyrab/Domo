import { fileURLToPath } from "url";
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
      _state: {},
      __file: null,
    };
  }

  /**
   * Manually mark this element/component as an island.
   * This signals the SSG to bundle the Domo client runtime.
   */
  island(enabled = true) {
    this.element._island = enabled;
    this._getOrSetId();
    if (enabled) {
      this.element.__file = this._getCallerFile(2); // Captures the component file path
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
        name: meta._name || callback.name || "anonymous",
        path: meta._source || null, // The absolute path s
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
  /**
   * Gets the file path of the caller in the stack trace.
   * @param {number} depth - How many steps back to look (default 2: the caller of the caller)
   */
  _getCallerFile(depth = 2) {
    const originalPrepare = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = new Error().stack;
    Error.prepareStackTrace = originalPrepare;

    if (!stack || !stack[depth]) return null;

    const filename = stack[depth].getFileName();

    // Clean up "file://" prefixes for Windows/ESM compatibility
    if (filename && filename.startsWith("file://")) {
      return fileURLToPath(filename);
    }
    return filename;
  }
  _getExternalPath(fn, currentFile) {
    // If the function has no name and is very short, it's likely an inline arrow fn
    // However, the most reliable way in Node is checking the stack
    const caller = getCallerFile(3); // Adjust depth based on where this is called

    // Logic: If we can't find a source, or the source is the same as the
    // component currently being built, we treat it as "inline".
    if (!caller || caller === currentFile) {
      return null;
    }

    return caller;
  }
}

export default BaseServer;
