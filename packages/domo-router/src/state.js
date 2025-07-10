// router.state.js
/**
 * @private
 * @type {object} - Stores the defined route configurations.
 */
export let _routes = {};

/**
 * @private
 * @type {Array<Function>} - List of callback functions to be notified on route changes.
 */
export let _listeners = [];

/**
 * @private
 * @type {Record<string, number>} - Stores scroll positions for different URLs.
 */
export const _scrollPositions = {};

/**
 * @private
 * @type {string} - The URL that was active before the current navigation.
 */
export let _previousUrl = "";

/**
 * @private
 * @type {object|null} - Information about the currently active route (meta, params, segments).
 */
export let _currentInfo = null;

/**
 * @private
 * @type {HTMLElement|null} - The root DOM element where components are rendered.
 */
export let _root = null;

// Functions to update the state variables (used internally by other modules)
export function setRoutes(newRoutes) {
  _routes = newRoutes;
}

export function addListener(fn) {
  _listeners.push(fn);
}

export function setPreviousUrl(url) {
  _previousUrl = url;
}

export function setCurrentInfo(info) {
  _currentInfo = info;
}

export function setRoot(element) {
  _root = element;
}
