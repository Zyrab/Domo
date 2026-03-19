import BuilderServer from "./builder.server.js";

/**
 * @class DomoServer
 * @extends BuilderServer
 * @description Main Domo class for the Server (SSG) environment.
 */
class DomoServer extends BuilderServer {
  constructor(el = "div") {
    super(el);
  }
}

/**
 * Factory function for Server Domo elements.
 * @param {string} [el="div"]
 * @returns {DomoServer}
 */
function Domo(el = "div") {
  return new DomoServer(el);
}

export { DomoServer };
export default Domo;
