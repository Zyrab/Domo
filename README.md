# Domo

**Domo** is a lightweight fluent helper class for creating and manipulating DOM elements. It simplifies native DOM APIs with a chainable interface, making UI building more intuitive. It’s minimal, flexible, and designed to evolve into a full client-side UI toolkit, including a router, component system, and personal-styled prebuilt components.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Router](#router)
- [Components (Planned)](#components-planned)
- [Examples (Planned)](#examples)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Fluent, chainable API for building elements
- ID, value, text, class, style, and attribute setters
- Declarative `if()` rendering and conditional visibility
- Event binding and delegation with `on`, `onClosest`, `onMatch`
- DOM manipulation: `append`, `clear`, `replace`, `show`
- Built-in client-side Router
  - History API support
  - Nested & dynamic routes (/blog/:slug)
  - Scroll restoration and metadata updates
  - Route listeners and navigation helpers
- Future: Prebuilt components and scoped styling system

---

## Installation

```bash
npm install @zyrab/domino-dom
```

## Usage

```js
import Domo from " @zyrab/domino-dom";

const btn = Domo("button")
  .id("submit-btn")
  .cls(["btn", "primary"])
  .txt("Submit")
  .on("click", () => alert("Submitted!"))
  .build();

document.body.appendChild(btn);
```

## Router

The built-in router enables history-based navigation with a simple nested config structure.

```js
import { Router } from "@zyrab/domino-dom";

Router.routes({
  "/": {
    component: Home,
    meta: { title: "Home", description: "home page" },
  },
  "/about": {
    component: About,
    meta: { title: "About" },
  },
  "/blog": {
    children: {
      "/:slug": {
        component: BlogPost,
        meta: { title: "Blog Post", description: "blog" },
      },
      "/": {
        component: Blog,
        meta: { title: "Blog", description: "Blog page" },
      },
    },
  },
  "*": {
    component: Error,
    meta: { title: "Not Found" },
  },
});

document.body.appendChild(Router.mount());
Router.init();
```

# Navigation

```js
Router.goTo("/about");
Router.back();

Router.listen(({ meta, params }) => {
  console.log("Route changed:", meta.title, params);
});
```

# Router Info

```js
const { meta, params, segments } = Router.info();
```

## Components (Planned)

- Domo-based reusable UI elements
- Scoped CSS via your custom style system
- Easily composable into views and apps

## Examples (Soon)

Check the /examples folder for practical use cases including:

- Basic UI creation
- Event delegation
- Simple conditional rendering
- Router demo

## API Reference

- Domo(tag = "div") — Creates a DOM element
- .id(string)
- .val(string)
- .txt(string)
- .cls(string | string[])
- .rmvCls(string | string[])
- .tgglCls(string, force?)
- .attr(object)
- .tgglAttr(name, force?)
- .data(object)
- .css(styles)
- .on(event, callback)
- .onMatch(event, { selector: callback })
- .onClosest(event, { selector: callback })
- .append([children])
- .clear()
- .replace(child, newChild)
- .show(bool, display?)
- .if(condition)
- .ref(callback) — Callback access to raw element
- .build() — Returns the constructed HTMLElement

Full reference: docs/API.md

## Contributing

Contributions are welcome. Open issues, suggest features, or submit pull requests.

See CONTRIBUTING.md for more info.

## License

MIT License
