import BaseClient from "./base.client.js";

const _stateMap = new WeakMap();

/**
 * @class PropertiesClient
 * @extends BaseClient
 */
class PropertiesClient extends BaseClient {
  /**
   * Sets a property on the element.
   * @protected
   * @param {string} key
   * @param {*} val
   * @returns {this}
   */
  _set(key, val) {
    if (val === undefined) return this;
    this.element[key] = val;
    return this;
  }

  id(id) {
    return this._set("id", id);
  }

  val(value) {
    return this._set("value", value);
  }

  txt(text) {
    return this._set("textContent", text);
  }

  attr(attributes = {}) {
    for (const [key, value] of Object.entries(attributes)) {
      if (typeof value === "boolean") {
        value ? this.element.setAttribute(key, "") : this.element.removeAttribute(key);
      } else if (value != null) {
        this.element.setAttribute(key, value);
      }
    }
    return this;
  }

  tgglAttr(attrName, force) {
    if (typeof force === "boolean") {
      force ? this.element.setAttribute(attrName, "") : this.element.removeAttribute(attrName);
    } else {
      this.element.hasAttribute(attrName) ? this.element.removeAttribute(attrName) : this.element.setAttribute(attrName, "");
    }
    return this;
  }

  data(data = {}) {
    Object.entries(data).forEach(([key, val]) => {
      this.element.dataset[key] = val;
    });
    return this;
  }

  css(styles = {}) {
    Object.assign(this.element.style, styles);
    return this;
  }

  /**
   * Stores state object in a WeakMap for the client runtime.
   * @param {object} obj
   * @returns {this}
   */
  state(obj) {
    _stateMap.set(this.element, obj);
    return this;
  }
}

export default PropertiesClient;
