# Domo API

Fluent, chainable DOM builder. Helps you create, modify, and manage elements in a clean and expressive way.

---

## Core

### `new Domo(tag?)`

Creates a new DOM element. Defaults to `<div>`.

```js
const btn = new Domo("button").txt("Click me").cls("primary").build();
```

---

## Setters

### `.id(id: string)`

Sets the `id`.

```js
.el('input').id('username')
```

### `.val(value: string)`

Sets the `value` property.

```js
.el('input').val('Zyrab')
```

### `.txt(text: string)`

Sets `textContent`.

```js
.el('span').txt('Hello')
```

### `.cls(className: string | string[])`

Adds class(es).

```js
.cls('box')
.cls('box active red')
.cls(['big', 'highlight'])
```

### `.rmvCls(className: string | string[])`

Removes class(es).

```js
.rmvCls('active')
```

### `.tgglCls(className: string, force?: boolean)`

Toggles class.

```js
.tgglCls('open')
```

### `.attr(attrs: Record<string, any>)`

Sets attributes. Skips event handlers. Boolean true means present, false removes it.

```js
.attr({ title: 'info', disabled: true })
```

### `.tgglAttr(name: string, force?: boolean)`

Toggles attribute on/off.

```js
.tgglAttr('disabled')
```

### `.data(data: Record<string, string>)`

Sets `data-*` attributes.

```js
.data({ id: '42', role: 'btn' })
```

### `.css(styles: Partial<CSSStyleDeclaration>)`

Sets inline styles.

```js
.css({ color: 'red', fontSize: '20px' })
```

---

## 3. Events

### `.on(event: string, callback: fn, options?)`

Basic event binding.

```js
.on('click', (e) => console.log('clicked'))
```

### `.onClosest(event: string, handlers: Record<string, fn>, options?)`

Event delegation via `closest()`.

```js
.onClosest('click', {
  '.close': (e, el) => el.remove(),
  '.open': (e, el) => el.cls('close'),
})
```

### `.onMatch(event: string, handlers: Record<string, fn>, options?)`

Event delegation via `matches()`.

```js
.onMatch('click', {
  'button.delete': (e, el) => deleteItem(el),
})
```

---

## 4. DOM Manipulation

### `.child(children: any[])`

Appends children. Accepts elements, strings, numbers, arrays, Domo instances, fragments.

```js
.child([
  new Domo('h1').txt('Title'),
  'Plain text',
])
```

### `.clear()`

Removes all children.

```js
.clear()
```

### `.replace(oldNode, newContent)`

Replaces a specific child or self with new content.

```js
.replace(someNode, new Domo('span').txt('Updated'))
```

### `.show(visible?: boolean, display?: string)`

Toggles visibility using `style.display`.

```js
.show(true)
.show(false)
```

### `.if(condition: boolean)`

Conditionally includes the element. If false, returns a dummy hidden node.

```js
new Domo("div").if(userIsLoggedIn);
```

### `.ref(callback: (el: HTMLElement) => void)`

Gives access to raw element during chain.

```js
.ref(el => console.log(el))
```

---

## 5. Output

### `.build()`

Returns the constructed `HTMLElement`.

```js
const el = new Domo("button").txt("Save").build();
```

Use this at the end of your chain to get the real DOM element.
