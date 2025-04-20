# Domo

**Domo** is a tiny fluent helper for creating and working with DOM elements.  
It simplifies native APIs with a chainable, intuitive interface.

Originally built for personal use, it's growing into a lightweight UI toolkit with a router, planned components, and scoped styles.  
No dependencies. No build step. Just clean, direct DOM manipulation.

---

## Features

- Fluent, chainable DOM API
- Set ID, text, value, class, style, data, attributes
- Conditional rendering with `.if()` and `.show()`
- Event handling: `.on`, `.onClosest`, `.onMatch`
- Simple DOM ops: `.append`, `.clear`, `.replace`
- Built-in router:
  - History API, nested/dynamic routes
  - Scroll and metadata handling
  - Route info and listeners

---

## Installation

```bash
npm install @zyrab/domo
```

---

## Usage

```js
import Domo from " @zyrab/domo";

const btn = Domo("button")
  .id("submit-btn")
  .cls(["btn", "primary"])
  .txt("Submit")
  .on("click", () => alert("Submitted!"))
  .build();

document.body.appendChild(btn);
```

---

## Router

The built-in router enables history-based navigation with a simple nested config structure.

```js
import { Router } from "@zyrab/domo";

Router.routes({
  "/": { component: Home, meta: { title: "Home" } },
  "/about": { component: About, meta: { title: "About" } },
  "/blog": {
    children: {
      "/": { component: Blog, meta: { title: "Blog" } },
      "/:slug": { component: BlogPost, meta: { title: "Post" } },
    },
  },
  "*": { component: Error, meta: { title: "404" } },
});

document.body.appendChild(Router.mount());
Router.init();

Router.goTo("/about");

Router.back();

Router.listen(({ meta, params }) => {
  console.log("Route changed:", meta.title, params);
});

const { meta, params, segments } = Router.info();
```

---

## Planned

- DOM-based components
- Custom scoped style system
- Prebuilt reusable elements
- Examples folder with real use cases

---

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
- .child([children])
- .clear()
- .replace(child, newChild)
- .show(bool, display?)
- .if(condition)
- .ref(callback) — Callback access to raw element
- .build() — Returns the constructed HTMLElement

Full reference:
[Domo](docs/Domo.md)
[Router](docs/Router.md)

---

## Contributing

Suggestions, fixes, or features are welcome.
This is a small project made for personal use — but if you see something worth improving, feel free to help.

→ [Read the Contributing Guide](CONTRIBUTING.md)

---

## License

[MIT License](LICENSE)
