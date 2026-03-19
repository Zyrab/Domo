import DomoClientFactory, { DomoClient } from "./client/domo.client.js";
import DomoServerFactory, { DomoServer } from "./domo.server.js";

const isServer = typeof document === "undefined";

/**
 * The main Domo factory function.
 * Automatically resolves to DomoClient in the browser and DomoServer in Node.js/SSG environments.
 * @type {typeof DomoClientFactory}
 */
const Domo = isServer ? DomoServerFactory : DomoClientFactory;

export default Domo;
export { DomoClient, DomoServer };
