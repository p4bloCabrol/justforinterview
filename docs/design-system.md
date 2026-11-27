# JustForInterviews DS

**English** · [Español](#español)

A design system of ten React components built by hand, one at a time, each chosen for the specific problem it forces you to solve. It is not a production library: it is a gym. Each component has a spec sheet (expected API, requirements, accessibility, acceptance criteria, and interview questions) and a visual mock of the target. You write the code; Claude Code reviews it against the spec.

## How to use it

1. **Your own GitHub repo, working in VS Code.** This DS is the specification; the code lives in your repo.
2. **One component at a time.** You don't start the next one until the current one passes all its acceptance criteria and you understand every review comment.
3. **No component or headless libraries** (no Radix, Headless UI, Downshift, react-window, floating-ui). React, TypeScript, and the DOM. That's the whole point.
4. **The CSS is provided.** `src/styles/jfi.css` holds the reference styles and `src/styles/tokens.css` the tokens. States are styled through ARIA attributes (`aria-checked`, `aria-selected`, `aria-expanded`, `aria-invalid`) and `data-*`: if a state doesn't show up, the attribute is almost certainly missing. That's a deliberate hint.
5. **Tests first or tests last, but tests.** Every acceptance criterion can be written as a Testing Library test. If you can't test it, it isn't solved yet.

### Suggested repo stack

| Piece | Choice | Why |
| --- | --- | --- |
| Build | Vite + React 18/19 + TypeScript `strict` | Fast, no magic |
| Tests | Vitest + @testing-library/react + @testing-library/user-event | `user-event` simulates real keyboard interaction, which is half the work |
| A11y | `axe-core` with the `src/test/axe.ts` helper | One `expect(await axeViolations(container)).toEqual([])` per component |
| Demo | One page per component in `src/demo/` | For testing by hand with a keyboard and a screen reader |
| Lint | ESLint with `eslint-plugin-react-hooks` and `jsx-a11y` | `exhaustive-deps` will flag several of the bugs these exercises are designed to surface |

Structure: `src/components/<Component>/{<Component>.tsx, <Component>.test.tsx, index.ts}`. One branch and one PR per component: the PR is the unit of review.

### Reviewing with Claude Code

See the **Review** section: it has the prompt for requesting a review and the rubric. Golden rule: Claude Code reviews and explains; it doesn't rewrite. If it fixes the code for you, the exercise is lost.

## Visual foundations: Technical Mono

Neutral gray, a single near-black accent, Inter for UI text and JetBrains Mono for code. Thin borders, small radii, zero gradients. Color doesn't decorate: it informs.

- **One accent.** `accent` (#171717 in light, #fafafa in dark) marks what's active: primary button, switch on, selected tab, chosen option. There is no second brand color.
- **Blue means focus.** `focus` is the only blue in the system and appears only as the `:focus-visible` ring (2px, 2px offset). If you see blue, something has focus; if you Tab through the page and see no blue, there's a bug.
- **Two borders, two jobs.** `border` separates (cards, dividers, lists). `border-control` outlines something you interact with (inputs, switch off) and reaches 3:1. Don't mix them up.
- **Three levels of text.** `text` for primary, `text-muted` for secondary, `text-subtle` only for placeholders and metadata. All three meet 4.5:1 in both themes.
- **Floating surfaces use shadow, not heavy borders.** `shadow-popover` for listbox, toast, and tooltip; `shadow-modal` for the modal. The tooltip inverts the theme (`tooltip-bg`).
- **Layers.** `z-popover` < `z-modal` < `z-toast` < `z-tooltip`. A toast shows above an open modal; a tooltip shows above everything.

### Grid and sizing

Everything in multiples of 4px: `space-1` (4) to `space-8` (32). Controls are 32px tall (28 in `sm`, 40 in `lg`). Radii: `radius-sm` (4) on controls, `radius-md` (6) on popovers and toasts, `radius-lg` (8) on the modal and cards, `radius-full` only on the switch.

### Motion

`duration-fast` (120ms) for hover and state changes, `duration-base` (200ms) for entrances and openings. Respect `prefers-reduced-motion`: when it's on, no position transitions.

## Content and tone

Rioplatense Spanish in the demo, English in the APIs (prop names, events). Short labels, as an infinitive or a noun: "Guardar" (Save), "Cancelar" (Cancel), "Email". Error messages that say what happened and how to fix it: "Ingresá un email válido" (Enter a valid email), not "Campo inválido" (Invalid field). No exclamation marks.

## The ten components

| # | Component | The challenge it forces you to solve |
| --- | --- | --- |
| 1 | Button | Typed props, passing native props through with `...rest`, and refs to the underlying element |
| 2 | TextField | Controlled vs. uncontrolled, `useId`, and accessible labels and errors |
| 3 | Switch | A "controllable" component: works on its own or controlled from outside (`checked` / `defaultChecked` / `onCheckedChange`) |
| 4 | Tabs | Compound components with Context (`<Tabs><Tabs.List><Tabs.Tab>`) and keyboard navigation |
| 5 | Accordion | Keys, derived state, and "single open" vs. "multiple open" modes |
| 6 | Modal | Portals, `useEffect` with cleanup, focus trapping, and scroll locking |
| 7 | Tooltip | Measuring and positioning with refs (`useLayoutEffect`) and enter/leave timers |
| 8 | Toast | Global state through a provider, a message queue with `useReducer`, and timers with stale closures |
| 9 | Combobox | Truly headless: all the logic in a custom hook, keyboard, ARIA, and filtering |
| 10 | VirtualList | A render window over thousands of rows: measuring, computing the visible range, overscan, and stable scrolling |

Order matters: each one reuses something from the previous ones. The Switch uses the controllable pattern you'll need in Tabs, Accordion, and Combobox; the Modal uses the portal the Toast reuses; the Tooltip measures the way the Combobox positions; the VirtualList closes with pure performance.

---

<a id="español"></a>

# JustForInterviews DS — Español

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
