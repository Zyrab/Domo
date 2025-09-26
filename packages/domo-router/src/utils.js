// router.utils.js
import { _routes, _currentInfo, setCurrentInfo, _listeners, _previousUrl } from "./state.js";

/**
 * Gets the current full path from the browser's location, including the hash.
 * @returns {string} The current URL path.
 */
export function path() {
  if (typeof window === "undefined") {
    return _currentInfo.path;
  }
  return window.location.pathname + window.location.hash;
}

/**
 * Parses a URL into segments and a pure URL without the hash.
 * @param {string} url - The URL string to parse.
 * @returns {{segments: string[], pureUrl: string}} An object containing URL segments and the pure URL.
 */
export function parseUrl(url) {
  // Remove the hash from the URL
  const pureUrl = url.includes("#") ? url.split("#")[0] : url;
  // Split the URL into segments keeping '/' for nested routes
  const segments = pureUrl.split(/(?=\/)/g).filter(Boolean);
  return {
    segments,
    pureUrl,
  };
}

/**
 * Matches URL segments against the defined routes to find the corresponding route data and parameters.
 * @param {string[]} segments - An array of URL path segments.
 * @returns {{routeData: object, params: object}} An object containing the matched route data and extracted parameters.
 */
export function match(segments) {
  if (!segments.length) return { routeData: _routes["/"] || _routes["*"] };

  let current = _routes;
  let outlet = false;
  let params = {};

  for (const segment of segments) {
    if (current[segment]) {
      // exact match found, go deeper
      current = current[segment];
    } else {
      // look for dynamic route (e.g., '/:id')
      const dynamic = Object.keys(current).find((k) => k.includes(":"));
      if (!dynamic) return { routeData: _routes["*"], params: {} };

      const paramName = dynamic.split(":")[1];
      params = { ...params, [paramName]: segment.split("/")[1] };
      if (current[dynamic].outlet) {
        outlet = true;
        current;
        params = { ...params, outlet: current[dynamic].component };
      } else {
        current = current[dynamic];
      }
    }
  }
  // We send for rendering default child if component doesn't exist at the final segment

  const final = current.component ? current : _routes["*"];
  return { params, routeData: final, outlet };
}

/**
 * Gets information about the current route, including meta data, parameters, and segments.
 * @returns {{meta: object, params: object, segments: string[], base: string}} Information about the current route.
 */
export function info() {
  if (_currentInfo) return _currentInfo;
  const newPath = path();
  const { segments } = parseUrl(newPath);
  const { routeData, params } = match(segments);
  return { meta: routeData.meta || {}, params, segments, path: newPath };
}

/**
 * Notifies all registered listeners about a route change.
 * @param {object} info - The route information to pass to listeners.
 * @returns {void}
 */
export function notify(info) {
  _listeners.forEach((cb) => cb(info));
}

/**
 * Sets the current route information manually.
 * This is primarily for internal use or advanced scenarios where route info needs to be pre-set.
 * @param {string} path - The path of the route.
 * @param {object} [params={}] - Parameters extracted for the route.
 * @returns {void}
 */
export function setInfo(path, params = {}) {
  const segments = path?.split(/(?=\/)/g).filter(Boolean);
  const base = segments[0] || "/";
  setCurrentInfo({
    path,
    params,
    segments,
    base,
  });
}

/**
 * Gets the previous URL path from the router state.
 * @returns {string} The previous URL path, or '/' if none is recorded.
 */
export function getPreviousUrl() {
  return _previousUrl || "/";
}

/**
 * Gets the base (first) segment of the current path.
 * @returns {string} The base segment.
 */
export function getBasePath() {
  return info().segments[0];
}

export function resolveLayout(layout) {
  const defaultLayout = _routes?.layouts?.default;

  if (layout !== undefined) {
    return _routes?.layouts?.[layout];
  }
  if (defaultLayout) return defaultLayout;
  return null;
}
