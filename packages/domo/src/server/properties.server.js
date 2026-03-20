import BaseServer from "./base.server.js";

/**
 * @class PropertiesServer
 * @extends BaseServer
 */
class PropertiesServer extends BaseServer {
  /**
   * Sets a metadata property.
   * @protected
   * @param {string} key
   * @param {*} val
   * @param {string} [type="_attr"]
   * @returns {this}
   */
  _set(key, val, type = "_attr") {
    if (val === undefined) return this;
    if (type === "txt") {
      this.element._child.push(String(val));
    } else {
      this.element[type][key] = val;
    }
    return this;
  }

  id(id) {
    return this._set("id", id);
  }

  val(value) {
    return this._set("value", value);
  }

  txt(text) {
    return this._set("textContent", text, "txt");
  }

  attr(attributes = {}) {
    for (const [key, value] of Object.entries(attributes)) {
      this.element._attr[key] = value;
    }
    return this;
  }

  tgglAttr(attrName, force) {
    if (typeof force === "boolean") {
      if (force) this.element._attr[attrName] = true;
      else delete this.element._attr[attrName];
    } else {
      if (this.element._attr[attrName]) delete this.element._attr[attrName];
      else this.element._attr[attrName] = true;
    }
    return this;
  }

  data(data = {}) {
    Object.entries(data).forEach(([key, val]) => {
      this.element._data[key] = val;
    });
    return this;
  }

  css(styles = {}) {
    Object.assign(this.element._css, styles);
    return this;
  }

  /**
   * Serializes state object into data-domo-state attribute.
   * @param {object} obj
   * @returns {this}
   */
  state(state = {}) {
    Object.entries(state).forEach(([key, val]) => {
      this.element._state[key] = val;
    });
    return this;
  }
}

export default PropertiesServer;
