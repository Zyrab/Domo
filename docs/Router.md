# Router API

**Router** handles navigation and rendering for SPA. It supports nested routes, dynamic segments, and history-based transitions.

---

## Usage Example

```js
Router.routes({
  "/": { component: Home },
  "/about": { component: About },
  "/blog": {
    children: {
      "/:slug": { component: BlogPost },
      "/": { component: Blog },
    },
  },
  "*": { component: NotFound },
});

Router.init();
```

---

## Core Methods

### `Router.mount()`

Returns the root element where components are rendered.

**Returns:** `HTMLElement`

---

### `Router.init()`

Initializes the router, sets up listeners, and renders the initial route.

---

### `Router.goTo(path)`

Programmatically navigates to a new route.

- **path**: _(string)_ The target path.

**Returns:** `Promise<void>`

---

### `Router.back()`

Navigates one step back in browser history.

---

### `Router.path()`

Returns the current path, including hash if present.

**Returns:** `string`

---

### `Router.prev()`

Returns the previous visited path.

**Returns:** `string` – Defaults to `'/'` if unavailable.

---

### `Router.base()`

Returns the base (first) segment of the current path.

**Returns:** `string`

---

### `Router.info()`

Returns the current route info.

**Returns:**

```ts
{
  meta: object,
  params: object,
  segments: string[]
}
```

---

## Route Definitions

### `Router.routes(config)`

Defines app’s navigation structure. It accepts an object where keys are route paths, and values are config objects containing:

component: Function that returns a DOM element (e.g. built using Domo).

meta: Optional metadata (used for things like document.title, description).

children: Optional nested routes under the current path.

If a route has children, they’re defined inside a children object. You must also include the default child route as '/' inside children.

Nested routes don’t inherit the parent path automatically. Defining '/' under children means “default route when accessing parent”.

\*: Wildcard to catch all unmatched routes.

- **config**: _(object)_ Route definition object.

**Example:**

```js
Router.routes({
  '/': {
    component: Home,
    meta: { title: 'Home', description: 'Welcome to the homepage' }
  },
  '/about': {
    component: About,
    meta: { title: 'About', description: 'Learn more about us' }
  },
  '/blog': {
    children: {
      '/': {
        component: BlogPost   // default /blog
        meta: { title: 'Blog', description: 'Our latest posts' },
      }
      '/:slug': { component: BlogHome }, // dynamic blog post /blog/my-title
    }
  }
  '*': {
    component: NotFound,
    meta: { title: '404', description: 'Page not found' }
  }
});
```

---

## Event Handling

### `Router.listen(callback)`

Registers a callback to be called on route changes.

- **callback**: _(function)_ Receives the same object as `Router.info()`.

```js
Router.listen(({ meta, params }) => {
  document.title = meta.title || "App";
});
```
