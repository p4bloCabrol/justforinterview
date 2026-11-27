---
name: pr-prep
description: Prepare a pull request for the current branch in this repo - title, description from the PR template, Mermaid diagrams, and Storybook screenshots (light/dark, before/after) published to the pr-assets branch - then open or update the PR with gh. Use when Pablo asks to prepare, open, or describe a PR, or types /pr-prep.
---

# /pr-prep

Everything in the PR (title, body, image alt text) is in **English**. Talk to Pablo in Spanish.
Scripts live in `.claude/skills/pr-prep/scripts/`; work files go to `.pr-prep/` (gitignored).

## 1. Context

- Head = current branch. Base = `main` unless Pablo says otherwise. If the branch was cut from another
  PR branch that was squash-merged, `git rebase --onto main <old-parent>` first (ask before force-pushing).
- `git log --oneline main..HEAD`, `git diff --stat main...HEAD`; read the diff where needed to explain *why*.
- `feat/<component>` → read `docs/specs/<Component>.md` and find its issue: `gh issue list --label component`.
- Existing PR? `gh pr view --json number,title,body` → you will update it instead of creating one.

## 2. Gate

Run `npm run check`. If it fails, stop and report only the relevant error.

## 3. Title and body

- Title: Conventional Commits, imperative, ≤ 72 chars: `feat(button): …`, `docs: …`, `chore: …`. It becomes the
  squash commit message on main, so make it meaningful.
- Body: follow `.github/pull_request_template.md`. Keep every section; write "N/A" when one doesn't apply.
  - **What**: what changes and why, as bullets.
  - **Acceptance criteria**: copy the spec checklist; tick only what a test proves.
  - **Decisions**: link the ADRs added in `docs/adr/`.
  - **Agent review**: leave the table for Pablo to fill.
  - **Interview questions**: list the spec's questions but **never answer them**; Pablo answers in his own words.
  - Last line for component PRs: `Closes #<issue>`.
- Add **How to test** (commands, stories to open) and **Follow-ups** when they apply.

## 4. Diagrams

When the PR adds a state model, data flow or component composition (controllable state, Context, reducer,
portal), add a small ```mermaid block (`flowchart` or `stateDiagram-v2`, ≤ 12 nodes). GitHub renders it;
no image needed. Skip it for docs/config PRs.

## 5. Screenshots (component PRs only)

Only for component PRs: `feat/<component>` or `fix/<component>` branches that change `src/components/**`.
Docs, tooling, config and dependency PRs never get screenshots; skip this whole step.

1. `npm run build-storybook`.
2. Stories touched by the PR:
   `node .claude/skills/pr-prep/scripts/capture.mjs --changed-since main --out .pr-prep/shots`
   (add `--locales en,es` if user-facing copy changed). It prints JSON with each file.
3. Visual change to stories that already exist on main → before/after instead:
   `node .claude/skills/pr-prep/scripts/before-after.mjs --base main --ids <id1,id2>`.
   Pick the 2–6 most telling images; don't dump every combination.
4. **Ask Pablo before publishing** (it pushes to the public `pr-assets` branch):
   `node .claude/skills/pr-prep/scripts/publish.mjs --branch <head> --files <a.png,b.png>`
   It prints Markdown image links; put them under a `## Screenshots` section (a light | dark table reads well).

## 6. Review and open

Show Pablo the title and the full body. Only after his OK:
- New: `gh pr create --base main --title "<title>" --body-file .pr-prep/body.md`
- Existing: `gh pr edit <n> --title "<title>" --body-file .pr-prep/body.md`

Return the PR URL. Don't merge; Pablo merges with **Squash and merge**.
