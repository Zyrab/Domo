import EventsServer from "./events.server.js";

/**
 * @class ChildrenServer
 * @extends EventsServer
 */
class ChildrenServer extends EventsServer {
  child(children = []) {
    const flattenedChildren = Array.isArray(children) ? children.flat() : [children];
    flattenedChildren.forEach((child) => {
      // Store reference. If it's a Domo instance, the Builder will call .build() on it later.
      this.element._child.push(child);
    });
    return this;
  }

  append(children = []) {
    return this.child(children);
  }

  appendTo(target) {
    const targetEl = target && target._isDomo ? target.element : target;
    if (targetEl && Array.isArray(targetEl._child)) {
      targetEl._child.push(this);
    }
    return this;
  }

  parent(target) {
    return this.appendTo(target);
  }

  clear() {
    this.element._child = [];
    return this;
  }

  replace(child, newChild) {
    const idx = this.element._child.indexOf(child);
    if (idx !== -1) {
      this.element._child[idx] = newChild;
    }
    return this;
  }

  show(visible = true) {
    if (!visible) {
      this.element._attr["hidden"] = true;
      this.element._css["display"] = "none";
    } else {
      delete this.element._attr["hidden"];
      delete this.element._css["display"];
    }
    return this;
  }

  if(condition) {
    if (!condition) {
      return new this.constructor("if")
        .attr({ hidden: true })
        .data({ if: this.element._tag.toLowerCase() });
    }
    return this;
  }
}

export default ChildrenServer;
