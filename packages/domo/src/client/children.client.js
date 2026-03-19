import EventsClient from "./events.client.js";

/**
 * @class ChildrenClient
 * @extends EventsClient
 */
class ChildrenClient extends EventsClient {
  _handleElementInstance(element) {
    if (element && element._isDomo) return element.build();
    if (element instanceof DocumentFragment || element instanceof Node) return element;
    if (typeof element === "string" || typeof element === "number") {
      return document.createTextNode(String(element));
    }
    return document.createTextNode(`⚠ Invalid child: ${String(element)}`);
  }

  child(children = []) {
    const flattenedChildren = Array.isArray(children) ? children.flat() : [children];
    flattenedChildren.forEach((child) => {
      this.element.appendChild(this._handleElementInstance(child));
    });
    return this;
  }

  append(children = []) {
    return this.child(children);
  }

  appendTo(target) {
    const targetNode = target && target._isDomo ? target.element : target;
    if (targetNode instanceof Node) {
      targetNode.appendChild(this.element);
    }
    return this;
  }

  parent(target) {
    return this.appendTo(target);
  }

  clear() {
    this.element.replaceChildren();
    return this;
  }

  replace(child, newChild) {
    const resolvedNew = this._handleElementInstance(newChild);
    if (child === this.element) {
      this.element.replaceWith(resolvedNew);
      this.element = resolvedNew;
    } else if (this.element.contains(child)) {
      child.replaceWith(resolvedNew);
    }
    return this;
  }

  show(visible = true, displayValue = "block") {
    this.element.style.display = visible ? displayValue : "none";
    return this;
  }

  if(condition) {
    if (!condition) {
      return new this.constructor("if")
        .attr({ hidden: true })
        .data({ if: this.element.tagName.toLowerCase() });
    }
    return this;
  }
}

export default ChildrenClient;
