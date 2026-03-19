# @zyrab/domo

**Small, Fast, and Chainable.**

`domo` is a minimalist, industrial-strength DOM builder and UI micro-framework designed for developers who value performance, zero-boilerplate, and elegant APIs. It provides a fluent, chainable interface for building both dynamic browser applications and high-performance static sites.

---

## Why Domo?

In a world of heavy frameworks, `domo` returns to the fundamentals while providing modern features for the SSG era.

- **Fluent API**: Build complex structures with a natural, chainable syntax.
- **Dual-Entry Architecture**: Optimized builds for both Client and Server. The client bundle contains 0% string-building logic, while the server bundle acts as a high-speed metadata collector.
- **Zero-Branching**: No more `if (isServer)` in your components. Environment-aware modules handle the complexity for you.
- **SSG Native**: Deeply integrated with `@zyrab/domo-ssg`. Automatically collects events, refs, and state during the render pass to enable seamless hydration-free interactivity.
- **Microscopic Footprint**: Designed to be small enough to stay out of your way, yet powerful enough to build entire applications.

---

## Installation

```bash
pnpm add @zyrab/domo
```

---

## Usage

### Basic Component
```javascript
import Domo from '@zyrab/domo';

const card = Domo('div').cls('card')
  .child([
    Domo('h1').txt('Product Name').css({ color: 'blue' }),
    Domo('p').txt('This is a description.'),
    Domo('button').txt('Add to Cart').on('click', () => alert('Added!'))
  ])
  .build();

document.body.appendChild(card);
```

### Advanced State & Interactivity
Domo handles state synchronization between Server and Client via the `.state()` method.

```javascript
import Domo from '@zyrab/domo';

export default function Counter(initial = 0) {
  return Domo('div').cls('counter')
    .state({ count: initial })
    .child([
      Domo('span').txt(`Count: ${initial}`).id('display'),
      Domo('button').txt('+').on('click', (e) => {
        // Access state via Domo runtime...
      })
    ]);
}
```

### Server-Side Rendering (SSG/SSR)
On the server, `domo` generates clean HTML while capturing metadata for the hydration bridge.

```javascript
import Domo from '@zyrab/domo';

// Identical code works on the server!
const html = Domo('div').txt('Hello from Server').build();
console.log(html); // "<div>Hello from Server</div>"
```

---

## Architecture

Domo uses a **Layered Inheritance System** instead of dynamic mixins, ensuring maximum compatibility with modern bundlers and IDEs.

- **Client Pass**: Uses native `document.createElement`, `classList`, and `addEventListener`.
- **Server Pass**: Uses a lightweight "Virtual Element" (`vel`) schema and collects metadata (events, refs, state) for the SSG to generate optimal client-side bridge logic.

---

## License

MIT © [Zyrab](https://github.com/zyrab) - see the [LICENSE.md](LICENSE.md) file for details.
