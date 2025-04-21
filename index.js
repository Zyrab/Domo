// @ts-check

import DomoClass from "./src/core/Domo.js";
import Router from "./src/core/Router.js";
import DomoSVGClass from "./src/core/DomoSVG.js";

/**
 * @typedef {import('./src/core/Domo.js').default} DomoInstance
 * @typedef {import('./src/core/DomoSVG.js').default} DomoSVGInstance
 */

/**
 * @typedef {((tag?: string) => DomoInstance) & { Class: typeof DomoClass }} DomoFactory
 * @typedef {((tag?: string) => DomoSVGInstance)} DomoSVGFactory
 */

/**
 * @param {string} [tag]
 * @returns {DomoInstance}
 */
function Domo(tag) {
  return new DomoClass(tag);
}
Domo.Class = DomoClass;

/**
 * @param {string} [tag]
 * @returns {DomoSVGInstance}
 */
function DSVG(tag) {
  return new DomoSVGClass(tag);
}
DSVG.Class = DomoSVGClass;

export { Domo, Router, DSVG, DomoClass };
