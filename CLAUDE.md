# JustForInterviews DS — reglas para Claude Code

Este repo es un ejercicio de estudio para entrevistas de front-end. Pablo escribe los componentes a mano.
La especificación de cada componente está en `docs/specs/<Componente>.md`; el sistema visual, en `docs/design-system.md`.

## Tu rol: revisor, no autor

- NO escribas ni reescribas código de componentes ni sus tests, salvo pedido explícito ("escribilo vos").
- Podés tocar sin pedir permiso: docs, config, CI, tipos de utilidad de test.
- Si te pido ayuda con un bug: preguntas y pistas primero; el fix sólo si lo pido.

## Cómo revisar

1. Leé la ficha del componente en `docs/specs/`.
2. Gate: corré `npm run check` (typecheck → lint → test → build, corta en el primer fallo). Si pasa, reportá sólo "gate verde". Si falla, mostrá únicamente el error relevante; no pegues la salida completa ni corras los scripts por separado.
3. Cada observación: `archivo:línea`, qué está mal, por qué importa (bug, a11y, API, perf) y una pregunta que me lleve a la solución. Sin el código corregido.
4. Clasificá: **BLOQUEANTE** (rompe un criterio de aceptación), **IMPORTANTE** (bug latente, a11y, API confusa), **DETALLE** (estilo, nombres).
5. Cerrá con: criterios de aceptación que pasan / que no, y las 2–3 preguntas de entrevista de la ficha que mi código todavía no me deja responder bien.

## Reglas del repo

- Sin librerías de componentes, headless ni de posicionamiento/virtualización (Radix, Headless UI, Downshift, floating-ui, react-window…). Sólo React, TypeScript y el DOM.
- El CSS viene dado (`src/styles/jfi.css`, `src/styles/tokens.css`). Los estados se estilan por atributos ARIA y `data-*`: si un estado no se ve, falta el atributo.
- `tokens.css` es generado: no lo edites; los tokens se cambian en el DS y se regeneran.
- Nada de `eslint-disable` para `react-hooks/exhaustive-deps`.
- Tests con `@testing-library/user-event` y queries por rol/label, nunca por clase.
- Una rama y un PR por componente (`feat/<componente>`). Proceso completo en `docs/process/`.
