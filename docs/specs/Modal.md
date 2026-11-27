# Modal

**English** · [Español](#español)

A modal dialog rendered in a portal that traps focus, locks background scroll, closes on Escape and returns focus to whatever opened it.

## The challenge

Effects with real side effects on the global DOM (body, focus, listeners) and their exact cleanup, even with two stacked modals and with StrictMode mounting and unmounting twice.

## Expected API

```tsx
<Modal open={open} onOpenChange={setOpen}>
  <Modal.Title>Delete project</Modal.Title>
  <Modal.Description>This action cannot be undone.</Modal.Description>
  …
  <Modal.Close asChild?><Button>Cancel</Button></Modal.Close>
</Modal>
```

```ts
interface ModalProps {
  open: boolean;                         // always controlled
  onOpenChange: (open: boolean) => void;
  initialFocusRef?: React.RefObject<HTMLElement>;
  closeOnBackdropClick?: boolean;        // default true
  children: React.ReactNode;
}
```

## Requirements

- `createPortal` into `document.body` (or into a configurable container). Nothing renders when `open` is false.
- **Focus on open**: to `initialFocusRef` or to the first focusable element in the panel. **On close**: back to the element that had focus before opening (store it in a ref on open).
- **Focus trap**: Tab and Shift+Tab cycle within the panel. Write the focusable-element selector and its edge cases yourself (`[disabled]`, `tabindex="-1"`, hidden elements).
- **Scroll lock**: `overflow: hidden` on `body` on open, restoring the **previous** value on close (not `''`). Compensate for the scrollbar width with `padding-right` so the layout doesn't shift.
- **Stacking**: with two modals open, Escape closes only the top one, and scroll is released only when the last one closes (think of a module-level counter or stack).
- Clicking the backdrop closes; a click that starts inside and ends outside (dragging to select text) does **not** close.
- Bonus: compare it with the native `<dialog>` and `showModal()`, and note what it gives you for free.

## Accessibility and keyboard

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the Title, `aria-describedby` pointing to the Description.
- The rest of the page is inert: `inert` on the portal's siblings, or at least `aria-hidden`.
- Escape closes.

## Acceptance criteria

- [ ] Opening moves focus inside; closing returns it to the button that opened it.
- [ ] Tab from the last focusable goes to the first; Shift+Tab from the first goes to the last.
- [ ] `document.body.style.overflow` returns to exactly its previous value.
- [ ] Two modals: Escape closes the top one; the body stays locked until both are closed.
- [ ] Unmounting the component while the modal is open cleans up everything (listeners, overflow, inert).
- [ ] Works the same under `<StrictMode>`.
- [ ] `getByRole('dialog', { name: 'Delete project' })` works.

## Interview questions

- Why a portal? What happens to React synthetic events that bubble up from a portal?
- Why does StrictMode mount, unmount and remount effects? What bug does that expose here?
- `useEffect` or `useLayoutEffect` to move focus and lock scroll? Why?
- What does `inert` solve that `aria-hidden` doesn't?

## Visual

`overlay` backdrop at `z-modal`. Panel `surface`, `radius-lg`, `shadow-modal`, `space-6` padding, max width 440px. Title in `heading` style, description in `text-muted`, right-aligned footer with a `space-2` gap.

---

<a id="español"></a>

# Modal — Español

Un diálogo modal renderizado en un portal, que atrapa el foco, bloquea el scroll de fondo, se cierra con Escape y devuelve el foco a quien lo abrió.

## La dificultad

Efectos con efectos secundarios reales sobre el DOM global (body, foco, listeners) y su cleanup exacto, incluso con dos modales apilados y con StrictMode montando y desmontando dos veces.

## API esperada

```tsx
<Modal open={open} onOpenChange={setOpen}>
  <Modal.Title>Eliminar proyecto</Modal.Title>
  <Modal.Description>Esta acción no se puede deshacer.</Modal.Description>
  …
  <Modal.Close asChild?><Button>Cancelar</Button></Modal.Close>
</Modal>
```

```ts
interface ModalProps {
  open: boolean;                         // siempre controlado
  onOpenChange: (open: boolean) => void;
  initialFocusRef?: React.RefObject<HTMLElement>;
  closeOnBackdropClick?: boolean;        // default true
  children: React.ReactNode;
}
```

## Requisitos

- `createPortal` a `document.body` (o a un contenedor configurable). Nada se renderiza si `open` es false.
- **Foco al abrir**: a `initialFocusRef` o al primer enfocable del panel. **Al cerrar**: vuelve al elemento que tenía el foco antes de abrir (guardalo en una ref al abrir).
- **Focus trap**: Tab y Shift+Tab ciclan dentro del panel. Escribí vos el selector de enfocables y su borde (`[disabled]`, `tabindex="-1"`, elementos ocultos).
- **Scroll lock**: `overflow: hidden` en `body` al abrir, restaurando el valor **previo** al cerrar (no `''`). Compensá el ancho del scrollbar con `padding-right` para que no salte el layout.
- **Apilado**: con dos modales abiertos, Escape cierra sólo el de arriba y el scroll se libera recién cuando cierra el último (pensá un contador o una pila a nivel módulo).
- Click en el backdrop cierra; click que empieza adentro y termina afuera (arrastrar texto) **no** cierra.
- Bonus: comparalo con `<dialog>` nativo y `showModal()`, y anotá qué te resuelve gratis.

## Accesibilidad y teclado

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` al Title, `aria-describedby` a la Description.
- El resto de la página inerte: `inert` en los hermanos del portal, o al menos `aria-hidden`.
- Escape cierra.

## Criterios de aceptación

- [ ] Abrir mueve el foco adentro; cerrar lo devuelve al botón que lo abrió.
- [ ] Tab desde el último enfocable va al primero; Shift+Tab desde el primero va al último.
- [ ] `document.body.style.overflow` vuelve exactamente a su valor previo.
- [ ] Dos modales: Escape cierra el de arriba; el body sigue bloqueado hasta cerrar ambos.
- [ ] Desmontar el componente con el modal abierto limpia todo (listeners, overflow, inert).
- [ ] Funciona igual bajo `<StrictMode>`.
- [ ] `getByRole('dialog', { name: 'Eliminar proyecto' })` funciona.

## Preguntas de entrevista

- ¿Por qué un portal? ¿Qué pasa con los eventos sintéticos de React que burbujean desde un portal?
- ¿Por qué StrictMode monta, desmonta y vuelve a montar los efectos? ¿Qué bug te destapa acá?
- ¿`useEffect` o `useLayoutEffect` para mover el foco y bloquear el scroll? ¿Por qué?
- ¿Qué resuelve `inert` que `aria-hidden` no?

## Visual

Backdrop `overlay` en `z-modal`. Panel `surface`, `radius-lg`, `shadow-modal`, padding `space-6`, ancho máx. 440px. Título estilo `heading`, descripción `text-muted`, footer alineado a la derecha con gap `space-2`.
