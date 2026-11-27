# Process and assistant

**English** · [Español](#español)

How this DS is built, and the assistant that answers questions about it. The process is documented as it happens: every PR leaves an ADR, its Definition of Done met, and the interview questions answered.

## Two repos, one system

| Repo | Stack | What it contains |
| --- | --- | --- |
| `jfi-ds` | Vite + React + TS, Vitest, GitHub Actions | The 10 components, the demo, `docs/` (specs, ADRs, process) |
| Bridge project | Python + LangGraph + FastAPI | The certification question generator **and** the DS assistant: one backend, two use cases |

The assistant reads `jfi-ds`'s `docs/` (as a git submodule or cloned at ingest time) and is consumed from the DS demo page. The chat is built **with the DS's own components**: TextField, Button, Toast, and VirtualList for the history. You eat your own dog food.

## docs/ in jfi-ds

```text
docs/
  specs/<Component>.md     # this DS's spec sheets
  adr/NNNN-titulo.md        # one decision per file
  process/
    definition-of-done.md
    testing.md               # what with user-event, what with axe, what with renderHook
    ci.md                    # lint, test, axe, build on every PR
    versioning.md            # changesets, even if you don't publish
    working-with-agents.md   # CLAUDE.md, review prompts, what you accepted and what you rejected
.github/pull_request_template.md
CLAUDE.md
```

### ADR template

```md
# NNNN — <decision in one sentence>
Status: accepted · Date · Component
## Context        what problem and what constraints
## Options        2–3, with the cost of each
## Decision       which one and why
## Consequences   what becomes easier, what becomes harder
```

Natural first ADRs: `checked` vs `value` in Switch; `aria-disabled` vs `disabled` in Button loading; compound components with Context vs `cloneElement` in Tabs; `aria-activedescendant` vs roving tabindex in Combobox; `transform` vs `top` in VirtualList.

### Definition of Done (per component)

- [ ] Every acceptance criterion in the spec has a test, and it passes.
- [ ] No axe violations; tested using only the keyboard.
- [ ] Lint with no `eslint-disable` on hooks.
- [ ] At least one ADR.
- [ ] Claude Code review done; every comment accepted or rejected, with the reason, in the PR.
- [ ] Interview questions answered in the PR description.
- [ ] Changeset added.

### PR template

```md
## What
## Acceptance criteria   (checklist copied from the spec)
## Decisions             (link to ADRs)
## Agent review          comment → accepted / rejected, why
## Interview questions   answers in my own words
```

## The assistant

### Architecture

```text
docs/ (md) ──ingest──▶ chunks + metadata (file, heading)
                              │
React demo ──SSE──▶ FastAPI ──▶ LangGraph
                              ├─ route: DS question, process question, or off-topic?
                              ├─ retrieve: strategy A or B
                              ├─ answer: Claude via langchain-anthropic, citations required
                              └─ check: does every claim have a citation? if not, retry or say "not documented"
                              │
                        traces ─▶ LangSmith or Langfuse
```

### The experiment: two context strategies

The corpus is small (a few dozen markdown files): it fits entirely in the context window. So the interesting question isn't "how do I do RAG" but **when it's worth it**.

| | A: everything in context | B: RAG |
| --- | --- | --- |
| How | All the md files in the prompt (with prompt caching) | Embeddings, top-k by heading, vector store in a local file (FAISS or Chroma) |
| Hypothesis | Better quality, more tokens per question | Cheaper and scales, risk of losing context |

Both strategies run against the same eval suite. The decision is documented as an ADR, with the numbers.

### Evals

- **Dataset**: 30–50 questions in JSONL with the expected answer and source file. A mix of easy ones ("which token do I use for an input's border?"), reasoning ones ("why does the Toast use useReducer?"), cross-cutting ones ("what pattern do Switch and Tabs share?"), and off-topic ones (it has to say it doesn't know).
- **Metrics**: correctness (LLM-as-judge with a rubric), citation precision (does the cited file contain the answer?), "not documented" rate on the off-topic questions, latency and cost per answer.
- **When they run**: in the bridge project's CI on every PR, and every time `docs/` changes in jfi-ds.

### Order

1. Components 1–3 (Button, TextField, Switch) with their full process. That already gives a corpus.
2. Ingest and strategy A, no LangGraph yet: a single call, with citations.
3. Eval dataset and the first run. From here on, every change is measured.
4. Strategy B and comparison → ADR.
5. LangGraph with route + check, and traces.
6. Chat in the demo built with the DS components (it needs Toast and VirtualList: it comes last, and that's fine).

---

<a id="español"></a>

# Proceso y asistente — Español

Cómo se construye este DS y el asistente que responde preguntas sobre él. El proceso se documenta mientras se hace: cada PR deja un ADR, su Definition of Done cumplida y las preguntas de entrevista respondidas.

## Dos repos, un sistema

| Repo | Stack | Qué tiene |
| --- | --- | --- |
| `jfi-ds` | Vite + React + TS, Vitest, GitHub Actions | Los 10 componentes, la demo, `docs/` (fichas, ADRs, proceso) |
| Proyecto puente | Python + LangGraph + FastAPI | El generador de preguntas de la certificación **y** el asistente del DS: un backend, dos casos de uso |

El asistente lee el `docs/` de `jfi-ds` (submódulo git o clonado en el ingest) y se consume desde la página de demo del DS. El chat se arma **con los propios componentes del DS**: TextField, Button, Toast y VirtualList para el historial. Comés tu propia comida.

## docs/ en jfi-ds

```text
docs/
  specs/<Componente>.md     # las fichas de este DS
  adr/NNNN-titulo.md        # una decisión por archivo
  process/
    definition-of-done.md
    testing.md               # qué con user-event, qué con axe, qué con renderHook
    ci.md                    # lint, test, axe, build en cada PR
    versioning.md            # changesets, aunque no publiques
    working-with-agents.md   # CLAUDE.md, prompts de review, qué aceptaste y qué rechazaste
.github/pull_request_template.md
CLAUDE.md
```

### Plantilla de ADR

```md
# NNNN — <decisión en una frase>
Estado: aceptada · Fecha · Componente
## Contexto       qué problema y qué restricciones
## Opciones       2–3, con costo de cada una
## Decisión       cuál y por qué
## Consecuencias  qué se vuelve fácil, qué se vuelve difícil
```

Primeros ADRs naturales: `checked` vs `value` en Switch; `aria-disabled` vs `disabled` en Button loading; compound components con Context vs `cloneElement` en Tabs; `aria-activedescendant` vs roving tabindex en Combobox; `transform` vs `top` en VirtualList.

### Definition of Done (por componente)

- [ ] Todos los criterios de aceptación de la ficha tienen test y pasan.
- [ ] axe sin violaciones; probado sólo con teclado.
- [ ] Lint sin `eslint-disable` en hooks.
- [ ] Al menos un ADR.
- [ ] Review de Claude Code hecha; cada observación aceptada o rechazada con motivo en el PR.
- [ ] Preguntas de entrevista respondidas en la descripción del PR.
- [ ] Changeset agregado.

### Plantilla de PR

```md
## Qué
## Criterios de aceptación   (checklist copiado de la ficha)
## Decisiones                (link a ADRs)
## Review del agente         observación → aceptada / rechazada, por qué
## Preguntas de entrevista   respuestas en mis palabras
```

## El asistente

### Arquitectura

```text
docs/ (md) ──ingest──▶ chunks + metadata (archivo, heading)
                              │
React demo ──SSE──▶ FastAPI ──▶ LangGraph
                              ├─ route: ¿pregunta del DS, del proceso o fuera de tema?
                              ├─ retrieve: estrategia A o B
                              ├─ answer: Claude vía langchain-anthropic, con citas obligatorias
                              └─ check: ¿cada afirmación tiene cita? si no, reintenta o dice "no está documentado"
                              │
                        trazas ─▶ LangSmith o Langfuse
```

### El experimento: dos estrategias de contexto

El corpus es chico (unas decenas de markdown): entra entero en el contexto. Por eso la pregunta interesante no es "cómo hago RAG" sino **cuándo conviene**.

| | A: todo en contexto | B: RAG |
| --- | --- | --- |
| Cómo | Todos los md en el prompt (con prompt caching) | Embeddings, top-k por heading, vector store en archivo local (FAISS o Chroma) |
| Hipótesis | Mejor calidad, más tokens por pregunta | Más barato y escala, riesgo de perder contexto |

Las dos estrategias corren contra la misma batería de evals. La decisión se documenta como ADR con los números.

### Evals

- **Dataset**: 30–50 preguntas en JSONL con respuesta esperada y archivo fuente. Mezcla de fáciles ("¿qué token uso para el borde de un input?"), de razonamiento ("¿por qué el Toast usa useReducer?"), cruzadas ("¿qué patrón comparten Switch y Tabs?") y fuera de tema (tiene que decir que no sabe).
- **Métricas**: corrección (LLM-as-judge con rúbrica), precisión de citas (¿el archivo citado contiene la respuesta?), tasa de "no documentado" en las fuera de tema, latencia y costo por respuesta.
- **Cuándo corren**: en CI del proyecto puente en cada PR, y cada vez que cambia `docs/` en jfi-ds.

### Orden

1. Componentes 1–3 (Button, TextField, Switch) con su proceso completo. Ahí ya hay corpus.
2. Ingest y estrategia A, sin LangGraph todavía: una llamada, con citas.
3. Dataset de evals y la primera corrida. Desde acá, todo cambio se mide.
4. Estrategia B y comparación → ADR.
5. LangGraph con route + check, y trazas.
6. Chat en la demo con los componentes del DS (necesita Toast y VirtualList: llega al final, y está bien).
