# Switch

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
