# Definition of Done (per component)

**English** · [Español](#español)

- [ ] Every acceptance criterion in the spec has a test, and it passes.
- [ ] No axe violations (`src/test/axe.ts`); tested by hand using only the keyboard.
- [ ] `npm run typecheck` and `npm run lint` green, with no `eslint-disable` on hooks.
- [ ] At least one ADR in `docs/adr/`.
- [ ] Claude Code review done; every comment accepted or rejected, with the reason, in the PR.
- [ ] The spec's interview questions answered in the PR description, in my own words.
- [ ] Stories in `<Component>.stories.tsx`: every variant and state, green in the Storybook a11y panel, in both themes and locales.

---

<a id="español"></a>

# Definition of Done (por componente) — Español

- [ ] Todos los criterios de aceptación de la ficha tienen test y pasan.
- [ ] Sin violaciones de axe (`src/test/axe.ts`); probado a mano sólo con teclado.
- [ ] `npm run typecheck` y `npm run lint` en verde, sin `eslint-disable` en hooks.
- [ ] Al menos un ADR en `docs/adr/`.
- [ ] Review de Claude Code hecha; cada observación aceptada o rechazada con motivo en el PR.
- [ ] Preguntas de entrevista de la ficha respondidas en la descripción del PR, en mis palabras.
- [ ] Stories en `<Component>.stories.tsx`: cada variante y estado, en verde en el panel a11y de Storybook, en ambos temas e idiomas.
