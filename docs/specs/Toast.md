# Toast

**English** · [Español](#español)

Ephemeral notifications triggered from anywhere in the app via a hook, managed by a provider with a `useReducer` queue, with auto-dismiss that pauses on hover.

## The challenge

Global state without a library (provider + Context), a queue modeled as a reducer, and timers that read stale state: the classic stale closure.

## Expected API

```tsx
<ToastProvider max={3} duration={5000}>
  <App />
</ToastProvider>

const toast = useToast();
const id = toast.show({ title: 'Saved', description: 'Your changes were applied.', tone: 'success' });
toast.dismiss(id);
```

```ts
type ToastTone = 'neutral' | 'success' | 'error';
interface ToastOptions { title: string; description?: string; tone?: ToastTone; duration?: number /* ms, Infinity = never closes */ }

type ToastAction =
  | { type: 'ADD'; toast: Toast }
  | { type: 'DISMISS'; id: string }
  | { type: 'PAUSE'; id: string }
  | { type: 'RESUME'; id: string };
```

## Requirements

- A pure reducer, tested without React: adds, removes, respects `max` (toasts over the limit wait **in a queue** and come in when a slot frees up; they are not discarded).
- `useToast()` outside the provider throws a clear error.
- The object returned by `useToast` is stable across renders (same reference): a `useEffect(() => …, [toast])` must not fire in a loop.
- Each toast has its own timer. **Hover pauses** it, and on leave it **resumes with the remaining time**, rather than restarting. Think about where you store the remaining time, and why a `setTimeout` that closes over its render's state is the trap.
- Dismissing manually cancels its timer.
- The region lives in a portal, at `z-toast`, above an open modal.

## Accessibility and keyboard

- The region is a live region: `role="status"` with `aria-live="polite"` for neutral/success; error toasts use `role="alert"` (assertive). Mount the region once, empty: if you mount the live region together with the message, many screen readers won't announce it.
- Close button with `aria-label="Close notification"`.
- Bonus: F8 moves focus to the region; focus inside also pauses.

## Acceptance criteria

- [ ] With `max={3}` and 5 `show()` calls: 3 are visible; closing one brings in the 4th.
- [ ] With fake timers: it closes after `duration` ms.
- [ ] Hover at 3s of 5s, wait 10s, leave: it closes 2s later.
- [ ] The `toast` from `useToast()` keeps the same reference across renders.
- [ ] The reducer has unit tests with no rendering.
- [ ] An `error` toast is inside an element with `role="alert"`.

## Interview questions

- What is a stale closure? Show the bug with `setTimeout` and `useState`, and two ways to fix it.
- Why `useReducer` here and not several `useState`s?
- Context for global state: when is it enough, and when does it lead to app-wide re-renders? How do you split dispatch from state?
- How would you make `toast.show()` callable outside React (from a services module)? (external store + `useSyncExternalStore`)

## Visual

Region at the bottom right, 320px, `space-2` gap. Toast `surface`, `radius-md`, `shadow-popover`, `space-3`/`space-4` padding. Title in `label` with a status dot (`success`, `danger` or `text-muted`), description in `caption` `text-muted`.

---

<a id="español"></a>

# Toast — Español

Notificaciones efímeras disparadas desde cualquier parte de la app con un hook, manejadas por un provider con una cola en `useReducer`, con auto-cierre que se pausa en hover.

## La dificultad

Estado global sin librería (provider + Context), una cola modelada como reducer, y timers que leen estado viejo: el clásico stale closure.

## API esperada

```tsx
<ToastProvider max={3} duration={5000}>
  <App />
</ToastProvider>

const toast = useToast();
const id = toast.show({ title: 'Guardado', description: 'Los cambios se aplicaron.', tone: 'success' });
toast.dismiss(id);
```

```ts
type ToastTone = 'neutral' | 'success' | 'error';
interface ToastOptions { title: string; description?: string; tone?: ToastTone; duration?: number /* ms, Infinity = no se cierra */ }

type ToastAction =
  | { type: 'ADD'; toast: Toast }
  | { type: 'DISMISS'; id: string }
  | { type: 'PAUSE'; id: string }
  | { type: 'RESUME'; id: string };
```

## Requisitos

- Reducer puro y testeado sin React: agrega, quita, respeta `max` (los que exceden quedan **en cola** y entran cuando se libera lugar, no se descartan).
- `useToast()` fuera del provider tira un error claro.
- El objeto que devuelve `useToast` es estable entre renders (referencia igual): que un `useEffect(() => …, [toast])` no se dispare en loop.
- Cada toast tiene su timer. **Hover pausa** y al salir **retoma con el tiempo restante**, no reinicia. Pensá dónde guardás el tiempo restante y por qué un `setTimeout` que cierra sobre el estado de su render es la trampa.
- Cerrar a mano cancela su timer.
- Región en portal, en `z-toast`, por encima de un modal abierto.

## Accesibilidad y teclado

- La región es una live region: `role="status"` con `aria-live="polite"` para neutral/success; los de error, `role="alert"` (assertive). Montá la región una vez y vacía: si montás la live region junto con el mensaje, muchos lectores no lo anuncian.
- Botón de cerrar con `aria-label="Cerrar notificación"`.
- Bonus: F8 lleva el foco a la región; foco dentro también pausa.

## Criterios de aceptación

- [ ] Con `max={3}` y 5 `show()`: se ven 3; al cerrar uno entra el 4.º.
- [ ] Con fake timers: se cierra a los `duration` ms.
- [ ] Hover a los 3s de 5s, esperar 10s, salir: se cierra 2s después.
- [ ] `toast` de `useToast()` mantiene la misma referencia entre renders.
- [ ] El reducer tiene tests unitarios sin render.
- [ ] Un toast `error` está en un elemento con `role="alert"`.

## Preguntas de entrevista

- ¿Qué es un stale closure? Mostrá el bug con `setTimeout` y `useState` y dos formas de arreglarlo.
- ¿Por qué `useReducer` acá y no varios `useState`?
- ¿Context para estado global: cuándo alcanza y cuándo te lleva a re-renders de toda la app? ¿Cómo separás el dispatch del estado?
- ¿Cómo harías `toast.show()` llamable fuera de React (un módulo de servicios)? (store externo + `useSyncExternalStore`)

## Visual

Región abajo a la derecha, 320px, gap `space-2`. Toast `surface`, `radius-md`, `shadow-popover`, padding `space-3`/`space-4`. Título `label` con punto de estado (`success`, `danger` o `text-muted`), descripción `caption` `text-muted`.
