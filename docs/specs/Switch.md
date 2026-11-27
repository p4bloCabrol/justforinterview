# Switch

**English** · [Español](#español)

An on/off toggle that works on its own (uncontrolled) or driven from outside (controlled), using the pattern you'll later reuse in Tabs, Accordion and Combobox.

## The challenge

Writing a **controllable** component: one component, two possible owners of the state. The clean way out is your own `useControllableState` hook, and that hook is the real deliverable.

## Expected API

```ts
interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange' | 'value'> {
  checked?: boolean;                          // controlled
  defaultChecked?: boolean;                   // uncontrolled (default false)
  onCheckedChange?: (checked: boolean) => void;
  label: string;
}

function useControllableState<T>(opts: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T | ((prev: T) => T)) => void];
```

Naming note: the original table listed `value / defaultValue / onChange`. For a boolean, `checked / defaultChecked / onCheckedChange` is the better fit (like `<input type="checkbox">` and Radix), and it leaves `onChange` free so it doesn't clash with the native event. The generic hook does use `value / defaultValue / onChange`.

## Requirements

- Controlled = `checked !== undefined`. Decide it on the first render and warn in dev (`console.warn`) if the mode changes mid-lifetime, as React does with inputs.
- In controlled mode the component does **not** change on its own: it calls `onCheckedChange(!checked)` and waits.
- In uncontrolled mode it keeps internal state and also calls `onCheckedChange`.
- The hook's setter accepts an updater function, and in controlled mode resolves it against the current prop value.
- The hook's `onChange` must not fire if the value didn't change.

## Accessibility and keyboard

- `<button role="switch" aria-checked={checked}>`. Space and Enter toggle (free, since it's a button).
- An associated clickable label (`aria-labelledby` pointing to a `<span>` with an id, or `<label htmlFor>`); clicking the text also toggles.

## Acceptance criteria

- [ ] Uncontrolled: clicking toggles and `onCheckedChange` receives the new value.
- [ ] Controlled with a parent that ignores the callback: clicking doesn't change `aria-checked`.
- [ ] Controlled with a parent that does update: toggles normally.
- [ ] Going from `checked={true}` to `checked={undefined}` emits the warning in dev.
- [ ] `getByRole('switch', { name: 'Dark mode' })` works.
- [ ] `useControllableState` has its own tests, without the Switch.

## Interview questions

- Why not do `useState(props.checked)` and sync it with a `useEffect`? What bugs does that cause?
- How does the component know which mode it's in? Why lock it in on mount?
- Where do you keep `onChange` to avoid stale closures? (`useRef` + an effect, or `useEffectEvent`)
- Switch or checkbox? What semantic difference does the screen reader announce?

## Visual

Track 36×20 `radius-full`; off: `surface` with a `border-control` border and a `border-control` thumb; on: `accent` track, `accent-fg` thumb, shifted 16px over `duration-fast`.

---

<a id="español"></a>

# Switch — Español

Un interruptor on/off que funciona solo (no controlado) o manejado desde afuera (controlado), con el patrón que después vas a reusar en Tabs, Accordion y Combobox.

## La dificultad

Escribir un componente **controlable**: mismo componente, dos dueños posibles del estado. La salida limpia es un hook `useControllableState` propio, y ese hook es el verdadero entregable.

## API esperada

```ts
interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange' | 'value'> {
  checked?: boolean;                          // controlado
  defaultChecked?: boolean;                   // no controlado (default false)
  onCheckedChange?: (checked: boolean) => void;
  label: string;
}

function useControllableState<T>(opts: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T | ((prev: T) => T)) => void];
```

Nota de nombres: en la tabla original figuraba `value / defaultValue / onChange`. Para un booleano conviene `checked / defaultChecked / onCheckedChange` (como el `<input type="checkbox">` y Radix), y `onChange` queda libre para no chocar con el evento nativo. El hook genérico sí usa `value / defaultValue / onChange`.

## Requisitos

- Controlado = `checked !== undefined`. Decidilo en el primer render y avisá en dev (`console.warn`) si cambia de modo a mitad de vida, como hace React con los inputs.
- En modo controlado el componente **no** cambia solo: llama a `onCheckedChange(!checked)` y espera.
- En modo no controlado guarda el estado interno y también llama a `onCheckedChange`.
- El setter del hook acepta función updater, y en modo controlado la resuelve contra el valor actual de la prop.
- El `onChange` del hook no debe dispararse si el valor no cambió.

## Accesibilidad y teclado

- `<button role="switch" aria-checked={checked}>`. Espacio y Enter alternan (gratis por ser button).
- Label clickeable asociado (`aria-labelledby` a un `<span>` con id o `<label htmlFor>`); clic en el texto también alterna.

## Criterios de aceptación

- [ ] No controlado: click alterna y `onCheckedChange` recibe el nuevo valor.
- [ ] Controlado con un padre que ignora el callback: click no cambia `aria-checked`.
- [ ] Controlado con un padre que sí actualiza: alterna normalmente.
- [ ] Pasar de `checked={true}` a `checked={undefined}` emite el warning en dev.
- [ ] `getByRole('switch', { name: 'Modo oscuro' })` funciona.
- [ ] `useControllableState` tiene sus propios tests, sin el Switch.

## Preguntas de entrevista

- ¿Por qué no hacer `useState(props.checked)` y sincronizar con un `useEffect`? ¿Qué bugs trae?
- ¿Cómo sabe el componente en qué modo está? ¿Por qué fijarlo al montar?
- ¿Dónde guardás el `onChange` para no tener closures viejas? (`useRef` + efecto, o `useEffectEvent`)
- ¿Switch o checkbox? ¿Qué diferencia semántica anuncia el lector de pantalla?

## Visual

Track 36×20 `radius-full`; apagado: `surface` con borde `border-control` y thumb `border-control`; encendido: track `accent`, thumb `accent-fg`, desplazado 16px en `duration-fast`.
