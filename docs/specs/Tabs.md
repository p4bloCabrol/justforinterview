# Tabs

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
