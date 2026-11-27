# Combobox

Un input con lista filtrable de opciones, construido headless: toda la lógica vive en un custom hook `useCombobox` que devuelve props getters, y el componente visual es una capa fina encima.

## La dificultad

Separar comportamiento de presentación de verdad (el hook no sabe de CSS ni de markup), y resolver el patrón ARIA más complejo del set: foco que queda en el input mientras la opción "activa" se mueve con `aria-activedescendant`.

## API esperada

```ts
interface UseComboboxOptions<T> {
  items: T[];
  itemToString: (item: T) => string;
  filter?: (item: T, query: string) => boolean;   // default: includes, case/acentos-insensitive
  selectedItem?: T | null;  defaultSelectedItem?: T | null;
  onSelectedItemChange?: (item: T | null) => void;
  inputValue?: string;      onInputValueChange?: (v: string) => void;
}

interface UseComboboxReturn<T> {
  isOpen: boolean;
  activeIndex: number;          // -1 = ninguna
  filteredItems: T[];
  selectedItem: T | null;
  getLabelProps(): React.LabelHTMLAttributes<HTMLLabelElement>;
  getInputProps(user?: React.InputHTMLAttributes<HTMLInputElement>): React.InputHTMLAttributes<HTMLInputElement> & { ref: React.Ref<HTMLInputElement> };
  getListboxProps(): React.HTMLAttributes<HTMLUListElement>;
  getOptionProps(opts: { item: T; index: number }): React.LiHTMLAttributes<HTMLLIElement>;
}
```

```tsx
<Combobox label="País" items={paises} itemToString={p => p.nombre} />
```

## Requisitos

- Los getters **componen** los handlers del usuario (si pasa `onKeyDown`, se llaman los dos; si el del usuario hace `preventDefault`, el tuyo no actúa).
- Filtrado derivado en render (`useMemo`), insensible a mayúsculas y acentos ("cordoba" encuentra "Córdoba"). Resaltá la coincidencia con `<mark>`.
- Escribir abre la lista y resetea `activeIndex` a 0 (o -1 si no hay resultados); se muestra "Sin resultados".
- Seleccionar: el input muestra `itemToString(item)`, la lista se cierra, foco queda en el input.
- Blur: cierra; si el texto no coincide con la selección, restaurá el texto de la seleccionada (decidí y documentá).
- La opción activa se mantiene visible: `scrollIntoView({ block: 'nearest' })` al moverla.
- Genérico en `T`: funciona con strings y con objetos, sin `any`.

## Accesibilidad y teclado

- Input `role="combobox"`, `aria-expanded`, `aria-controls` al listbox, `aria-autocomplete="list"`, `aria-activedescendant` al id de la opción activa (o ausente).
- Listbox `role="listbox"`, opciones `role="option"` con `aria-selected` y ids estables.
- ↓ abre / baja, ↑ sube (con wrap), Home/End, Enter selecciona, Escape cierra (y una segunda vez limpia), Tab selecciona la activa o simplemente sale (decidí).
- `mousedown` en una opción con `preventDefault` para que el input no pierda el foco antes del click.

## Criterios de aceptación

- [ ] `useCombobox` se testea con `renderHook` sin markup propio.
- [ ] Tipear "cord" + ↓ + Enter selecciona "Córdoba" y cierra.
- [ ] `aria-activedescendant` cambia con las flechas y el foco DOM no se mueve del input.
- [ ] Click en una opción selecciona sin que el blur cierre la lista antes.
- [ ] Un `onKeyDown` del usuario pasado a `getInputProps` se llama.
- [ ] Con 0 resultados, Enter no hace nada y se ve "Sin resultados".
- [ ] axe sin violaciones con la lista abierta.

## Preguntas de entrevista

- ¿Qué es un componente headless y qué ganás vs. un componente con estilos?
- ¿Prop getters vs. devolver handlers sueltos? ¿Qué problema resuelve componer?
- ¿Roving tabindex vs. `aria-activedescendant`: cuándo cada uno? ¿Por qué acá el segundo?
- ¿Cómo lo harías asíncrono (búsqueda a una API) sin race conditions? (AbortController, ignorar respuestas viejas, debounce)

## Visual

Input igual al TextField. Listbox `surface`, `radius-md`, `shadow-popover`, `z-popover`, máx. 220px con scroll, padding `space-1`. Opción con padding `space-2`/`space-3`, activa en `surface-muted`, seleccionada con ✓, coincidencia en `<mark>` peso 600 sin fondo.
