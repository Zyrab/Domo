/**
 * Domo - Lightweight helper class for creating and manipulating DOM elements fluently.
 */
class Domo {
  /**
   * @param {string} [el='div'] - The tag name of the element to create.
   */
  constructor(el = "div") {
    this.element = this.el(el);
  }

  /**
   * Creates a DOM element.
   * @param {string} el - Element tag name.
   * @returns {HTMLElement}
   */
  el(el) {
    return document.createElement(String(el || "div").toLowerCase());
  }

  /**
   * Provides direct reference to the created element.
   * @param {(el: HTMLElement) => void} callBack
   * @returns {Domo}
   */
  ref(callBack) {
    if (typeof callBack === "function") callBack(this.element);
    return this;
  }

  /**
   * Sets a property on the element if the value is not undefined.
   * @private
   * @param {string} key
   * @param {*} val
   * @returns {Domo}
   */
  _set(key, val) {
    if (val !== undefined) this.element[key] = val;
    return this;
  }

  /** @param {string} id */
  id(id) {
    return this._set("id", id);
  }

  /** @param {string} value */
  val(value) {
    return this._set("value", value);
  }

  /** @param {string} text */
  txt(text) {
    return this._set("textContent", text);
  }

  /**
   * Normalizes a class list input.
   * @private
   * @param {string|string[]} input
   * @returns {string[]}
   */
  _parseClassList(input) {
    return Array.isArray(input)
      ? input.filter(Boolean)
      : String(input).split(" ").filter(Boolean);
  }

  /**
   * Adds classes
   *  @param {string|string[]} classes
   */
  cls(classes) {
    if (classes) {
      this.element.classList.add(...this._parseClassList(classes));
    }
    return this;
  }

  /**
   * Removes classes
   *   @param {string|string[]} classes
   */
  rmvCls(classes) {
    if (classes) {
      this.element.classList.remove(...this._parseClassList(classes));
    }
    return this;
  }

  /**
   * Toggles a class.
   * @param {string} className
   * @param {boolean} [force]
   */
  tgglCls(className, force) {
    this.element.classList.toggle(className, force);
    return this;
  }

  /**
   * Sets attributes (skips event attributes).
   * @param {Record<string, any>} attributes
   */
  attr(attributes = {}) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith("on")) return;
      if (typeof value === "boolean") {
        if (value) this.element.setAttribute(key, "");
        else this.element.removeAttribute(key);
      } else if (value != null) {
        this.element.setAttribute(key, value);
      }
    });
    return this;
  }

  /**
   * Toggles an attribute.
   * @param {string} attrName
   * @param {boolean} [force]
   */
  tgglAttr(attrName, force) {
    if (attrName.startsWith("on")) return;
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
   * Sets data-* attributes.
   * @param {Record<string, string>} data
   */
  data(data = {}) {
    Object.entries(data).forEach(([key, val]) => {
      this.element.dataset[key] = val;
    });
    return this;
  }

  /**
   * Sets CSS styles.
   * @param {Partial<CSSStyleDeclaration>} styles
   */
  css(styles = {}) {
    Object.assign(this.element.style, styles);
    return this;
  }

  /**
   * Adds an event listener.
   * @param {string} event
   * @param {EventListenerOrEventListenerObject} callback
   * @param {AddEventListenerOptions} [options]
   */
  on(event, callback, options = {}) {
    this.element.addEventListener(event, callback, options);
    return this;
  }

  /** @private */
  _handleClosest(e, map) {
    for (const [selector, handler] of Object.entries(map)) {
      const match = e.target.closest(selector);
      if (match) handler(e, match);
    }
  }

  /**
   * Delegates events to closest matching ancestor.
   * @param {string} event
   * @param {Record<string, (e: Event, target: Element) => void>} selectors
   * @param {AddEventListenerOptions} [options]
   */
  onClosest(event, selectors = {}, options = {}) {
    return this.on(event, (e) => this._handleClosest(e, selectors), options);
  }

  /** @private */
  _handleMatches(e, map) {
    for (const [selector, handler] of Object.entries(map)) {
      if (e.target.matches(selector)) handler(e, e.target);
    }
  }

  /**
   * Delegates events using element.matches.
   * @param {string} event
   * @param {Record<string, (e: Event, target: Element) => void>} selectors
   * @param {AddEventListenerOptions} [options]
   */
  onMatch(event, selectors = {}, options = {}) {
    return this.on(event, (e) => this._handleMatches(e, selectors), options);
  }

  /** @private */
  _handleElementInstance(element) {
    if (element instanceof Domo) return element.build();
    if (element instanceof DocumentFragment) return element;
    if (element instanceof Node) return element;
    if (typeof element === "string" || typeof element === "number") {
      return document.createTextNode(element);
    }
    return document.createTextNode(`⚠ Invalid child: ${String(element)}`);
  }

  /**
   * Appends children (can be nested arrays, strings, numbers, fragments, elements).
   * @param {any[]} children
   */
  append(children = []) {
    const flattenedChildren = children.flat();
    flattenedChildren.forEach((child) => {
      this.element.appendChild(this._handleElementInstance(child));
    });
    return this;
  }

  /**
   * Removes all children.
   */
  clear() {
    this.element.replaceChildren();
    return this;
  }

  /**
   * Replaces a child element or self with a new one.
   * @param {Node} child
   * @param {any} newChild
   */
  replace(child, newChild) {
    const instance = this._handleElementInstance(newChild);

    if (child === this.element) {
      this.element.replaceWith(instance);
      this.element = instance;
    } else if (this.element.contains(child)) {
      child.replaceWith(instance);
    }

    return this;
  }

  /**
   * Shows or hides the element.
   * @param {boolean} [visible=true]
   * @param {string} [displayValue='block']
   */
  show(visible = true, displayValue = "block") {
    this.element.style.display = visible ? displayValue : "none";
    return this;
  }

  /**
   * Conditionally render element, or return dummy hidden placeholder.
   * @param {boolean} condition
   * @returns {Domo}
   */
  if(condition) {
    if (!condition) {
      return new Domo("if")
        .attr({ hidden: true })
        .data({ if: this.element.tagName.toLowerCase() });
    }
    return this;
  }

  /**
   * Returns the constructed DOM element.
   * @returns {HTMLElement}
   */
  build() {
    return this.element;
  }
}

export default Domo;
