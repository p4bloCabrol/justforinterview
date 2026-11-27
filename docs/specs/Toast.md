# Toast

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
