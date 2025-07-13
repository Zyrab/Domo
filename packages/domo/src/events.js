class Events {
  _pushVirtualHandler(id, event, entry) {
    const evArr = (this.element._events ??= []);
    const existing = evArr.find((e) => e.id === id && e.event === event);
    if (existing) {
      existing.handlers.push(entry);
    } else {
      evArr.push({ id, event, handlers: [entry] });
    }
  }

  /**
   * Adds one or multiple event listeners to the element.
   *
   * This method supports two main ways to add events:
   * 1. A single event: `Domo(...).on('click', myClickHandler)`
   * 2. Multiple events using an object: `Domo(...).on({ click: myClickHandler, mouseenter: [anotherHandler, { once: true }] })`
   *
   * @param {string | Record<string, Function | [Function, AddEventListenerOptions]>} eventMapOrName -
   * Either the name of a single event (e.g., 'click'), or an object where keys are event names
   * and values are event handler functions (or arrays containing the handler and options).
   * @param {EventListenerOrEventListenerObject} [callback] - The function to call when the event occurs. Required if `eventMapOrName` is a string.
   * @param {AddEventListenerOptions} [options={}] - An object specifying characteristics about the event listener (e.g., `{ once: true, capture: true }`). Required if `eventMapOrName` is a string.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * // Single event:
   * Domo('button').on('click', () => console.log('Button clicked!'));
   *
   * @example
   * // Multiple events with options:
   * Domo('input').on({
   * focus: () => console.log('Input focused'),
   * blur: [() => console.log('Input blurred'), { once: true }]
   * });
   */

  on(eventMapOrName, callback, options = {}) {
    if (!eventMapOrName || !callback) return this;
    if (this._virtual) {
      if (options.ssg === false) return this;
      const elId = this.element._attr?.id;
      if (!elId) throw new Error(`[Domo.on] .id() must be called before .on(...) in SSG mode`);

      if (typeof eventMapOrName === "object") {
        for (const [event, value] of Object.entries(eventMapOrName)) {
          const handler = Array.isArray(value) ? value[0] : value;
          this._pushVirtualHandler(elId, event, { type: "direct", handler });
        }
      } else {
        this._pushVirtualHandler(elId, eventMapOrName, { type: "direct", handler: callback });
      }

      return this;
    }
    if (typeof eventMapOrName === "object" && eventMapOrName !== null) {
      for (const [event, value] of Object.entries(eventMapOrName)) {
        if (typeof value === "function") {
          this.element.addEventListener(event, value);
        } else if (Array.isArray(value)) {
          const [cb, opts] = value;
          this.element.addEventListener(event, cb, opts);
        }
      }
    } else {
      this.element.addEventListener(eventMapOrName, callback, options);
    }
    return this;
  }

  /**
   * Internal helper for `onClosest`. Finds the closest ancestor matching a selector and calls its handler.
   * @private
   * @param {Event} e - The native event object.
   * @param {Record<string, (e: Event, target: Element) => void>} map - An object mapping CSS selectors to handler functions.
   */
  _handleClosest(e, map) {
    for (const [selector, handler] of Object.entries(map)) {
      const match = e.target.closest(selector);
      if (match) handler(e, match);
    }
  }

  /**
   * Attaches an event listener that triggers when an event occurs on an element,
   * but the handler is only called if the event target or its closest ancestor matches a given selector.
   * This is useful for handling events on dynamically added elements or multiple elements with similar structure.
   * @param {string} event - The name of the event to listen for (e.g., 'click', 'mouseover').
   * @param {Record<string, (e: Event, target: Element) => void>} selectors - An object where keys are CSS selectors and values are handler functions.
   * The handler receives the event object and the matching element (which could be the target or an ancestor).
   * @param {AddEventListenerOptions} [options] - Options for `addEventListener`.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('ul').onClosest('click', {
   * 'li.item': (e, li) => console.log('Clicked list item:', li.textContent),
   * 'button.delete': (e, btn) => console.log('Delete button clicked for:', btn.closest('li').id)
   * });
   */
  onClosest(event, selectors = {}, options = {}) {
    if (this._virtual && event !== null) {
      if (options.ssg === false) return this;
      const elId = this.element._attr?.id;
      if (!elId) throw new Error(`[Domo.onClosest] .id() must be called before .onClosest(...) in SSG mode`);

      for (const [selector, handler] of Object.entries(selectors)) {
        this._pushVirtualHandler(elId, event, {
          type: "closest",
          selector,
          handler,
        });
      }

      return this;
    }

    return this.on(event, (e) => this._handleClosest(e, selectors), options);
  }

  /**
   * Internal helper for `onMatch`. Checks if the event target matches a selector and calls its handler.
   * @private
   * @param {Event} e - The native event object.
   * @param {Record<string, (e: Event, target: Element) => void>} map - An object mapping CSS selectors to handler functions.
   */
  _handleMatches(e, map) {
    for (const [selector, handler] of Object.entries(map)) {
      if (e.target.matches(selector)) handler(e, e.target);
    }
  }

  /**
   * Attaches an event listener that triggers a handler only if the event's direct target element matches a specific CSS selector.
   * This is useful for handling events on multiple elements where you only care about the exact element clicked.
   * @param {string} event - The name of the event to listen for (e.g., 'click', 'keyup').
   * @param {Record<string, (e: Event, target: Element) => void>} selectors - An object where keys are CSS selectors and values are handler functions.
   * The handler receives the event object and the exact matching element.
   * @param {AddEventListenerOptions} [options] - Options for `addEventListener`.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * // Only logs if a button with class 'action-btn' is *directly* clicked
   * Domo('div').onMatch('click', {
   * 'button.action-btn': (e, btn) => console.log('Action button clicked:', btn.textContent),
   * 'input[type="checkbox"]': (e, checkbox) => console.log('Checkbox toggled:', checkbox.checked)
   * });
   */
  onMatch(event, selectors = {}, options = {}) {
    if (this._virtual && event !== null) {
      if (options.ssg === false) return this;
      const elId = this.element._attr?.id;
      if (!elId) throw new Error(`[Domo.onMatch] .id() must be called before .onMatch(...) in SSG mode`);

      for (const [selector, handler] of Object.entries(selectors)) {
        this._pushVirtualHandler(elId, event, {
          type: "match",
          selector,
          handler,
        });
      }

      return this;
    }

    return this.on(event, (e) => this._handleMatches(e, selectors), options);
  }
}

export default Events;
