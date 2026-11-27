# JustForInterviews DS

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
