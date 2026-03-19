import ChildrenClient from "./children.client.js";

/**
 * @class BuilderClient
 * @extends ChildrenClient
 */
class BuilderClient extends ChildrenClient {
  /**
   * Finalizes the element construction and returns the native DOM element.
   * @returns {HTMLElement}
   */
  build() {
    return this.element;
  }
}

export default BuilderClient;
