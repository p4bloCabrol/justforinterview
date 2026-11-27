# Accordion

**English** · [Español](#español)

Collapsible sections in "single open" or "multiple open" mode, with derived state and stable keys.

## The challenge

Model the state once for both modes without duplicating it, derive everything else during render, and understand what keys do when items are reordered or added.

## Expected API

```tsx
<Accordion type="single" collapsible defaultValue="envios">
  <Accordion.Item value="envios">
    <Accordion.Trigger>Shipping</Accordion.Trigger>
    <Accordion.Panel>…</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

```ts
type AccordionProps =
  | { type: 'single'; value?: string | null; defaultValue?: string | null;
      onValueChange?: (v: string | null) => void; collapsible?: boolean }
  | { type: 'multiple'; value?: string[]; defaultValue?: string[];
      onValueChange?: (v: string[]) => void };
```

## Requirements

- The union discriminated by `type` makes `onValueChange` receive the correct type without casts.
- Internally, a single piece of state. Consider whether to normalize to `string[]` and derive single mode, or the other way around. `isOpen(value)` is computed during render, not stored.
- `single` without `collapsible`: clicking the open item does not close it.
- Controlled and uncontrolled, using the same hook as always.
- A demo with items that can be reordered and added: try `key={index}` and `key={item.id}` and explain the difference (put an input inside the panel so you can see it).

## Accessibility and keyboard

- Trigger: `<button aria-expanded aria-controls>` inside a heading (`<h3>`), per the APG.
- Panel: `role="region"` with `aria-labelledby` pointing to the trigger, hidden with `hidden` when closed.
- Optional part of the pattern: ↑ ↓ Home End move focus between triggers.

## Acceptance criteria

- [ ] `single`: opening one closes the other.
- [ ] `single` without `collapsible`: clicking the open item does not close it; with `collapsible` it does.
- [ ] `multiple`: several open at once; `onValueChange` receives a new array (not mutated).
- [ ] `aria-expanded` and `hidden` are always in sync.
- [ ] With `key={index}`, reordering leaves the typed text in the wrong item; with `key={id}`, it doesn't. You have a test that demonstrates it.
- [ ] TypeScript rejects `type="single"` with `defaultValue={['a']}`.

## Interview questions

- What is derived state, and why not store it in a separate `useState`?
- What does React do with keys during reconciliation? When is `key={index}` acceptable?
- How would you use a key to deliberately reset a component's state?
- How would you animate the height of a panel whose content has an unknown height? (grid-template-rows 0fr→1fr, measuring with a ref)

## Visual

`surface` container with a `border` border and `radius-lg`, `border` dividers. Trigger with `space-3`/`space-4` padding, `label` text, +/− indicator in mono `text-muted`, `surface-muted` on hover. Panel in `text-muted`.

---

<a id="español"></a>

# Accordion — Español

Secciones colapsables en modo "uno abierto" o "varios abiertos", con estado derivado y keys estables.

## La dificultad

Modelar el estado una sola vez para los dos modos sin duplicarlo, derivar todo lo demás en render, y entender qué hacen las keys cuando los items se reordenan o se agregan.

## API esperada

```tsx
<Accordion type="single" collapsible defaultValue="envios">
  <Accordion.Item value="envios">
    <Accordion.Trigger>Envíos</Accordion.Trigger>
    <Accordion.Panel>…</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

```ts
type AccordionProps =
  | { type: 'single'; value?: string | null; defaultValue?: string | null;
      onValueChange?: (v: string | null) => void; collapsible?: boolean }
  | { type: 'multiple'; value?: string[]; defaultValue?: string[];
      onValueChange?: (v: string[]) => void };
```

## Requisitos

- La union discriminada por `type` hace que `onValueChange` reciba el tipo correcto sin casts.
- Internamente, un solo estado. Pensá si normalizar a `string[]` y derivar el modo single, o al revés. `isOpen(value)` se calcula en render, no se guarda.
- `single` sin `collapsible`: hacer click en el abierto no lo cierra.
- Controlado y no controlado, con el mismo hook de siempre.
- Una demo con items que se pueden reordenar y agregar: probá con `key={index}` y con `key={item.id}` y explicá la diferencia (dejá el panel con un input adentro para verla).

## Accesibilidad y teclado

- Trigger: `<button aria-expanded aria-controls>` dentro de un heading (`<h3>`), según APG.
- Panel: `role="region"` con `aria-labelledby` al trigger, oculto con `hidden` cuando está cerrado.
- Opcional del patrón: ↑ ↓ Home End mueven el foco entre triggers.

## Criterios de aceptación

- [ ] `single`: abrir uno cierra el otro.
- [ ] `single` sin `collapsible`: click en el abierto no lo cierra; con `collapsible` sí.
- [ ] `multiple`: varios abiertos a la vez; `onValueChange` recibe un array nuevo (no mutado).
- [ ] `aria-expanded` y `hidden` siempre en sincronía.
- [ ] Con `key={index}`, reordenar deja el texto tipeado en el item equivocado; con `key={id}`, no. Tenés un test que lo demuestra.
- [ ] TypeScript rechaza `type="single"` con `defaultValue={['a']}`.

## Preguntas de entrevista

- ¿Qué es estado derivado y por qué no guardarlo en un `useState` aparte?
- ¿Qué hace React con las keys en la reconciliación? ¿Cuándo `key={index}` es aceptable?
- ¿Cómo usarías una key para resetear el estado de un componente a propósito?
- ¿Cómo animarías la altura de un panel que tiene contenido de alto desconocido? (grid-template-rows 0fr→1fr, medir con ref)

## Visual

Contenedor `surface` con borde `border` y `radius-lg`, divisores `border`. Trigger con padding `space-3`/`space-4`, texto `label`, indicador +/− en mono `text-muted`, hover `surface-muted`. Panel en `text-muted`.
