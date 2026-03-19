import PropertiesClient from "./properties.client.js";

/**
 * @class ClassesClient
 * @extends PropertiesClient
 */
class ClassesClient extends PropertiesClient {
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
    this.element.classList.add(...clsList);
    return this;
  }

  rmvCls(classes) {
    if (classes) {
      this.element.classList.remove(...this._parseClassList(classes));
    }
    return this;
  }

  tgglCls(className, force) {
    this.element.classList.toggle(className, force);
    return this;
  }
}

export default ClassesClient;
