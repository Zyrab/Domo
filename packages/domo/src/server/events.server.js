import ClassesServer from "../classes.server.js";

/**
 * @class EventsServer
 * @extends ClassesServer
 */
class EventsServer extends ClassesServer {
  /**
   * Captures event metadata for the SSG.
   */
  on(eventMapOrName, callback, options = {}) {
    if (!eventMapOrName || options.ssg === false) return this;

    const id = this._getOrSetId();

    if (typeof eventMapOrName === "object" && eventMapOrName !== null) {
      for (const [event, value] of Object.entries(eventMapOrName)) {
        const handler = Array.isArray(value) ? value[0] : value;
        this._pushEvent(id, "direct", event, handler);
      }
    } else if (typeof callback === "function") {
      this._pushEvent(id, "direct", eventMapOrName, callback);
    }
    return this;
  }

  onClosest(event, selectors = {}, options = {}) {
    if (options.ssg === false) return this;
    const id = this._getOrSetId();
    for (const [selector, handler] of Object.entries(selectors)) {
      this._pushEvent(id, "closest", event, handler, selector);
    }
    return this;
  }

  onMatch(event, selectors = {}, options = {}) {
    if (options.ssg === false) return this;
    const id = this._getOrSetId();
    for (const [selector, handler] of Object.entries(selectors)) {
      this._pushEvent(id, "match", event, handler, selector);
    }
    return this;
  }

  /**
   * Internal helper to push event metadata.
   * Groups handlers by id and event name to match domo-ssg schema.
   * @private
   */
  _pushEvent(id, type, event, handler, selector = null) {
    const evArr = (this.element._events ??= []);
    let existing = evArr.find((e) => e.id === id && e.event === event);

    if (!existing) {
      existing = { id, event, handlers: [] };
      evArr.push(existing);
    }

    existing.handlers.push({
      type,
      name: handler.name || "anonymous",
      handler,
      ...(selector && { selector }),
    });

    // Tag as island if interaction is detected (Scenario 3)
    this.element._island = true;
  }
}

export default EventsServer;
