class Domo {
  constructor(el = "div") {
    this.element = this.el(el);
  }
  el(el) {
    try {
      document.createElement(el);
    } catch (error) {
      console.error(`Error creating element: ${el}`, error);
      return null;
    }
    return el;
  }
  ref(cb) {
    if (typeof cb === "function") cb(this.element);
    return this;
  }

  id(id) {
    if (id) this.element.id = id;
    return this;
  }

  val(value) {
    if (value !== undefined) this.element.value = value;
    return this;
  }

  txt(text) {
    if (text !== undefined) this.element.textContent = text;
    return this;
  }

  cls(classes) {
    if (classes) {
      this.element.classList.add(...classes.split(" ").filter(Boolean));
    }
    return this;
  }
  rmvCls(classes) {
    if (classes) {
      this.element.classList.remove(...classes.split(" ").filter(Boolean));
    }
    return this;
  }
  tglCls(className, force) {
    this.element.classList.toggle(className, force);
    return this;
  }

  attr(attributes = {}) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (!key.startsWith("on")) return this;
      if (typeof value === "boolean") {
        if (value) this.element.setAttribute(key, "");
        else this.element.removeAttribute(key);
      } else if (value != null) {
        this.element.setAttribute(key, value);
      }
    });
    return this;
  }
  tglAttr(attrName, force) {
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

  on(event, callback, options = {}) {
    this.element.addEventListener(event, callback, options);
    return this;
  }

  _handleDelegation(e, map, mode = "closest") {
    for (const [selector, handler] of Object.entries(map)) {
      const match = e.target?.[mode]?.(selector);
      if (match) handler(e, match);
    }
  }

  onDelegate(event, selectors = {}, options = {}) {
    return this.on(
      event,
      (e) => this._handleDelegation(e, selectors, "closest"),
      options
    );
  }

  onMatch(event, selectors = {}, options = {}) {
    return this.on(
      event,
      (e) => this._handleDelegation(e, selectors, "matches"),
      options
    );
  }

  chld(children = []) {
    const flattenedChildren = children.flat();
    flattenedChildren.forEach((child) => {
      if (child instanceof Node) {
        this.element.appendChild(child);
      } else if (typeof child === "string" || typeof child === "number") {
        this.element.appendChild(document.createTextNode(child));
      } else {
        console.warn("Skipping invalid child:", child);
      }
    });
    return this;
  }
  clear() {
    this.element.replaceChildren();
    return this;
  }
  replace(child, newChild) {
    if (child?.replaceWith && newChild instanceof Node) {
      child.replaceWith(newChild);
      if (child === this.element) this.element = newChild;
    }
    return this;
  }

  build() {
    return this.element;
  }
}

export default Domo;
