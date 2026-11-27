# JustForInterviews DS

Un sistema de diseño de diez componentes React hechos a mano, uno por vez, cada uno elegido por la dificultad que te obliga a resolver. No es una librería para producción: es un gimnasio. Cada componente tiene una ficha (API esperada, requisitos, accesibilidad, criterios de aceptación y preguntas de entrevista) y un mock visual del objetivo. El código lo escribís vos; Claude Code lo revisa contra la ficha.

## Cómo se usa

1. **Repo propio en GitHub, trabajo en VS Code.** Este DS es la especificación; el código vive en tu repo.
2. **De a un componente.** No arrancás el siguiente hasta que el actual pasa todos sus criterios de aceptación y entendiste cada observación de la revisión.
3. **Sin librerías de componentes ni headless** (nada de Radix, Headless UI, Downshift, react-window, floating-ui). React, TypeScript y el DOM. Esa es la gracia.
4. **El CSS viene dado.** `src/styles/jfi.css` tiene los estilos de referencia y `src/styles/tokens.css` los tokens. Los estados se estilan por atributos ARIA (`aria-checked`, `aria-selected`, `aria-expanded`, `aria-invalid`) y `data-*`: si un estado no se ve, casi seguro falta el atributo. Es una pista deliberada.
5. **Tests primero o al final, pero tests.** Cada criterio de aceptación se puede escribir como un test de Testing Library. Si no lo podés testear, todavía no está resuelto.

### Stack sugerido del repo

| Pieza | Elección | Por qué |
| --- | --- | --- |
| Build | Vite + React 18/19 + TypeScript `strict` | Rápido, sin magia |
| Tests | Vitest + @testing-library/react + @testing-library/user-event | `user-event` simula teclado de verdad, que es la mitad del trabajo |
| A11y | `axe-core` con el helper `src/test/axe.ts` | Un `expect(await axeViolations(container)).toEqual([])` por componente |
| Demo | Una página por componente en `src/demo/` | Para probar a mano con teclado y lector de pantalla |
| Lint | ESLint con `eslint-plugin-react-hooks` y `jsx-a11y` | `exhaustive-deps` te va a marcar varios de los bugs que estos ejercicios buscan |

Estructura: `src/components/<Componente>/{<Componente>.tsx, <Componente>.test.tsx, index.ts}`. Una rama y un PR por componente: el PR es la unidad de revisión.

### La revisión con Claude Code

Ver la sección **Revisión**: tiene el prompt para pedir la review y la rúbrica. Regla de oro: Claude Code revisa y explica, no reescribe. Si corrige código, el ejercicio se pierde.

## Fundamentos visuales: Mono técnico

Gris neutro, un solo acento casi negro, tipografía Inter para UI y JetBrains Mono para código. Bordes finos, radios chicos, cero gradientes. El color no decora: informa.

- **Un acento.** `accent` (#171717 en claro, #fafafa en oscuro) marca lo activo: botón primario, switch encendido, tab seleccionada, opción elegida. No hay segundo color de marca.
- **El azul es foco.** `focus` es el único azul del sistema y sólo aparece como anillo de `:focus-visible` (2px, offset 2px). Si ves azul, hay foco; si navegás con Tab y no ves azul, hay un bug.
- **Dos bordes, dos trabajos.** `border` separa (cards, divisores, listas). `border-control` delimita algo con lo que se interactúa (inputs, switch apagado) y llega a 3:1. No los mezcles.
- **Texto en tres niveles.** `text` principal, `text-muted` secundario, `text-subtle` sólo para placeholders y metadatos. Los tres pasan 4.5:1 en ambos temas.
- **Superficies flotantes con sombra, no con borde grueso.** `shadow-popover` para listbox, toast y tooltip; `shadow-modal` para el modal. El tooltip invierte el tema (`tooltip-bg`).
- **Capas.** `z-popover` < `z-modal` < `z-toast` < `z-tooltip`. Un toast se ve por encima de un modal abierto; un tooltip por encima de todo.

### Grilla y medidas

Todo en múltiplos de 4px: `space-1` (4) a `space-8` (32). Controles de 32px de alto (28 en `sm`, 40 en `lg`). Radios: `radius-sm` (4) en controles, `radius-md` (6) en popovers y toasts, `radius-lg` (8) en modal y cards, `radius-full` sólo en el switch.

### Movimiento

`duration-fast` (120ms) para hover y cambios de estado, `duration-base` (200ms) para entradas y aperturas. Respetá `prefers-reduced-motion`: si está activo, sin transiciones de posición.

## Contenido y tono

Español rioplatense en la demo, inglés en las APIs (nombres de props, eventos). Labels cortos y en infinitivo o sustantivo: "Guardar", "Cancelar", "Email". Errores que dicen qué pasó y cómo arreglarlo: "Ingresá un email válido", no "Campo inválido". Nada de signos de exclamación.

## Los diez componentes

| # | Componente | La dificultad que te obliga a resolver |
| --- | --- | --- |
| 1 | Button | Props tipadas, pasar props nativas con `...rest` y refs hacia el elemento real |
| 2 | TextField | Controlado vs. no controlado, `useId` y accesibilidad de labels y errores |
| 3 | Switch | Componente "controlable": que funcione solo o controlado desde afuera (`checked` / `defaultChecked` / `onCheckedChange`) |
| 4 | Tabs | Compound components con Context (`<Tabs><Tabs.List><Tabs.Tab>`) y navegación con teclado |
| 5 | Accordion | Keys, estado derivado y modo "uno abierto" vs. "varios abiertos" |
| 6 | Modal | Portals, `useEffect` con cleanup, foco atrapado y bloqueo del scroll |
| 7 | Tooltip | Medir y posicionar con refs (`useLayoutEffect`) y timers de entrada y salida |
| 8 | Toast | Estado global con un provider, cola de mensajes con `useReducer` y timers con stale closures |
| 9 | Combobox | Headless de verdad: toda la lógica en un custom hook, teclado, ARIA y filtrado |
| 10 | VirtualList | Ventana de render sobre miles de filas: medir, calcular el rango visible, overscan y scroll estable |

El orden importa: cada uno reutiliza algo del anterior. El Switch usa el patrón de controlable que vas a necesitar en Tabs, Accordion y Combobox; el Modal usa el portal que reusa el Toast; el Tooltip mide como el Combobox posiciona; la VirtualList cierra con performance pura.
