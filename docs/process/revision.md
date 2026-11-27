# Review

**English** · [Español](#español)

How to ask Claude Code for a review, and with what rubric. The idea is for it to point out problems and ask you questions, not to rewrite the component for you.

## Suggested CLAUDE.md for the repo

Paste it at the root of the repo. It sets the agent's role for every session.

```md
# JustForInterviews DS — rules for Claude Code

This repo is a study exercise. Pablo writes the components by hand.

- Your role is REVIEWER. Don't write or rewrite component code unless I explicitly ask you to.
- Review against the component's spec (I paste it in the request, or it's in docs/specs/<Component>.md).
- Each comment: file:line, what's wrong, why it matters (bug, a11y, API, perf), and a question that leads me to the solution. No fix.
- Classify: BLOCKER (breaks an acceptance criterion), IMPORTANT (latent bug, a11y, confusing API), NIT (style, naming).
- Run `npm test` and `npm run lint` before giving an opinion, and report the result.
- At the end: which acceptance criteria pass and which don't, and the 2–3 interview questions from the spec that my code still doesn't let me answer well.
- Don't suggest external libraries (Radix, floating-ui, react-window, etc.).
```

Tip: copy this DS's spec sheets into `docs/specs/` in the repo so Claude Code reads them without you having to paste them.

## Per-PR review prompt

```text
Review the <Component> PR against docs/specs/<Component>.md.
Follow the rules in CLAUDE.md: don't give me the corrected code.
Also: look specifically for <the challenge from the spec>, for example
"stale closures in the timers" or "what happens if the parent changes `value` to undefined".
```

## Rubric

| Axis | What's evaluated |
| --- | --- |
| API | Typed props, names consistent with the rest of the DS, `...rest` and `ref` where appropriate, sensible defaults |
| State | A single source of truth; no duplicated state synced through effects; derive during render when possible |
| Effects | Every `useEffect` has a cleanup if it subscribes, schedules, or mutates the DOM; honest dependencies (no `eslint-disable`) |
| Accessibility | Role and ARIA attributes from the WAI-ARIA APG pattern, full keyboard support, visible and managed focus, axe green |
| Tests | Every acceptance criterion has its test; tested with `user-event` and role queries, not class queries |
| Explanation | You can explain every decision out loud, as in an interview |

## A component's workflow

1. Read the spec and write the API (types) before the body.
2. Write the tests for the acceptance criteria (they fail).
3. Implement until they pass.
4. Test by hand with the keyboard only (and with VoiceOver or NVDA if you can).
5. Open the PR, request the review, address it, and answer the interview questions in writing in the PR description.
6. Merge. Only then, the next one.

---

<a id="español"></a>

# Revisión — Español

Cómo pedirle la review a Claude Code y con qué rúbrica. La idea es que te marque problemas y te haga preguntas, no que te reescriba el componente.

## CLAUDE.md sugerido para el repo

Pegalo en la raíz del repo. Fija el rol del agente para todas las sesiones.

```md
# JustForInterviews DS — reglas para Claude Code

Este repo es un ejercicio de estudio. Pablo escribe los componentes a mano.

- Tu rol es REVISOR. No escribas ni reescribas código de componentes salvo que te lo pida explícitamente.
- Revisá contra la ficha del componente (la pego en el pedido o está en docs/specs/<Componente>.md).
- Cada observación: archivo:línea, qué está mal, por qué importa (bug, a11y, API, perf), y una pregunta que me lleve a la solución. Sin el fix.
- Clasificá: BLOQUEANTE (rompe un criterio de aceptación), IMPORTANTE (bug latente, a11y, API confusa), DETALLE (estilo, nombres).
- Corré `npm test` y `npm run lint` antes de opinar y reportá el resultado.
- Al final: qué criterios de aceptación pasan y cuáles no, y las 2–3 preguntas de entrevista de la ficha que mi código todavía no me deja responder bien.
- No sugieras librerías externas (Radix, floating-ui, react-window, etc.).
```

Tip: copiá las fichas de este DS a `docs/specs/` en el repo así Claude Code las lee sin que las pegues.

## Prompt de review por PR

```text
Revisá el PR de <Componente> contra docs/specs/<Componente>.md.
Seguí las reglas de CLAUDE.md: no me des el código corregido.
Además: buscá específicamente <la dificultad de la ficha>, por ejemplo
"stale closures en los timers" o "qué pasa si el padre cambia `value` a undefined".
```

## Rúbrica

| Eje | Qué se mira |
| --- | --- |
| API | Props tipadas, nombres consistentes con el resto del DS, `...rest` y `ref` donde corresponde, defaults sensatos |
| Estado | Una sola fuente de verdad; nada de estado duplicado que se sincroniza con efectos; derivar en render cuando se puede |
| Efectos | Cada `useEffect` tiene cleanup si suscribe, agenda o muta el DOM; dependencias honestas (sin `eslint-disable`) |
| Accesibilidad | Rol y atributos ARIA del patrón WAI-ARIA APG, teclado completo, foco visible y gestionado, axe en verde |
| Tests | Cada criterio de aceptación tiene su test; se testea con `user-event` y queries por rol, no por clase |
| Explicación | Podés explicar en voz alta cada decisión como en una entrevista |

## Flujo de un componente

1. Leé la ficha y escribí la API (tipos) antes que el cuerpo.
2. Escribí los tests de los criterios de aceptación (fallan).
3. Implementá hasta que pasen.
4. Probá a mano con teclado sólo (y con VoiceOver o NVDA si podés).
5. Abrí el PR, pedí la review, resolvé, y respondé las preguntas de entrevista por escrito en la descripción del PR.
6. Merge. Recién ahí, el siguiente.
