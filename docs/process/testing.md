# Testing strategy

**English** · [Español](#español)

| What | With | Example |
| --- | --- | --- |
| Visible behavior | `@testing-library/react` + `user-event` | `await user.keyboard('{ArrowRight}')` and assert `aria-selected` |
| Hooks without UI | `renderHook` | `useControllableState`, `useCombobox`, `useVirtualizer` |
| Pure logic | Plain Vitest | The Toast reducer |
| Timers | `vi.useFakeTimers()` + `user-event` with `advanceTimers` | Tooltip, Toast |
| Accessibility | `axeViolations(container)` | One test per component, in its most complex state |
| Types | `// @ts-expect-error` in a test | Button without a label doesn't compile; single-mode Accordion with an array doesn't compile |

Rules: query by role and accessible name (`getByRole('switch', { name: 'Dark mode' })`), never by class or test-id unless there's no other way. One test per acceptance criterion, named with the criterion's text.

With fake timers, create the user like this: `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.

---

<a id="español"></a>

# Estrategia de testing — Español

| Qué | Con qué | Ejemplo |
| --- | --- | --- |
| Comportamiento visible | `@testing-library/react` + `user-event` | `await user.keyboard('{ArrowRight}')` y verificar `aria-selected` |
| Hooks sin UI | `renderHook` | `useControllableState`, `useCombobox`, `useVirtualizer` |
| Lógica pura | Vitest a secas | El reducer del Toast |
| Timers | `vi.useFakeTimers()` + `user-event` con `advanceTimers` | Tooltip, Toast |
| Accesibilidad | `axeViolations(container)` | Un test por componente, en su estado más complejo |
| Tipos | `// @ts-expect-error` en un test | Button sin label no compila; Accordion single con array no compila |

Reglas: queries por rol y nombre accesible (`getByRole('switch', { name: 'Modo oscuro' })`), nunca por clase ni test-id salvo que no haya otra. Un test por criterio de aceptación, con el texto del criterio como nombre.

Con fake timers, creá el usuario así: `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.
