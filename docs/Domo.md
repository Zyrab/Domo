# Domo API

Fluent, chainable DOM builder. Helps you create, modify, and manage elements in a clean and expressive way.

**Example:**

```js
import { Domo } from "@zyrab/domo";

const list = Domo("ul")
  .cls("item-list")
  .child([Domo("li").txt("Item 1"), Domo("li").txt("Item 2").cls("active")])
  .on("click", (event) => {
    const targetLi = event.target.closest("li");
    if (targetLi) {
      console.log("Clicked item:", targetLi.textContent);
    }
  })
  .build(); // Get the actual HTMLElement

document.body.appendChild(list);
```

---

## Factory Functions

- `Domo(tag?: string)` — creates a chainable DOM element wrapper. If `tag` is omitted, defaults to `div`
- `DSVG(tag?: string)` — creates an SVG element wrapper (e.g. `"svg"`, `"circle"`, etc), defaults to `svg`.

You can also extend the underlying class, available via `Domo.Class`:

```js
class MyEl extends Domo.Class {
  constructor(text) {
    super("button"); // Create a button element
    this.txt(text);
    this.cls("my-button");
  }
}

const myButton = new MyEl("Click Me").build();
```

---

## Setters

Methods to modify element properties, attributes, styles, and classes.

### `.id(id)`

Sets the `id` attribute.

- `id`: `string` - The ID to set.

```js
Domo("input").id("username").build();
// <input id="username">
```

### `.val(value)`

Sets the value property (primarily for form elements).

- `value`: `string` - The value to set

```js
Domo("input").val("Initial text").build();
// <input value="Initial text">
```

### `.txt(text)`

Sets the textContent of the element.

- `text`: `string` - The text content to set.

```js
Domo("span").txt("Hello World").build();
// <span>Hello World</span>
```

### `.cls(className)`

Adds one or more CSS classes to the element.

- `classNames`: `string | string[]` - A single class name, multiple names separated by spaces, or an array of class names.

```js
Domo()
  .cls("box") // Add single
  .cls("active highlight") // Add multiple (space-separated)
  .cls(["red", "large"]) // Add multiple (array)
  .build();
// <div class="box active highlight red large">
```

### `.rmvCls(className)`

Removes one or more CSS classes from the element.

- `classNames`: `string | string[]` - A single class name, multiple names separated by spaces, or an array of class names.

```js
Domo("div")
  .cls("box active red")
  .rmvCls("active") // Remove single
  .rmvCls(["box", "red"]) // Remove multiple (array)
  .build();
// <div class="">
```

### `.tgglCls(className, force?)`

Toggles a single CSS class.

- `className`: `string` - The class name to toggle.
- `force` (optional): `boolean` - If true, ensures the class is added. If false, ensures the class is removed. If omitted, toggles based on current presence.

```js
const el = Domo("div").cls("modal");

el.tgglCls("is-open"); // Adds 'is-open' if missing, removes if present
el.tgglCls("is-open", true); // Ensures 'is-open' is added
el.tgglCls("is-open", false); // Ensures 'is-open' is removed
```

### `.attr(attributes)`

Sets multiple HTML attributes.

- `attributes`: `Record<string, string | number | boolean | null>` - An object where keys are attribute names and values are attribute values.
- `boolean true`: Sets the attribute presence (e.g., disabled).
- `boolean false` or `null` or `undefined`: Removes the attribute.
- `Note`: Does not set event handlers (like `onclick`); use `.on()` for events.

```js
Domo("button")
  .attr({
    type: "button",
    title: "Click me",
    disabled: true, // <button disabled>
    "aria-label": "Submit",
  })
  .attr({ disabled: false }) // Removes 'disabled' attribute
  .build();
```

### `.tgglAttr(name force?)`

Toggles a single HTML attribute (like disabled or checked).

- `name`: `string` - The name of the attribute to toggle.
- `force` (optional): `boolean` - If true, ensures the attribute exists. If false, ensures the attribute is removed. If omitted, toggles based on current presence.

```js
Domo("input").tgglAttr("readonly"); // Toggles readonly
Domo("input").tgglAttr("readonly", true); // Adds readonly
```

### `.data(dataAttributes)`

Sets multiple `data-*` attributes.

- `dataAttributes`:` Record<string, string>` - An object where keys are the part after data- (e.g., id becomes data-id) and values are strings.

```js
Domo("div").data({ userId: "123", role: "content-panel" }).build();
// <div data-user-id="123" data-role="content-panel">
```

### `.css(styles)`

Applies inline CSS styles.

- `styles`: `Partial<CSSStyleDeclaration>` - An object where keys are CSS property names (camelCase like fontSize or kebab-case like 'font-size') and values are valid CSS property values.

```js
Domo("p")
  .css({
    color: "blue",
    fontSize: "16px",
    "margin-top": "10px", // Kebab-case also works
  })
  .build();
// <p style="color: blue; font-size: 16px; margin-top: 10px;">
```

---

## 3. Events

Methods for attaching event listeners.

### `.on(event, listener, options?)`

Attaches an event listener directly to the element.

- `event`: `string` - The event type (e.g., 'click', 'mouseover').
- `listener`: `EventListener` - The callback function (event: Event) => void.
- `options` (optional): `AddEventListenerOptions` - Standard options object (e.g., { capture?: boolean, once?: boolean, passive?: boolean }).

```js
Domo("button")
  .on(
    "click",
    (e) => {
      console.log("Button clicked!", e.target);
    },
    { once: true }
  )
  .build();
```

### `.on(handlers)`

Attaches multiple event listeners defined in an object.

