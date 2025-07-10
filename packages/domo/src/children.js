import { DomoClass } from "./domo.js";

class Children {
  /**
   * Internally handles various types of input to ensure they become valid DOM Nodes
   * or a string representation for virtual DOM.
   * @private
   * @param {*} element - The input to process (Domo instance, Node, string, number).
   * @returns {Node|string|Domo} A DOM Node (HTMLElement, TextNode, DocumentFragment),
   * a string for virtual children, or a Domo instance for virtual children.
   */
  _handleElementInstance(element) {
    // Check if Domo class exists (it's imported in main.domo.js for final class)
    // To avoid circular dependency in JSDoc parsing, we'll check runtime type.
    // For JSDoc type checking, we assume Domo is available in the context of main.domo.js.
    // @ts-ignore - Ignore potential 'Domo is not defined' for JSDoc tool
    if (element instanceof DomoClass) return element.build();

    if (element instanceof DocumentFragment) return element;
    if (element instanceof Node) return element;
    if (typeof element === "string" || typeof element === "number") {
      return document.createTextNode(element); // Convert strings/numbers to text nodes
    }
    return document.createTextNode(`⚠ Invalid child: ${String(element)}`); // Fallback for invalid input
  }

  /**
   * Appends one or more children to the element.
   * This method accepts a wide range of child types, including other Domo instances,
   * native DOM nodes, DocumentFragments, and simple text/numbers, even in nested arrays.
   * @param {(Node|string|number|Domo|DocumentFragment|Array<any>)[]} [children=[]] - An array of children to append. Can contain mixed types and nested arrays.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('div').child([
   * Domo('span').txt('Hello'),
   * document.createElement('br'),
   * 'World!',
   * [Domo('em').txt('Nested')]
   * ]);
   */
  child(children = []) {
    const flattenedChildren = children.flat(); // Handle nested arrays of children
    flattenedChildren.forEach((child) => {
      if (this._virtual) {
        // In virtual mode, store Domo instances or their string representation
        // @ts-ignore - Ignore potential 'Domo is not defined' for JSDoc tool
        this.element._child.push(child instanceof DomoClass ? child : String(child));
      } else this.element.appendChild(this._handleElementInstance(child));
    });
    return this;
  }

  /**
   * Appends one or more children to the element.
   * This is an alias for the `child` method, offering a more common naming convention.
   * @param {(Node|string|number|Domo|DocumentFragment|Array<any>)[]} [children=[]] - An array of children to append. Can contain mixed types and nested arrays.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('ul').append([
   * Domo('li').txt('Item 1'),
   * Domo('li').txt('Item 2')
   * ]);
   */
  append(children = []) {
    return this.child(children);
  }

  /**
   * Appends the current Domo element to a specified target element in the DOM.
   * @param {HTMLElement|Domo|DocumentFragment} target - The element to which the current Domo element will be appended. Can be a native HTMLElement, another Domo instance, or a DocumentFragment.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * const myDiv = Domo('div').txt('My Content');
   * myDiv.appendTo(document.body); // Appends the div to the body
   *
   * const container = Domo('main');
   * myDiv.appendTo(container); // Appends to another Domo instance
   */
  appendTo(target) {
    // @ts-ignore - Ignore potential 'Domo is not defined' for JSDoc tool
    const targetNode = target instanceof DomoClass ? target.element : target; // Get native element if Domo instance
    if (targetNode instanceof Node) {
      // Ensure it's a DOM Node
      targetNode.appendChild(this.element);
    }
    return this;
  }

  /**
   * Appends the current Domo element to a specified target parent.
   * This is an alias for the `appendTo` method.
   * @param {HTMLElement|Domo|DocumentFragment} target - The parent element to which the current Domo element will be appended.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('img').attr({ src: 'image.jpg' }).parent(document.getElementById('image-gallery'));
   */
  parent(target) {
    return this.appendTo(target);
  }

  /**
   * Removes all child nodes from the element, effectively emptying its content.
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('ul').child([Domo('li'), Domo('li')]).clear(); // Removes both <li>s
   */
  clear() {
    this.element.replaceChildren();
    return this;
  }

  /**
   * Replaces an existing child element with a new one, or replaces the Domo element itself if it's the target.
   * @param {Node} child - The old child element (or the Domo element itself) to be replaced.
   * @param {(Node|string|number|Domo|DocumentFragment|Array<any>)} newChild - The new element (or content) to insert. Can be a Domo instance, native Node, string, or number.
   * @returns {this} The current Domo instance for chaining (or the new Domo instance if the original element was replaced).
   * @example
   * const oldParagraph = document.getElementById('old-p');
   * const newDiv = Domo('div').txt('New Content');
   * Domo('body').replace(oldParagraph, newDiv);
   *
   * // To replace the Domo element itself:
   * // const myButton = Domo('button').id('myBtn');
   * // myButton.replace(myButton.element, Domo('a').txt('Link'));
   */
  replace(child, newChild) {
    const resolvedNew = this._handleElementInstance(newChild);
    const resolvedOld = child; // Child is expected to be a Node already based on context

    if (resolvedOld === this.element) {
      this.element.replaceWith(resolvedNew);
      this.element = resolvedNew; // Update the internal reference to the new element
    } else if (this.element.contains(resolvedOld)) {
      resolvedOld.replaceWith(resolvedNew);
    }

    return this;
  }

  /**
   * Shows or hides the element by controlling its CSS `display` property.
   * @param {boolean} [visible=true] - If `true`, the element is shown. If `false`, it's hidden.
   * @param {string} [displayValue='block'] - The CSS `display` value to use when showing the element (e.g., 'block', 'flex', 'inline-block').
   * @returns {this} The current Domo instance for chaining.
   * @example
   * Domo('div').show(false); // Hides the div
   * Domo('span').show(true, 'inline'); // Shows the span as inline
   */
  show(visible = true, displayValue = "block") {
    this.element.style.display = visible ? displayValue : "none";
    return this;
  }

  /**
   * Conditionally returns the current Domo instance or a hidden placeholder element.
   * This allows for conditional rendering based on a boolean condition. If the condition is false,
   * a hidden 'if' element is returned, ensuring method chaining can continue without rendering
   * the actual element.
   * @param {boolean} condition - The condition to evaluate.
   * @returns {this|Domo} The current Domo instance if the condition is true,
   * or a new hidden Domo instance representing the 'if' placeholder if false.
   * @example
   * const dataExists = true;
   * Domo('div')
   * .if(dataExists)
   * .txt('Data is here!'); // This will render
   *
   * const userIsAdmin = false;
   * Domo('button')
   * .if(userIsAdmin)
   * .txt('Admin Panel'); // This button will not be rendered (a hidden placeholder is returned)
   */
  if(condition) {
    // @ts-ignore - Ignore potential 'Domo is not defined' for JSDoc tool
    if (!condition) {
      return new Domo("if")
        .attr({
          hidden: true,
        })
        .data({
          if: !this._virtual ? this.element.tagName.toLowerCase() : this.element._tag.toLowerCase(),
        });
    }
    return this;
  }
}

export default Children;
