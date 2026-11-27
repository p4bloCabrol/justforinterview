# TextField

**English** · [Español](#español)

A text field with a label, help text and an error, that works controlled or uncontrolled and wires everything together through ids generated with `useId`.

## The challenge

Really understanding controlled vs. uncontrolled (who owns the value), and wiring up accessibility: an associated label, and a description and error announced by the screen reader.

## Expected API

```ts
interface TextFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  label: string;              // required: no field without a label
  hideLabel?: boolean;        // label visually hidden but still accessible
  description?: string;       // helper text
  error?: string;             // if present, the field is invalid
  // value / defaultValue / onChange: the input's native ones
}
// ref → the <input>
```

## Requirements

- `id`: if the consumer passes one, use it; otherwise `useId()`. From that id you derive `${id}-description` and `${id}-error`.
- Always `<label htmlFor={id}>`. `hideLabel` hides it with a *visually-hidden* class, never with `display:none`.
- `aria-describedby` combines the description and the error (whichever exist, space-separated).
- With `error`: `aria-invalid="true"` on the input and the message in `.jfi-error`.
- `required` shows the `.jfi-required` asterisk (with `aria-hidden`: the native `required` already announces it).
- Controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) both work without warnings. Don't copy `value` into an internal `useState`.

## Accessibility and keyboard

- `getByLabelText('Email')` finds the input.
- The error is announced when it appears: consider whether `aria-describedby` is enough or a live region is needed, and justify it.

## Acceptance criteria

- [ ] Two TextFields on the same page get different ids without passing `id`.
- [ ] `getByRole('textbox', { name: 'Email' })` works, including with `hideLabel`.
- [ ] With `description` and `error`, `aria-describedby` contains both ids and both elements exist.
- [ ] Controlled mode: if the parent ignores `onChange`, the value doesn't change when typing.
- [ ] Uncontrolled mode: typing works and `ref.current.value` reflects it.
- [ ] The "changing an uncontrolled input to be controlled" warning doesn't appear in any test.
- [ ] axe reports no violations with an error visible.

## Interview questions

- What does it mean for an input to be controlled? What happens if you pass `value` without `onChange`?
- Why `useId` and not `Math.random()` or a global counter? (SSR and hydration)
- When do you prefer uncontrolled? (large forms, `FormData`, react-hook-form)
- Why does the controlled-to-uncontrolled warning appear when `value` becomes `undefined`?
- `aria-describedby` vs. `aria-errormessage`?

## Visual

Label in `label` style, `space-1` gap. Input 32px, `radius-sm`, `border-control` border, `surface` background, `text-subtle` placeholder. Invalid: `danger` border. Help text in `caption` `text-muted`; error in `caption` `danger`.

---

<a id="español"></a>

# TextField — Español

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
