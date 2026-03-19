import ClassesClient from "./classes.client.js";

/**
 * @class EventsClient
 * @extends ClassesClient
 */
class EventsClient extends ClassesClient {
  /**
   * Adds event listeners to the element.
   */
  on(eventMapOrName, callback, options = {}) {
    if (!eventMapOrName) return this;

    if (typeof eventMapOrName === "object" && eventMapOrName !== null) {
      for (const [event, value] of Object.entries(eventMapOrName)) {
        if (typeof value === "function") {
          this.element.addEventListener(event, value);
        } else if (Array.isArray(value)) {
          const [cb, opts] = value;
          this.element.addEventListener(event, cb, opts);
        }
      }
    } else if (typeof callback === "function") {
      this.element.addEventListener(eventMapOrName, callback, options);
    }
    return this;
  }

  _handleClosest(e, map) {
    for (const [selector, handler] of Object.entries(map)) {
      const match = e.target.closest(selector);
      if (match) handler(e, match);
    }
  }

  onClosest(event, selectors = {}, options = {}) {
    return this.on(event, (e) => this._handleClosest(e, selectors), options);
  }

  _handleMatches(e, map) {
    for (const [selector, handler] of Object.entries(map)) {
      if (e.target.matches(selector)) handler(e, e.target);
    }
  }

  onMatch(event, selectors = {}, options = {}) {
    return this.on(event, (e) => this._handleMatches(e, selectors), options);
  }
}

export default EventsClient;
