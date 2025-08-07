// router.rendering.js
import { _root, _routes, _listeners, _previousUrl } from "./state.js";
import { info, match, notify, parseUrl, path } from "./utils.js";

/**
 * Renders the component associated with a route into the root element.
 * Updates document title and meta description if provided in route meta.
 * Handles component output as HTMLElement, string, or throws an error.
 * @param {{component: Function, meta: object}} routeData - The component function and its meta data.
 * @param {object} params - Parameters extracted from the URL.
 * @returns {Promise<void>}
 */
export async function render({ component, meta }, params) {
  try {
    const comp = await component(params);
    const content = comp.build();
    _root?.replaceChildren();

    if (content instanceof HTMLElement) {
      _root.appendChild(content);
    } else if (typeof content === "string") {
      const wrapper = document.createElement("div");
      wrapper.textContent = content;
      _root.appendChild(wrapper);
    } else {
      throw new Error("❌ Unsupported component output type. Component must return an HTMLElement or a string.");
    }

    if (meta.title) {
      document.title = meta.title;
    }
    const descriptionMeta = document.querySelector("meta[name='description']");
    if (meta.description && descriptionMeta) {
      descriptionMeta.setAttribute("content", meta.description);
    }
  } catch (error) {
    console.error("❌ Router rendering error:", error);
    // Fallback to a 404/error component if defined
    const fallbackRoute = await _routes["*"]?.component({
      error: error.message,
    });
    if (fallbackRoute) {
      _root.replaceChildren();
      _root.appendChild(fallbackRoute);
    }
  }
}

/**
 * Loads a route based on the given URL, renders its component, and notifies listeners.
 * @param {string} url - The URL to load.
 * @returns {Promise<void>}
 */
export async function load(url) {
  const { segments, pureUrl } = parseUrl(url); // Use info to get route data
  const { routeData, params } = match(segments); // Recalculate info based on target URL
  if (path() !== url) {
    history.pushState(null, "", pureUrl);
  }

  if (url === _previousUrl) return;

  await render(routeData, params);
  if (_listeners.length > 0) notify(info());
}
