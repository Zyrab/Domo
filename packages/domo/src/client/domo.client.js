import BuilderClient from "./builder.client.js";

/**
 * @class DomoClient
 * @extends BuilderClient
 * @description Main Domo class for the Browser environment.
 */
class DomoClient extends BuilderClient {
  constructor(el = "div") {
    super(el);
  }
}

/**
 * Factory function for Browser Domo elements.
 * @param {string} [el="div"]
 * @returns {DomoClient}
 */
function Domo(el = "div") {
  return new DomoClient(el);
}

export { DomoClient };
export default Domo;
