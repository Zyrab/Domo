class Classes {
  /**
   * Normalizes various inputs into a clean array of class names.
   * Handles strings (space-separated) and arrays of strings.
   * @private
   * @param {string|string[]} input - A string of space-separated class names, or an array of class names.
   * @returns {string[]} An array of cleaned class names.
   */
  _parseClassList(input) {
    return Array.isArray(input) ? input.filter(Boolean) : String(input).split(" ").filter(Boolean);
  }

  /**
   * Adds one or more CSS classes to the element.
   * @param {string|string[]} classes - A single class name, a string of space-separated class names, or an array of class names.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('div').cls('active highlight');
   * Domo('button').cls(['btn', 'btn-primary']);
   */
  cls(classes) {
    if (!classes) return this;
    const clsList = this._parseClassList(classes);
    if (this._virtual) this.element._cls.push(...clsList);
    else this.element.classList.add(...clsList);
    return this;
  }

  /**
   * Removes one or more CSS classes from the element.
   * @param {string|string[]} classes - A single class name, a string of space-separated class names, or an array of class names.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('div').rmvCls('active');
   * Domo('p').rmvCls(['old-style', 'unused']);
   */
  rmvCls(classes) {
    if (classes) {
      this.element.classList.remove(...this._parseClassList(classes));
    }
    return this;
  }

  /**
   * Toggles a single CSS class on or off for the element.
   * @param {string} className - The class name to toggle.
   * @param {boolean} [force] - If `true`, the class is added. If `false`, it's removed.
   * If omitted, the class's presence is flipped.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * // Toggle 'active' class:
   * Domo('button').tgglCls('active');
   * // Force add 'highlight' class:
   * Domo('div').tgglCls('highlight', true);
   */
  tgglCls(className, force) {
    this.element.classList.toggle(className, force);
    return this;
  }
}

export default Classes;
