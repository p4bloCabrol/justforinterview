# Button

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
