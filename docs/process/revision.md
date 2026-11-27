# Revisión

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
