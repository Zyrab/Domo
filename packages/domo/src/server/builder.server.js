import ChildrenServer from "./children.server.js";

/**
 * @class BuilderServer
 * @extends ChildrenServer
 */
class BuilderServer extends ChildrenServer {
  /**
   * Serializes the virtual element and its metadata into an HTML string.
   * @returns {string}
   */
  build() {
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

    const attrStr = attrs.concat(data).join(" ");

    const escapeHTML = (str) => String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const children = this.element._child
      .map((c) => {
        if (typeof c === "string" || typeof c === "number") return escapeHTML(c);
        if (c && typeof c.build === "function") return c.build();
        return "";
      })
      .join("");

    return `<${tag}${attrStr ? " " + attrStr : ""}>${children}</${tag}>`;
  }
}

export default BuilderServer;
