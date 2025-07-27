class Builder {
  /**
   * Builds and returns the final DOM element or its HTML string representation.
   * If running in a browser environment, it returns the actual HTML element.
   * If running in a server-side (virtual DOM) environment, it generates an HTML string.
   * @returns {HTMLElement|string} The constructed DOM element or an HTML string.
   * @example
   * // In a browser:
   * const myDiv = Domo('div').txt('Hello').build();
   * document.body.appendChild(myDiv); // myDiv is an actual <div> element
   *
   * @example
   * // In a server-side environment:
   * // const htmlString = Domo('p').txt('Server-rendered content').build();
   * // console.log(htmlString); // Outputs: "<p>Server-rendered content</p>"
   */
  build() {
    if (!this._virtual) return this.element; // If not virtual, return the actual DOM element

    const tag = this.element._tag;
    const cls = this.element._cls.join(" ");
    const toKebab = (s) => s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const css = Object.entries(this.element._css)
      .map(([k, v]) => `${toKebab(k)}:${v}`)
      .join(";");

    const attrs = Object.entries(this.element._attr).map(([k, v]) =>
      v === true ? k : `${k}="${String(v).replace(/"/g, "&quot;")}"`
    );

    const data = Object.entries(this.element._data).map(([k, v]) => `data-${k}="${String(v).replace(/"/g, "&quot;")}"`);

    if (cls) attrs.push(`class="${cls}"`);
    if (css) attrs.push(`style="${css}"`);
    const escapeHTML = (str) => String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const attrStr = attrs.concat(data).join(" ");
    const children = this.element._child
      .map((c) => (typeof c === "string" ? escapeHTML(c) : c.build?.() || ""))
      .join("");

    return `<${tag}${attrStr ? " " + attrStr : ""}>${children}</${tag}>`;
  }
}

export default Builder;
