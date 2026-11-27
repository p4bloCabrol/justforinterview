# Button

**English** · [Español](#español)

A button that behaves exactly like a native `<button>`, with variants, sizes and a loading state, and that passes any prop and the ref through to the real element.

## The challenge

Correctly typing a wrapper around a native element: extending its props without overriding them, passing the rest through with `...rest`, and forwarding the ref. It looks trivial, and it's exactly where craftsmanship shows the most.

## Expected API

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;   // default 'secondary'
  size?: ButtonSize;         // default 'md'
  loading?: boolean;         // shows a spinner, blocks clicks, keeps the width
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// React 18: forwardRef<HTMLButtonElement, ButtonProps>
// React 19: ref as a regular prop — be ready to explain both
```

## Requirements

- `type="button"` by default (not `submit`): a button inside a form must not submit it by accident. If the consumer passes `type`, theirs wins.
- The consumer's `className` is **appended** to `jfi-btn`, not a replacement for it.
- `onClick`, `aria-*`, `data-*`, `form`, etc. reach the `<button>` without you declaring them.
- `loading`: shows `.jfi-spinner`, sets `aria-busy="true"` and `data-loading`, does **not** fire `onClick`, and focus is not lost (don't use `disabled` if you want it to remain focusable: think `aria-disabled`).
- Variant and size are expressed as `data-variant` and `data-size` (the CSS reads them).

## Accessibility and keyboard

- It's a real `<button>`: Enter and Space come for free. Don't reimplement anything with a `div`.
- Icon-only button: require `aria-label` (think about how to enforce it with types: a discriminated union).
- Visible focus with the `focus` ring.

## Acceptance criteria

- [ ] `ref.current` is the `HTMLButtonElement` (test with `createRef`).
- [ ] Without `type`, it renders `type="button"`; with `type="submit"`, it submits the form.
- [ ] `className="x"` produces `class="jfi-btn x"`.
- [ ] With `loading`, a click does not call `onClick` and the button stays in the tab order.
- [ ] `<Button onClick>` accepts `(e: React.MouseEvent<HTMLButtonElement>) => void` without casts.
- [ ] A button with no text and no `aria-label` does not compile (bonus).
- [ ] axe reports no violations across the 4 variants.

## Interview questions

- What's the difference between `ComponentProps`, `ComponentPropsWithRef` and `ComponentPropsWithoutRef`?
- Why did `forwardRef` exist, and what changed in React 19?
- `disabled` or `aria-disabled` on a loading button? What does each one lose?
- How would you build a polymorphic `asChild` or `as` prop, and what does it cost in terms of types?
- Why does the order of `{...rest}` vs. your own props matter?

## Visual

Height 32px (`sm` 28, `lg` 40), `space-3` padding, `radius-sm`, `label` text style. Primary on `accent`/`accent-fg`, secondary `surface` with a `border-control` border, ghost with no background, danger on `danger`/`danger-fg`.

---

<a id="español"></a>

# Button — Español

Un botón que se comporta exactamente como un `<button>` nativo, con variantes, tamaños y estado de carga, y que deja pasar cualquier prop y la ref al elemento real.

## La dificultad

Tipar bien un wrapper de un elemento nativo: extender sus props sin pisarlas, pasar el resto con `...rest` y reenviar la ref. Parece trivial y es donde más se nota el oficio.

## API esperada

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;   // default 'secondary'
  size?: ButtonSize;         // default 'md'
  loading?: boolean;         // muestra spinner, bloquea clicks, mantiene el ancho
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// React 18: forwardRef<HTMLButtonElement, ButtonProps>
// React 19: ref como prop normal — sabé explicar las dos
```

## Requisitos

- `type="button"` por defecto (no `submit`): un botón dentro de un form no debe enviarlo por accidente. Si el consumidor pasa `type`, gana el suyo.
- `className` del consumidor se **suma** a `jfi-btn`, no lo reemplaza.
- `onClick`, `aria-*`, `data-*`, `form`, etc. llegan al `<button>` sin que los declares.
- `loading`: muestra `.jfi-spinner`, pone `aria-busy="true"` y `data-loading`, **no** dispara `onClick`, y el foco no se pierde (no uses `disabled` si querés que siga enfocable: pensá `aria-disabled`).
- Variante y tamaño se expresan como `data-variant` y `data-size` (el CSS los lee).

## Accesibilidad y teclado

- Es un `<button>` real: Enter y Espacio vienen gratis. No reimplementes nada con `div`.
- Botón sólo con ícono: exigí `aria-label` (pensá cómo forzarlo con tipos: union discriminada).
- Foco visible con el anillo `focus`.

## Criterios de aceptación

- [ ] `ref.current` es el `HTMLButtonElement` (test con `createRef`).
- [ ] Sin `type`, renderiza `type="button"`; con `type="submit"`, envía el form.
- [ ] `className="x"` produce `class="jfi-btn x"`.
- [ ] Con `loading`, un click no llama a `onClick` y el botón sigue en el orden de tabulación.
- [ ] `<Button onClick>` acepta `(e: React.MouseEvent<HTMLButtonElement>) => void` sin casts.
- [ ] Un botón sin texto y sin `aria-label` no compila (bonus).
- [ ] axe sin violaciones en las 4 variantes.

## Preguntas de entrevista

- ¿Diferencia entre `ComponentProps`, `ComponentPropsWithRef` y `ComponentPropsWithoutRef`?
- ¿Por qué `forwardRef` existía y qué cambió en React 19?
- ¿`disabled` o `aria-disabled` en un botón con loading? ¿Qué pierde cada uno?
- ¿Cómo harías un prop `asChild` o `as` polimórfico y qué costo tiene en tipos?
- ¿Por qué el orden importa en `{...rest}` vs. tus props propias?

## Visual

Alto 32px (`sm` 28, `lg` 40), padding `space-3`, `radius-sm`, texto estilo `label`. Primario sobre `accent`/`accent-fg`, secundario `surface` con borde `border-control`, ghost sin fondo, danger sobre `danger`/`danger-fg`.
