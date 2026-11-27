# Combobox

**English** · [Español](#español)

An input with a filterable list of options, built headless: all the logic lives in a custom `useCombobox` hook that returns prop getters, and the visual component is a thin layer on top.

## The challenge

Truly separating behavior from presentation (the hook knows nothing about CSS or markup), and implementing the most complex ARIA pattern in the set: focus stays on the input while the "active" option moves via `aria-activedescendant`.

## Expected API

```ts
interface UseComboboxOptions<T> {
  items: T[];
  itemToString: (item: T) => string;
  filter?: (item: T, query: string) => boolean;   // default: includes, case- and accent-insensitive
  selectedItem?: T | null;  defaultSelectedItem?: T | null;
  onSelectedItemChange?: (item: T | null) => void;
  inputValue?: string;      onInputValueChange?: (v: string) => void;
}

interface UseComboboxReturn<T> {
  isOpen: boolean;
  activeIndex: number;          // -1 = none
  filteredItems: T[];
  selectedItem: T | null;
  getLabelProps(): React.LabelHTMLAttributes<HTMLLabelElement>;
  getInputProps(user?: React.InputHTMLAttributes<HTMLInputElement>): React.InputHTMLAttributes<HTMLInputElement> & { ref: React.Ref<HTMLInputElement> };
  getListboxProps(): React.HTMLAttributes<HTMLUListElement>;
  getOptionProps(opts: { item: T; index: number }): React.LiHTMLAttributes<HTMLLIElement>;
}
```

```tsx
<Combobox label="Country" items={paises} itemToString={p => p.nombre} />
```

## Requirements

- The getters **compose** the user's handlers (if they pass `onKeyDown`, both get called; if the user's calls `preventDefault`, yours does nothing).
- Filtering is derived during render (`useMemo`), case- and accent-insensitive ("cordoba" matches "Córdoba"). Highlight the match with `<mark>`.
- Typing opens the list and resets `activeIndex` to 0 (or -1 if there are no results); "No results" is shown.
- Selecting: the input shows `itemToString(item)`, the list closes, focus stays on the input.
- Blur: closes; if the text doesn't match the selection, restore the selected item's text (decide and document it).
- The active option stays visible: `scrollIntoView({ block: 'nearest' })` when it moves.
- Generic over `T`: works with strings and with objects, without `any`.

## Accessibility and keyboard

- Input with `role="combobox"`, `aria-expanded`, `aria-controls` pointing to the listbox, `aria-autocomplete="list"`, `aria-activedescendant` set to the active option's id (or absent).
- Listbox with `role="listbox"`, options with `role="option"`, `aria-selected` and stable ids.
- ↓ opens / moves down, ↑ moves up (with wrap), Home/End, Enter selects, Escape closes (and a second press clears), Tab selects the active option or simply leaves (your call).
- `mousedown` on an option with `preventDefault` so the input doesn't lose focus before the click.

## Acceptance criteria

- [ ] `useCombobox` is tested with `renderHook`, without any markup of its own.
- [ ] Typing "cord" + ↓ + Enter selects "Córdoba" and closes.
- [ ] `aria-activedescendant` changes with the arrow keys and DOM focus never leaves the input.
- [ ] Clicking an option selects it without the blur closing the list first.
- [ ] A user `onKeyDown` passed to `getInputProps` gets called.
- [ ] With 0 results, Enter does nothing and "No results" is shown.
- [ ] axe reports no violations with the list open.

## Interview questions

- What is a headless component, and what do you gain vs. a styled component?
- Prop getters vs. returning standalone handlers? What problem does composing solve?
- Roving tabindex vs. `aria-activedescendant`: when to use each? Why the latter here?
- How would you make it async (searching against an API) without race conditions? (AbortController, ignoring stale responses, debounce)

## Visual

Input identical to TextField. Listbox `surface`, `radius-md`, `shadow-popover`, `z-popover`, max 220px with scroll, `space-1` padding. Option with `space-2`/`space-3` padding, active in `surface-muted`, selected with ✓, match in `<mark>` at weight 600 with no background.

---

<a id="español"></a>

# Combobox — Español

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
