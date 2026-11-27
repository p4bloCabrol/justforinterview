# Proceso y asistente

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
