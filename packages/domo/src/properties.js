class Properties {
  /**
   * Sets a property on the element or its virtual representation.
   * This is a core internal method used by id(), val(), and txt().
   * @private
   * @param {string} key - The property name (e.g., "id", "value", "textContent").
   * @param {*} val - The value to set for the property.
   * @param {string} [type="_attr"] - Internal type for virtual DOM handling (e.g., "txt" for textContent).
   * @returns {this} The current Domo instance for chaining.
   */
  _set(key, val, type = "_attr") {
    if (val === undefined) return this;
    if (this._virtual) {
      if (type === "txt") {
        this.element._child.push(String(val));
      } else {
        this.element[type][key] = val;
      }
    } else {
      this.element[key] = val;
    }
    return this;
  }

  /**
   * Sets the 'id' attribute of the element.
   * @param {string} id - The ID string to set.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('div').id('myUniqueId');
   */
  id(id) {
    return this._set("id", id);
  }

  /**
   * Sets the 'value' property of the element. Useful for input fields, text areas, or select elements.
   * @param {string} value - The value to set.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('input').val('Initial text');
   */
  val(value) {
    return this._set("value", value);
  }

  /**
   * Sets the visible text content of the element. This replaces any existing child text or elements.
   * @param {string} text - The text string to display.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('p').txt('This is some paragraph text.');
   */
  txt(text) {
    return this._set("textContent", text, "txt");
  }

  /**
   * Sets multiple HTML attributes on the element.
   * Boolean `true` values will set the attribute without a value (e.g., `disabled`).
   * @param {Record<string, any>} attributes - An object where keys are attribute names and values are their desired values.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('button').attr({
   * type: 'submit',
   * disabled: true,
   * 'aria-label': 'Submit Form'
   * });
   */
  attr(attributes = {}) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith("on")) return; // Skip event attributes, handled separately
      if (this._virtual) this.element._attr[key] = value;
      else if (typeof value === "boolean") {
        if (value) this.element.setAttribute(key, "");
        else this.element.removeAttribute(key);
      } else if (value != null) {
        this.element.setAttribute(key, value);
      }
    });
    return this;
  }

  /**
   * Toggles a boolean HTML attribute (e.g., `hidden`, `disabled`) on or off.
   * @param {string} attrName - The name of the attribute to toggle.
   * @param {boolean} [force] - If `true`, the attribute is added. If `false`, it's removed.
   * If omitted, the attribute's presence is flipped.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * // Toggle 'hidden' attribute:
   * Domo('div').tgglAttr('hidden');
   * // Force add 'disabled' attribute:
   * Domo('button').tgglAttr('disabled', true);
   */
  tgglAttr(attrName, force) {
    if (attrName.startsWith("on")) return; // Skip event attributes
    if (typeof force === "boolean") {
      if (force) {
        this.element.setAttribute(attrName, "");
      } else {
        this.element.removeAttribute(attrName);
      }
    } else {
      if (this.element.hasAttribute(attrName)) {
        this.element.removeAttribute(attrName);
      } else {
        this.element.setAttribute(attrName, "");
      }
    }
    return this;
  }

  /**
   * Sets custom `data-*` attributes on the element.
   * @param {Record<string, string>} data - An object where keys are data attribute names (camelCase) and values are their strings.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('div').data({
   * userId: '123',
   * itemName: 'Laptop'
   * });
   * // This results in: <div data-user-id="123" data-item-name="Laptop"></div>
   */
  data(data = {}) {
    Object.entries(data).forEach(([key, val]) => {
      if (this._virtual) this.element._data[key] = val;
      else this.element.dataset[key] = val;
    });
    return this;
  }

  /**
   * Applies CSS styles directly to the element's `style` property.
   * @param {Partial<CSSStyleDeclaration>} styles - An object where keys are CSS property names (camelCase) and values are their style values.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('p').css({
   * color: 'blue',
   * fontSize: '16px',
   * marginTop: '10px'
   * });
   */
  css(styles = {}) {
    if (this._virtual) Object.assign(this.element._css, styles);
    else Object.assign(this.element.style, styles);
    return this;
  }
}

export default Properties;
