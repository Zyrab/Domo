import Base from "./base.js";
import Properties from "./properties.js";
import Classes from "./classes.js";
import Events from "./events.js";
import Children from "./children.js";
import Builder from "./builder.js";

/**
 * @class Domo
 * @augments Base
 * @description The main class for creating and manipulating DOM elements,
 * combining functionalities from various modules (Properties, Classes, Events, Children, Builder).
 * This class provides a fluent, chainable API for building and interacting with HTML elements.
 */
class DomoClass extends Base {
  // Ensure the constructor explicitly calls the parent's constructor.
  // This makes sure `this._virtual` and `this.element` are initialized by Base.
  constructor(el = "div") {
    super(el); // Calls Base's constructor
  }
}

// Apply all mixin methods to the Domo prototype
// These lines integrate the methods from other classes into the Domo class's prototype,
// making them available on any Domo instance.
Object.getOwnPropertyNames(Properties.prototype)
  .filter((p) => p !== "constructor")
  .forEach((name) => {
    DomoClass.prototype[name] = Properties.prototype[name];
  });
Object.getOwnPropertyNames(Classes.prototype)
  .filter((p) => p !== "constructor")
  .forEach((name) => {
    DomoClass.prototype[name] = Classes.prototype[name];
  });
Object.getOwnPropertyNames(Events.prototype)
  .filter((p) => p !== "constructor")
  .forEach((name) => {
    DomoClass.prototype[name] = Events.prototype[name];
  });
Object.getOwnPropertyNames(Children.prototype)
  .filter((p) => p !== "constructor")
  .forEach((name) => {
    DomoClass.prototype[name] = Children.prototype[name];
  });
Object.getOwnPropertyNames(Builder.prototype)
  .filter((p) => p !== "constructor")
  .forEach((name) => {
    DomoClass.prototype[name] = Builder.prototype[name];
  });

/**
 * A factory function to create a new Domo element instance.
 * This is the primary way to start building an element, avoiding the need for the `new` keyword.
 * @param {string} [el="div"] - The HTML tag name for the element to create (e.g., 'div', 'span', 'button').
 * @returns {Domo} A new Domo instance, ready for method chaining.
 * @example
 * // Create a div and add text and a class:
 * const myDiv = Domo('div').txt('Hello World').cls('container');
 *
 * // Create a button and attach an event:
 * const myButton = Domo('button')
 * .txt('Click Me')
 * .on('click', () => alert('Button clicked!'));
 *
 * // Append to the document body:
 * myButton.appendTo(document.body);
 */
function Domo(el = "div") {
  return new DomoClass(el);
}

// Export the factory function as the default export
export default Domo;

// Export the Domo Class itself
export { DomoClass };
