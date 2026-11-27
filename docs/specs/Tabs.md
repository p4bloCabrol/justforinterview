# Tabs

**English** · [Español](#español)

Tabs as compound components (`<Tabs><Tabs.List><Tabs.Tab>` and `<Tabs.Panel>`) that share state through Context and are navigated with the arrow keys per the WAI-ARIA pattern.

## The challenge

Designing a compound API: the parent owns the state, the children read it through Context without prop drilling, and each Tab finds its Panel by `value`. Plus keyboard navigation with *roving tabindex*.

## Expected API

```tsx
<Tabs defaultValue="perfil" onValueChange={...}>   // or a controlled value
  <Tabs.List aria-label="Account">
    <Tabs.Tab value="perfil">Profile</Tabs.Tab>
    <Tabs.Tab value="seguridad">Security</Tabs.Tab>
    <Tabs.Tab value="pagos" disabled>Payments</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="perfil">…</Tabs.Panel>
  <Tabs.Panel value="seguridad">…</Tabs.Panel>
</Tabs>
```

```ts
interface TabsProps { value?: string; defaultValue?: string; onValueChange?: (v: string) => void;
  activationMode?: 'automatic' | 'manual'; // default 'automatic'
  children: React.ReactNode; }
```

## Requirements

- State via the Switch's `useControllableState` (reuse it, don't copy it).
- Context with a `useTabsContext()` hook that throws a clear error if used outside `<Tabs>`.
- Ids: `useId()` in `<Tabs>`, and from there `${base}-tab-${value}` / `${base}-panel-${value}` to cross-link `aria-controls` and `aria-labelledby`.
- Inactive Panels are not mounted (or are mounted with `hidden`: pick one and justify it).
- The keyboard order of the Tabs comes from the DOM, not from the order of the `value`s.
- `Tabs.Tab` etc. as typed static properties of the component.

## Accessibility and keyboard

- `role="tablist"`, `role="tab"` with `aria-selected` and `aria-controls`, `role="tabpanel"` with `aria-labelledby` and `tabIndex={0}`.
- Roving tabindex: only the selected tab has `tabIndex=0`, the rest have `-1`. Tab enters the list and then moves out to the panel.
- ← → move focus (with wrap), Home/End go to the ends, disabled tabs are skipped.
- `automatic`: moving focus activates the tab. `manual`: activation happens on Enter/Space.

## Acceptance criteria

- [ ] `<Tabs.Tab>` outside `<Tabs>` throws "Tabs.Tab must be used within <Tabs>".
- [ ] → from the last tab goes to the first; Home/End work; the disabled tab is skipped.
- [ ] In `manual` mode, the arrow keys move focus but don't change the panel until Enter.
- [ ] Only one element of the tablist is in the tab order.
- [ ] Each tab and its panel reference each other by id.
- [ ] Two `<Tabs>` on the same page don't share ids.

## Interview questions

- Compound components with Context vs. `React.Children.map` + `cloneElement`? What breaks with the latter if you wrap a Tab in another component?
- How do you avoid re-rendering every consumer when the value changes? (`useMemo` on the Context value, splitting contexts)
- What is roving tabindex, and why not `aria-activedescendant` here?
- How do the Tabs register their order? (DOM refs, `querySelectorAll('[role=tab]')`, or a registry with indices)

## Visual

Tablist with a `border` bottom border. Tab 36px, `label` text in `text-muted`; selected in `text` with a 2px `accent` indicator over the border. Panel with `space-4` vertical padding.

---

<a id="español"></a>

# Tabs — Español

Pestañas como compound components (`<Tabs><Tabs.List><Tabs.Tab>` y `<Tabs.Panel>`) que comparten estado por Context y se navegan con flechas según el patrón WAI-ARIA.

## La dificultad

Diseñar una API compuesta: el padre tiene el estado, los hijos lo leen por Context sin prop drilling, y cada Tab encuentra su Panel por `value`. Más la navegación con teclado con *roving tabindex*.

## API esperada

```tsx
<Tabs defaultValue="perfil" onValueChange={...}>   // o value controlado
  <Tabs.List aria-label="Cuenta">
    <Tabs.Tab value="perfil">Perfil</Tabs.Tab>
    <Tabs.Tab value="seguridad">Seguridad</Tabs.Tab>
    <Tabs.Tab value="pagos" disabled>Pagos</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="perfil">…</Tabs.Panel>
  <Tabs.Panel value="seguridad">…</Tabs.Panel>
</Tabs>
```

```ts
interface TabsProps { value?: string; defaultValue?: string; onValueChange?: (v: string) => void;
  activationMode?: 'automatic' | 'manual'; // default 'automatic'
  children: React.ReactNode; }
```

## Requisitos

- Estado con el `useControllableState` del Switch (reusalo, no lo copies).
- Context con un hook `useTabsContext()` que tira un error claro si se usa fuera de `<Tabs>`.
- Ids: `useId()` en `<Tabs>`, y de ahí `${base}-tab-${value}` / `${base}-panel-${value}` para cruzar `aria-controls` y `aria-labelledby`.
- Los Panels inactivos no se montan (o se montan con `hidden`: elegí y justificá).
- El orden de las Tabs para el teclado sale del DOM, no del orden de los `value`.
- `Tabs.Tab` etc. como propiedades estáticas del componente, tipadas.

## Accesibilidad y teclado

- `role="tablist"`, `role="tab"` con `aria-selected` y `aria-controls`, `role="tabpanel"` con `aria-labelledby` y `tabIndex={0}`.
- Roving tabindex: sólo la tab seleccionada tiene `tabIndex=0`, las demás `-1`. Tab entra a la lista y sale al panel.
- ← → mueven el foco (con wrap), Home/End van a los extremos, se saltean las deshabilitadas.
- `automatic`: mover el foco activa la tab. `manual`: activa con Enter/Espacio.

## Criterios de aceptación

- [ ] `<Tabs.Tab>` fuera de `<Tabs>` tira "Tabs.Tab must be used within <Tabs>".
- [ ] → desde la última va a la primera; Home/End funcionan; la deshabilitada se saltea.
- [ ] En modo `manual`, las flechas mueven el foco pero no cambian el panel hasta Enter.
- [ ] Un sólo elemento de la tablist está en el orden de tabulación.
- [ ] Cada tab y su panel se referencian mutuamente por id.
- [ ] Dos `<Tabs>` en la misma página no comparten ids.

## Preguntas de entrevista

- ¿Compound components con Context vs. `React.Children.map` + `cloneElement`? ¿Qué se rompe con el segundo si envolvés una Tab en otro componente?
- ¿Cómo evitás re-renders de todos los consumidores cuando cambia el valor? (`useMemo` del value del Context, separar contextos)
- ¿Qué es roving tabindex y por qué no `aria-activedescendant` acá?
- ¿Cómo registran las Tabs su orden? (refs en el DOM, `querySelectorAll('[role=tab]')`, o un registro con índices)

## Visual

Tablist con borde inferior `border`. Tab 36px, texto `label` `text-muted`; seleccionada en `text` con indicador de 2px `accent` sobre el borde. Panel con padding vertical `space-4`.
