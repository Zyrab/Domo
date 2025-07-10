// router.core.js
import { _root, setRoot, setRoutes, addListener, setPreviousUrl } from "./state.js";
import { saveScroll, restoreScroll, navigate, goBack } from "./history.js";
import { path, info, setInfo, getPreviousUrl, getBasePath } from "./utils.js";
import { load } from "./rendering.js";

/**
 * Initializes the router by setting up event listeners for page load and history changes.
 * It also initializes the root element where components will be rendered.
 * @returns {void}
 */
function init() {
  // Ensure we are in a browser environment before adding event listeners
  if (typeof window !== "undefined") {
    // Initialize _root element if it doesn't exist
    if (!_root) {
      const mainElement = document.createElement("main");
      mainElement.id = "main";
      setRoot(mainElement);
      // It's up to the user to append Router.mount() to their DOM
    }

    ["DOMContentLoaded", "popstate"].forEach((event) =>
      window.addEventListener(event, async () => {
        saveScroll(getPreviousUrl()); // Save scroll of the page we're leaving
        const currentUrl = path();
        await load(currentUrl); // Load the new route
        setPreviousUrl(currentUrl); // Update previous URL *after* loading
        restoreScroll(); // Restore scroll for the new page
      })
    );
  }
}

/**
 * The main Router object, exposing all public API methods for navigation,
 * route definition, and state access.
 */
const Router = {
  /**
   * Mount point of the router. Returns the root DOM element where components will be rendered.
   * Users should append this element to their desired location in the DOM.
   * @returns {HTMLElement} The root DOM element used by the router.
   * @example
   * document.body.appendChild(Router.mount());
   */
  mount: () => {
    // Ensure _root exists before returning it, initialize if not
    if (!_root && typeof document !== "undefined") {
      const mainElement = document.createElement("main");
      mainElement.id = "main";
      setRoot(mainElement);
    }
    return _root;
  },

  /**
   * Initializes the router by setting up event listeners and loading the initial route.
   * This should be called once when your application starts.
   * @returns {void}
   * @example
   * Router.init();
   */
  init,

  /**
   * Programmatically navigates to a new route. This updates the browser's history.
   * @param {string} targetPath - The path to navigate to (e.g., '/about', '/users/123').
   * @returns {Promise<void>} A Promise that resolves once the new route is loaded and rendered.
   * @example
   * Router.goTo('/dashboard');
   */
  goTo: (targetPath) => navigate(targetPath, load), // Use the general navigate function

  /**
   * Navigates one step back in the browser's history.
   * @returns {void}
   * @example
   * Router.back();
   */
  back: goBack,

  /**
   * Gets the current full path from the browser's location, including the hash.
   * @returns {string} The current path (e.g., '/users/123#settings').
   * @example
   * console.log(Router.path()); // Outputs: /current/url
   */
  path,

  /**
   * Gets the previous URL path the router navigated from.
   * @returns {string} The previous URL path, or '/' if no previous navigation occurred.
   * @example
   * console.log(Router.prev()); // Outputs: /previous/page
   */
  prev: getPreviousUrl,

  /**
   * Returns the base (first) segment of the current path.
   * For `/blog/post-1`, it returns `/blog`. For `/`, it returns `/`.
   * @returns {string} The base segment of the current path.
   * @example
   * // If current path is '/users/profile'
   * console.log(Router.base()); // Outputs: /users
   */
  base: getBasePath,

  /**
   * Returns comprehensive information about the currently active route.
   * @returns {{ meta: object, params: object, segments: string[], base: string, path: string }}
   * An object containing:
   * - `meta`: Any metadata defined for the route (e.g., title, description).
   * - `params`: An object of parameters extracted from dynamic route segments (e.g., `{ id: '123' }`).
   * - `segments`: An array of URL path segments (e.g., `['/users', '/123']`).
   * - `base`: The first segment of the path (e.g., '/users').
   * - `path`: The full current path.
   * @example
   * // If route is '/user/:id' and current URL is '/user/456'
   * const routeInfo = Router.info();
   * console.log(routeInfo.params.id); // Outputs: 456
   * console.log(routeInfo.meta.title); // Outputs: (from route config)
   */
  info,

  /**
   * Manually sets the current route information. Primarily for internal use or advanced scenarios.
   * @param {string} path - The path for which to set info.
   * @param {object} [params={}] - Parameters for the path.
   * @returns {void}
   */
  setInfo, // Expose for specific use cases

  /**
   * Defines the routing structure for the application.
   * This method should be called once to configure all your routes.
   * Routes can be nested and include dynamic segments (e.g., `/:id`).
   * A wildcard route (`'*'`) can be defined for 404/not found pages.
   *
   * @param {object} config - An object defining the route structure.
   * Each key is a path segment, and its value is an object containing `component` (a function returning an HTMLElement or string)
   * and optional `meta` data, or `children` for nested routes.
   * @example
   * Router.routes({
   * '/': { component: () => Domo('h1').txt('Welcome').build(), meta: { title: "Home" } },
   * '/products': {
   * component: () => Domo('h2').txt('Products List').build(),
   * children: {
   * '/:productId': { component: (params) => Domo('div').txt(`Product ID: ${params.productId}`).build() }
   * }
   * },
   * '*': { component: () => Domo('h1').txt('404 Not Found').build() }
   * });
   */
  routes: (config) => {
    setRoutes(config);
  },

  /**
   * Registers a listener callback function that will be invoked whenever the route changes.
   * The listener receives the current route information as its argument.
   * @param {(info: ReturnType<typeof info>) => void} fn - The callback function to register.
   * @returns {void}
   * @example
   * Router.listen((routeInfo) => {
   * console.log('Route changed to:', routeInfo.path);
   * console.log('Params:', routeInfo.params);
   * });
   */
  listen: (fn) => {
    if (typeof fn === "function") addListener(fn);
  },
};

export default Router;
