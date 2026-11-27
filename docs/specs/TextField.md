# TextField

Un campo de texto con label, texto de ayuda y error, que funciona controlado o no controlado y conecta todo por ids generados con `useId`.

## La dificultad

Entender de verdad controlado vs. no controlado (quién es dueño del valor), y cablear la accesibilidad: label asociado, descripción y error anunciados por el lector de pantalla.

## API esperada

```ts
interface TextFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  label: string;              // obligatorio: no hay campo sin label
  hideLabel?: boolean;        // label visualmente oculto pero accesible
  description?: string;       // helper text
  error?: string;             // si existe, el campo es inválido
  // value / defaultValue / onChange: los nativos del input
}
// ref → el <input>
```

## Requisitos

- `id`: si el consumidor pasa uno, se usa; si no, `useId()`. Desde ese id derivás `${id}-description` y `${id}-error`.
- `<label htmlFor={id}>` siempre. `hideLabel` lo oculta con una clase *visually-hidden*, nunca con `display:none`.
- `aria-describedby` junta descripción y error (los que existan, separados por espacio).
- Con `error`: `aria-invalid="true"` en el input y el mensaje en `.jfi-error`.
- `required` muestra el asterisco `.jfi-required` (con `aria-hidden`: el `required` nativo ya lo anuncia).
- Controlado (`value` + `onChange`) y no controlado (`defaultValue`) funcionan sin warnings. No copies `value` a un `useState` interno.

## Accesibilidad y teclado

- `getByLabelText('Email')` encuentra el input.
- El error se anuncia al aparecer: pensá si alcanza con `aria-describedby` o hace falta una live region, y justificá.

## Criterios de aceptación

- [ ] Dos TextField en la misma página tienen ids distintos sin pasar `id`.
- [ ] `getByRole('textbox', { name: 'Email' })` funciona, también con `hideLabel`.
- [ ] Con `description` y `error`, `aria-describedby` contiene ambos ids y ambos elementos existen.
- [ ] Modo controlado: si el padre ignora el `onChange`, el valor no cambia al tipear.
- [ ] Modo no controlado: tipear funciona y `ref.current.value` lo refleja.
- [ ] No aparece el warning "changing an uncontrolled input to be controlled" en ningún test.
- [ ] axe sin violaciones con error visible.

## Preguntas de entrevista

- ¿Qué significa que un input sea controlado? ¿Qué pasa si pasás `value` sin `onChange`?
- ¿Por qué `useId` y no `Math.random()` o un contador global? (SSR e hidratación)
- ¿Cuándo preferís no controlado? (forms grandes, `FormData`, react-hook-form)
- ¿Por qué el warning de controlado a no controlado aparece cuando `value` pasa a `undefined`?
- ¿`aria-describedby` vs. `aria-errormessage`?

## Visual

Label estilo `label`, gap `space-1`. Input 32px, `radius-sm`, borde `border-control`, fondo `surface`, placeholder `text-subtle`. Inválido: borde `danger`. Ayuda en `caption` `text-muted`; error en `caption` `danger`.