- `handlers`: `Record<string, EventListener | [EventListener, AddEventListenerOptions]>` - An object where keys are event types. Values are either the listener function directly, or an array containing [listenerFunction, optionsObject].

```js
Domo("input")
  .on({
    focus: (e) => console.log("Input focused"),
    blur: (e) => console.log("Input blurred"),
    input: [
      // Listener with options
      (e) => console.log("Value:", e.target.value),
      { passive: true },
    ],
  })
  .build();
```

### `.onClosest(event, handlers, options?)`

Attaches a delegated event listener using Element.closest(). Listens on the current element and triggers handlers if the event target or its ancestor matches a selector.

- `event`: `string` - The event type to delegate.
- `handlers`: `Record<string, (event: Event, matchedElement: HTMLElement) => void>` - An object where keys are CSS selectors. The callback receives the event and the element that matched the selector.
- `options` (optional): `AddEventListenerOptions` - Options for the listener attached to the current element (e.g., { capture: true }).

```js
Domo("ul")
  .onClosest("click", {
    "li.item": (e, matchedLi) =>
      console.log("Clicked item:", matchedLi.textContent),
    "button.delete": (e, btn) => btn.closest("li")?.remove(),
  })
  .build();
```

### `.onMatch(event, handlers, options?)`

Attaches a delegated event listener using Element.matches(). Listens on the current element and triggers handlers if the event target itself matches a selector.

- `event`: `string` - The event type to delegate.
- `handlers`: `Record<string, (event: Event, targetElement: HTMLElement) => void>` - An object where keys are CSS selectors. The callback receives the event and the event target element if it matched the selector.
- `options` (optional): `AddEventListenerOptions` - Options for the listener attached to the current element.

```js
Domo("div")
  .cls("container")
  .onMatch("click", {
    "button.action": (e, btn) =>
      console.log("Action button clicked:", btn.dataset.action),
  })
  .build();
```

---

## 4. DOM Manipulation

Methods for adding, removing, or modifying child elements.

### `.child(children)`

Appends one or more children to the element.

- `children`: `any | any[]` - A single child or an array of children. Accepted types include:
- `HTMLElement`, `SVGElement`, `DocumentFragment`
- `Domo` instances (their .el property is appended)
- `string`, `number` (converted to text nodes)
- `null`, `undefined` (ignored)
- Nested arrays are flattened.

```js
Domo()
  .child([
    Domo("h1").txt("Title"),
    "Some introductory text.",
    Domo("hr"),
    null, // ignored
    [Domo("p").txt("Paragraph 1"), Domo("p").txt("Paragraph 2")], // Flattened
  ])
  .build();
```

### `.clear()`

Removes all child nodes from the element.

```js
Domo('ul').child([...]).clear().build(); // Clears the children added before
// <ul></ul>
```

### `.replace(targetNode, newContent)`

Replaces either the element itself or a specific descendant node with new content.

- `targetNode`: `Node | Domo` - The node to be replaced. Can be a descendant node **or the element itself (`this.el`)**. Accepts raw nodes or `Domo` instances wrapping them.
- `newContent`: `Node | Domo | string | number | DocumentFragment` - The new content to insert. Primitives like strings/numbers are converted to text nodes.

_Note:_ If replacing the element itself (`targetNode === this.el`), the `Domo` instance will continue to wrap the `newContent` element after replacement.

```js
// Replaces 'someNode' (must be self or a descendant) with a new span
.replace(someNode, new Domo('span').txt('Updated'))
```

### `.show(visible?, display?)`

Shows or hides the element by setting the style.display property.

- `visible` (optional): `boolean` - If true, shows the element. If false, hides (display: 'none'). If omitted, toggles visibility.
- `display` (optional): `string` - The display value to use when showing (defaults to 'block'). It does not currently remember the original display value.

```js
const el = Domo("div").css({ display: "inline-block" });

el.show(false); // Hides: style="display: none;"
el.show(true); // Shows: style="display: block;" (Default)
el.show(true, "inline-flex"); // Shows: style="display: inline-flex;"
el.show(); // Toggles display between 'none' and 'block' (Default)
```

### `.if(condition: boolean)`

Conditionally keeps the element in the chain. If the condition is false, subsequent chain calls operate on a detached placeholder (e.g., an HTML comment node), effectively removing the element from the final output.

- `condition`: `boolean` - The condition to evaluate.

```js
Domo("div")
  .child([
    Domo("p").txt("Always shown"),
    Domo("p").if(isAdmin).txt("Admin controls").cls("admin-only"), // Included only if isAdmin is true
    Domo("p").txt("Also always shown"),
  ])
  .build();
```

### `.ref(callback)`

Executes a callback function with the raw underlying HTMLElement as an argument, allowing imperative operations within the chain.

- `callback`: `(element: HTMLElement) => void` - The function to execute.

```js
Domo("canvas")
  .id("myCanvas")
  .ref((canvasEl) => {
    // Perform operations directly on the canvas element
    const ctx = canvasEl.getContext("2d");
    if (ctx) {
      ctx.fillRect(10, 10, 50, 50);
    }
  })
  .css({ border: "1px solid black" })
  .build();
```

---

## 5. Output

Methods to retrieve the final DOM element.

### `.build()`

Finalizes the chain and returns the underlying HTMLElement or SVGElement. This is typically the last call in the chain when you need the actual DOM node.

```js
const buttonElement = Domo("button").txt("Submit").cls("btn").build();
document.body.appendChild(buttonElement);
```

### `.element`

Provides direct access to the underlying HTMLElement or SVGElement property at any point in the chain. Useful if you need the element before the chain is fully built.

```js
const form = Domo("form");
const inputEl = Domo("input").element; // Get the raw input element

form.attr({ method: "post" }).child([inputEl]).build();
```
