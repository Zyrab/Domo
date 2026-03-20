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
    // If user passed options (meta), check if ssg is explicitly disabled
    if (meta.ssg === false) return this;

    const id = this._getOrSetId();

    if (typeof eventMapOrName === "object" && eventMapOrName !== null) {
      // In object mode: .on({ click: fn }, { _source: '...', _name: '...' })
      // callback actually acts as the 'meta' argument here
      const metadata = callback || {};
      for (const [event, value] of Object.entries(eventMapOrName)) {
        const handler = Array.isArray(value) ? value[0] : value;
        this._pushEvent(id, "direct", event, handler, null, metadata);
      }
    } else if (typeof callback === "function") {
      // In single mode: .on('click', fn, { _source: '...', _name: '...' })
      this._pushEvent(id, "direct", eventMapOrName, callback, null, meta);
    }
    return this;
  }

  onClosest(event, selectors = {}, meta = {}) {
    if (meta.ssg === false) return this;
    const id = this._getOrSetId();
    for (const [selector, handler] of Object.entries(selectors)) {
      this._pushEvent(id, "closest", event, handler, selector, meta);
    }
    return this;
  }

  onMatch(event, selectors = {}, meta = {}) {
    if (meta.ssg === false) return this;
    const id = this._getOrSetId();
    for (const [selector, handler] of Object.entries(selectors)) {
      this._pushEvent(id, "match", event, handler, selector, meta);
    }
    return this;
  }

  /**
   * Internal helper to push event metadata.
   * @private
   */
  _pushEvent(id, type, event, handler, selector = null, meta = {}) {
    const evArr = (this.element._events ??= []);
    let existing = evArr.find((e) => e.id === id && e.event === event);

    if (!existing) {
      existing = { id, event, handlers: [] };
      evArr.push(existing);
    }

    // Capture path and name from the 'meta' object stamped by the plugin
    existing.handlers.push({
      type,
      name: meta._name || handler.name || "anonymous",
      handler,
      path: meta._source || null, // STAMPED PATH
      ...(selector && { selector }),
    });

    // Tag as island so SSG knows to include domo.client.js
  }
}

export default EventsServer;
