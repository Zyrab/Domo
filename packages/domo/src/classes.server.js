import PropertiesServer from "./properties.server.js";

/**
 * @class ClassesServer
 * @extends PropertiesServer
 */
class ClassesServer extends PropertiesServer {
  /**
   * Normalizes various inputs into a clean array of class names.
   * @private
   */
  _parseClassList(input) {
    return Array.isArray(input) ? input.filter(Boolean) : String(input).split(" ").filter(Boolean);
  }

  cls(classes) {
    if (!classes) return this;
    const clsList = this._parseClassList(classes);
    this.element._cls.push(...clsList);
    return this;
  }

  rmvCls(classes) {
    if (classes) {
      const clsList = this._parseClassList(classes);
      this.element._cls = this.element._cls.filter((c) => !clsList.includes(c));
    }
    return this;
  }

  tgglCls(className, force) {
    const active = typeof force === "boolean" ? force : !this.element._cls.includes(className);
    if (active) {
      if (!this.element._cls.includes(className)) this.element._cls.push(className);
    } else {
      this.element._cls = this.element._cls.filter((c) => c !== className);
    }
    return this;
  }
}

export default ClassesServer;
