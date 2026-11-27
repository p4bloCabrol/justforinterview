# Tooltip

Una etiqueta flotante que aparece al hover o foco de su disparador, se posiciona midiendo con refs y se da vuelta si no entra en el viewport.

## La dificultad

Medir el DOM y posicionar antes del paint (`useLayoutEffect`) sin parpadeo, y manejar timers de entrada y salida que se cancelan bien entre sí.

## API esperada

```tsx
<Tooltip content="Copiar al portapapeles" side="top" delay={400}>
  <Button aria-label="Copiar">⧉</Button>
</Tooltip>
```

```ts
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;   // un único elemento que acepte ref y handlers
  side?: 'top' | 'bottom' | 'left' | 'right';  // default 'top'
  offset?: number;                // default 8
  delay?: number;                 // entrada, default 400ms
  closeDelay?: number;            // salida, default 100ms
}
```

## Requisitos

- El trigger es el hijo: necesitás su ref y sus handlers **sin pisar** los que ya tenga (componé `onMouseEnter`, `onFocus`, etc., y la ref: si el hijo ya tiene ref, las dos tienen que funcionar).
- Abrir con mouseenter y focus (con delay); cerrar con mouseleave, blur y Escape (con closeDelay, Escape inmediato).
- Si el mouse sale y vuelve dentro del closeDelay, no parpadea: se cancela el cierre.
- Posición: `getBoundingClientRect()` del trigger y del tooltip en `useLayoutEffect`, `position: fixed`, centrado sobre el lado elegido. Si se sale del viewport, **flip** al lado opuesto; además clamp horizontal a 8px del borde.
- Recalcular en scroll y resize mientras está abierto (con cleanup de los listeners).
- Todos los timers se limpian al desmontar. Nada de `setState` sobre un componente desmontado.
- Renderizado en portal.

## Accesibilidad y teclado

- El tooltip tiene `role="tooltip"` y un id; el trigger `aria-describedby` a ese id **mientras está visible**.
- Aparece también con foco de teclado; Escape lo cierra sin mover el foco.
- No lo uses para información esencial ni con contenido interactivo (eso es un popover).

## Criterios de aceptación

- [ ] Con fake timers: no aparece antes de `delay`; aparece después.
- [ ] Salir y volver antes de `closeDelay` lo mantiene abierto.
- [ ] Un `onMouseEnter` propio del hijo se sigue llamando.
- [ ] Un `ref` propio del hijo sigue recibiendo el elemento.
- [ ] Con el trigger pegado al borde superior y `side="top"`, se renderiza abajo.
- [ ] Desmontar con un timer pendiente no tira warnings ni errores.
- [ ] No hay salto visible de posición (primer paint ya en su lugar).

## Preguntas de entrevista

- ¿Qué diferencia de timing hay entre `useEffect` y `useLayoutEffect`? ¿Qué se ve si medís en `useEffect`?
- ¿Cómo componés refs? (función `mergeRefs`, callback ref)
- ¿`cloneElement` vs. envolver en un `<span>`? Costos de cada uno.
- ¿Por qué `position: fixed` y no `absolute` dentro del portal?
- ¿Cómo se comporta en touch, donde no hay hover?

## Visual

Fondo `tooltip-bg`, texto `tooltip-fg` estilo `caption`, padding `space-1`/`space-2`, `radius-sm`, `shadow-popover`, ancho máx. 240px, `z-tooltip`, sin pointer events.
