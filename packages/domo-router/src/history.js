// router.history.js
import { _scrollPositions, _previousUrl, setPreviousUrl } from "./state.js";

/**
 * Saves the current scroll position for a given URL.
 * @param {string} [url=window.location.pathname] - The URL path to associate the scroll position with.
 * @returns {void}
 */
export function saveScroll(url = window?.location?.pathname) {
  // Only save if window object exists (i.e., not during SSR/SSG)
  if (typeof window !== "undefined") {
    _scrollPositions[url] = window.scrollY;
  }
}

/**
 * Restores the scroll position for the current URL. If no saved position, scrolls to the top.
 * @returns {void}
 */
export function restoreScroll() {
  if (typeof window !== "undefined") {
    const pos = _scrollPositions[window.location.pathname];
    window.scrollTo(0, pos || 0);
  }
}

/**
 * Programmatically navigates to a new URL using the History API.
 * @param {string} url - The URL to navigate to.
 * @param {Function} loadFunction - The function responsible for loading the route.
 * @returns {Promise<void>}
 */
export async function navigate(url, loadFunction) {
  saveScroll(_previousUrl);
  await loadFunction(url);
  setPreviousUrl(url);
  restoreScroll();
}

/**
 * Navigates one step back in the browser's history.
 * @returns {void}
 */
export function goBack() {
  if (typeof history !== "undefined" && typeof history.back === "function") {
    history.back();
  }
}
