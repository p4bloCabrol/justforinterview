# VirtualList

Una lista que renderiza sólo las filas visibles de un dataset de decenas de miles de items, manteniendo el scroll nativo, la altura total correcta y la navegación por teclado.

## La dificultad

Performance como problema de diseño: medir el viewport, calcular el rango visible a partir de `scrollTop`, posicionar filas sin rehacer el layout, y que el scroll se sienta nativo. La versión de altura fija es el ejercicio; la de altura variable, el bonus que separa seniors.

## API esperada

```tsx
<VirtualList
  items={logs}                 // 50.000
  itemHeight={36}              // número fijo; bonus: (index) => number, o medición
  height={320}                 // o que llene el contenedor (ResizeObserver)
  overscan={5}
  getKey={(log) => log.id}
  renderItem={(log, index, style) => <Row style={style} log={log} />}
/>
```

```ts
function useVirtualizer(opts: { count: number; itemHeight: number; overscan: number;
  scrollRef: React.RefObject<HTMLElement> }): {
  totalHeight: number;
  virtualItems: { index: number; start: number }[];
  scrollToIndex(index: number, align?: 'start' | 'center' | 'end' | 'auto'): void;
};
```

## Requisitos

- La lógica en `useVirtualizer` (headless, como el Combobox); el componente sólo pinta.
- Contenedor con `overflow: auto` y un hijo de alto `totalHeight`; las filas con `position: absolute` y `transform: translateY(start)` (no `top`: justificá).
- Rango: `start = floor(scrollTop / h) - overscan`, `end = ceil((scrollTop + viewport) / h) + overscan`, clampeados.
- Leer `scrollTop` en el evento `scroll` (pasivo) y guardar en estado sólo lo necesario: que un scroll que no cambia el rango **no** re-renderice.
- Altura del viewport con `ResizeObserver` (con cleanup).
- `scrollToIndex` para saltar a una fila (y para el teclado).
- Keys estables con `getKey`, nunca el índice.
- Bonus: alturas variables medidas con `ResizeObserver` por fila, cache de offsets y búsqueda binaria del primer visible.

## Accesibilidad y teclado

- `role="list"` / `role="listitem"` (o `listbox`/`option` si es seleccionable) con `aria-setsize` y `aria-posinset` en cada fila: el lector tiene que saber que hay 50.000 aunque haya 15 en el DOM.
- Contenedor enfocable; ↑ ↓ mueven una fila activa, PageUp/PageDown una pantalla, Home/End a los extremos, siempre con `scrollToIndex`.

## Criterios de aceptación

- [ ] Con 50.000 items, el DOM nunca tiene más de `visibles + 2 × overscan` filas.
- [ ] El scrollbar refleja el alto total (`items.length × itemHeight`).
- [ ] Scrollear 10px dentro de la misma fila no provoca render (contá renders en un test o con el Profiler).
- [ ] `scrollToIndex(25000, 'center')` deja esa fila en el medio.
- [ ] End lleva al último item y es visible.
- [ ] Cambiar `height` del contenedor recalcula el rango sin recargar.
- [ ] Cada fila tiene `aria-posinset` correcto y `aria-setsize` = total.

## Preguntas de entrevista

- ¿Por qué no alcanza con `React.memo` en cada fila para 50.000 items?
- ¿`transform` vs. `top` para posicionar? ¿Qué es composición en el navegador?
- ¿Qué problemas trae la virtualización? (Ctrl+F del navegador, accesibilidad, scroll restoration, impresión)
- ¿Cómo encararías alturas variables? ¿Por qué medir antes de pintar puede dar scroll jumps y cómo se corrige?
- ¿Cuándo usarías `content-visibility: auto` en vez de virtualizar?

## Visual

Contenedor `surface` con borde `border` y `radius-lg`. Filas de 36px con padding `space-4`, divisor `border`, índice en mono `caption` `text-subtle`. Fila activa en `surface-muted` con foco visible.
