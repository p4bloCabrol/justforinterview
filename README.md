# JustForInterviews DS

**English** · [Español](#español)

Ten React components built by hand, one at a time, each chosen for the specific problem it forces you to solve. A practice gym for front-end interviews, with a documented engineering process and code review by Claude Code.

| # | Component | The challenge |
| --- | --- | --- |
| 1 | Button | Typed props, `...rest`, and refs to the underlying element |
| 2 | TextField | Controlled vs. uncontrolled, `useId`, accessible labels and errors |
| 3 | Switch | Controllable component and `useControllableState` |
| 4 | Tabs | Compound components with Context and keyboard support |
| 5 | Accordion | Keys, derived state, single vs. multiple open |
| 6 | Modal | Portals, cleanup, focus trap, scroll lock |
| 7 | Tooltip | Measuring and positioning with `useLayoutEffect`, timers |
| 8 | Toast | Global provider, queue with `useReducer`, stale closures |
| 9 | Combobox | Headless logic in a custom hook, ARIA and keyboard |
| 10 | VirtualList | Render window, overscan, stable scrolling |

## Running it

```bash
npm install
npm run dev        # demo
npm test           # tests
npm run lint
npm run typecheck
```

## Where things live

- `docs/specs/` — the spec sheet for each component (API, requirements, a11y, acceptance criteria, interview questions)
- `docs/design-system.md` — visual foundations and tokens
- `docs/process/` — review, Definition of Done, testing, process and assistant
- `docs/adr/` — architecture decisions
- `CLAUDE.md` — rules for the reviewer agent

---

<a id="español"></a>

# JustForInterviews DS — Español

Diez componentes React hechos a mano, uno por vez, cada uno elegido por la dificultad que obliga a resolver. Un gimnasio para entrevistas de front-end, con el proceso de ingeniería documentado y revisión con Claude Code.

| # | Componente | La dificultad |
| --- | --- | --- |
| 1 | Button | Props tipadas, `...rest` y refs al elemento real |
| 2 | TextField | Controlado vs. no controlado, `useId`, labels y errores accesibles |
| 3 | Switch | Componente controlable y `useControllableState` |
| 4 | Tabs | Compound components con Context y teclado |
| 5 | Accordion | Keys, estado derivado, uno vs. varios abiertos |
| 6 | Modal | Portals, cleanup, focus trap, scroll lock |
| 7 | Tooltip | Medir y posicionar con `useLayoutEffect`, timers |
| 8 | Toast | Provider global, cola con `useReducer`, stale closures |
| 9 | Combobox | Headless en un custom hook, ARIA y teclado |
| 10 | VirtualList | Ventana de render, overscan, scroll estable |

## Correr

```bash
npm install
npm run dev        # demo
npm test           # tests
npm run lint
npm run typecheck
```

## Dónde está cada cosa

- `docs/specs/` — la ficha de cada componente (API, requisitos, a11y, criterios de aceptación, preguntas de entrevista)
- `docs/design-system.md` — fundamentos visuales y tokens
- `docs/process/` — revisión, Definition of Done, testing, proceso y asistente
- `docs/adr/` — decisiones de arquitectura
- `CLAUDE.md` — reglas para el agente revisor
