# Modal

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
