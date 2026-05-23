import ClassesServer from "./classes.server.js";

/**
 * @class EventsServer
 * @extends ClassesServer
 */
class EventsServer extends ClassesServer {
  /**
   * Captures event metadata for the SSG.
   * @param {string|object} eventMapOrName
   * @param {Function} [callback]
   * @param {object} [meta={}] - Injected by plugin: { _source, _name, ssg: boolean }
   */
  on(eventMapOrName, callback, meta = {}) {
    if (meta.ssg === false) return this;

    if (typeof eventMapOrName === "object" && eventMapOrName !== null) {
      // In object mode: .on({ click: fn }, { _source: '...', _name: '...' })
      // callback actually acts as the 'meta' argument here
      const metadata = callback || {};
      for (const [event, value] of Object.entries(eventMapOrName)) {
        const handler = Array.isArray(value) ? value[0] : value;
        this._pushEvent("direct", event, handler, null, metadata);
      }
    } else if (typeof callback === "function") {
      // In single mode: .on('click', fn, { _source: '...', _name: '...' })
      this._pushEvent("direct", eventMapOrName, callback, null, meta);
    }
    return this;
  }

  onClosest(event, selectors = {}, meta = {}) {
    if (meta.ssg === false) return this;
    for (const [selector, handler] of Object.entries(selectors)) {
      this._pushEvent("closest", event, handler, selector, meta);
    }
    return this;
  }

  onMatch(event, selectors = {}, meta = {}) {
    if (meta.ssg === false) return this;
    for (const [selector, handler] of Object.entries(selectors)) {
      this._pushEvent("match", event, handler, selector, meta);
    }
    return this;
  }

  /**
   * Internal helper to push event metadata.
   * @private
   */
  _pushEvent(type, event, handler, selector = null, meta = {}) {
    const evArr = (this.element._events ??= []);
    const id = this._getOrSetId(handler);
    let existing = evArr.find((e) => e.id === id && e.event === event);

    if (!existing) {
      existing = { id, event, handlers: [] };
      evArr.push(existing);
    }
    console.log("testing", existing);
    existing.handlers.push({
      type,
      name: meta._name || handler.name || "anonymous",
      handler,
      ...(selector && { selector }),
    });
  }
}

export default EventsServer;
