---
phase: 01-foundation
plan: 01
subsystem: frontend-scaffold
tags: [vite, react, tailwind, design-system, dark-mode, fonts]
dependency_graph:
  requires: []
  provides: [design-system-tokens, tailwind-config, dark-mode, page-container, font]
  affects: [all downstream plans]
tech_stack:
  added:
    - vite@8.0.3
    - react@19.2.4
    - react-dom@19.2.4
    - typescript@5.9.3
    - tailwindcss@3.4.19
    - postcss@8.5.8
    - autoprefixer@10.4.27
    - "@fontsource-variable/space-grotesk@5.2.10"
  patterns:
    - Tailwind v3 with CSS custom properties for theming
    - darkMode: 'selector' strategy (class="dark" on <html>)
    - .page-container max-width constraint pattern
key_files:
  created:
    - tailwind.config.js
    - src/index.css
    - src/App.tsx
    - index.html
    - package.json
    - vite.config.ts
    - postcss.config.js
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
  modified:
    - src/main.tsx
    - .planning/config.json
decisions:
  - "Tailwind v3 (3.4.19) — not v4 — to avoid breaking API changes"
  - "darkMode: 'selector' (Tailwind v3.4+ syntax) — NOT 'class'"
  - "Font family string: '\"Space Grotesk Variable\"' with double-quotes inside single-quotes"
  - "Font @import placed BEFORE @tailwind directives in index.css"
  - "postcss.config.js generated as ESM by Tailwind init — no conversion needed"
  - "Scaffolded via temp directory (chaptr-scaffold) then copied — create-vite cancelled on non-empty dirs"
metrics:
  duration: "~15 minutes"
  completed: "2026-03-27"
  tasks_completed: 2
  files_created: 21
---

# Phase 01 Plan 01: Vite + React + Tailwind Scaffold and Design System Summary

**One-liner:** Vite 8 + React 19 + Tailwind v3.4.19 scaffold with 7 CSS-variable-backed color tokens, Space Grotesk Variable font, darkMode selector strategy, and .page-container max-width pattern.

## What Was Scaffolded and Installed

### Package Versions

| Package | Version |
|---------|---------|
| vite | 8.0.3 |
| react | 19.2.4 |
| react-dom | 19.2.4 |
| typescript | 5.9.3 |
| tailwindcss | **3.4.19** (v3, not v4) |
| postcss | 8.5.8 |
| autoprefixer | 10.4.27 |
| @fontsource-variable/space-grotesk | 5.2.10 |

### Scaffold Method

`create-vite` cancels when the target directory is non-empty (even with only `.git`/`.planning`). Scaffolded into a temp `chaptr-scaffold/` directory, then copied all files into the project root, then deleted the temp directory.

## Tailwind Config Decisions

- **darkMode value:** `'selector'` — the Tailwind v3.4+ syntax. Using `'class'` would also work but `'selector'` is the current recommended approach.
- **Content paths:** `'./index.html'` and `'./src/**/*.{js,ts,jsx,tsx}'` — covers all component files.
- **Token names in extend.colors:** 7 tokens mapped to CSS custom properties via `var()`.
- **Font family:** `'"Space Grotesk Variable"'` — the double-quoted name is required because the font name contains a space. Registered under `fontFamily.sans` to be the default sans-serif.

## CSS Variable Names and Hex Values

| CSS Variable | Hex Value | Tailwind Token |
|-------------|-----------|----------------|
| `--color-base` | `#0D0B12` | `base` |
| `--color-rose` | `#D4799A` | `rose-accent` |
| `--color-purple` | `#9B7EC8` | `purple-accent` |
| `--color-gold` | `#D4AF37` | `gold` |
| `--color-surface` | `#1A1724` | `surface` |
| `--color-text` | `#F0EAF8` | `text-primary` |
| `--color-muted` | `#8B7FA8` | `muted` |

CSS variables are declared in `:root {}` in `src/index.css`. Tailwind tokens reference them via `var(--color-*)`.

## Font Family String

- **npm package:** `@fontsource-variable/space-grotesk`
- **CSS import:** `@import '@fontsource-variable/space-grotesk';`
- **Family string in tailwind.config.js:** `'"Space Grotesk Variable"'`
- The import MUST come before `@tailwind base;` in index.css

The build output confirms the font is bundled: three `.woff2` files (vietnamese, latin-ext, latin) appear in `dist/assets/`.

## Dark Mode Setup

`class="dark"` added to `<html>` tag in `index.html`. With `darkMode: 'selector'` in Tailwind config, all `dark:` utility classes activate globally from initial load.

## .page-container Pattern

```css
.page-container {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}
```

Applied in `src/App.tsx` as the inner wrapper inside `bg-base` full-width outer div. Background color fills the full viewport; content is constrained to 1440px centered.

## Deviations from Plan

### Deviation 1 — Scaffold via temp directory

**Rule 3: Blocking issue auto-fixed.**

- **Found during:** Task 1
- **Issue:** `npm create vite@latest . -- --template react-ts` cancelled without error when the target directory contained `.git`, `.planning`, or `.claude` directories. No `--force` flag exists to bypass this.
- **Fix:** Scaffolded into `C:/Users/ASUS/projects/chaptr-scaffold/`, copied all files to the project root, deleted the temp directory. End result is identical to a direct scaffold.
- **Files modified:** All scaffold files (package.json, src/, index.html, etc.)
- **Commit:** 719048c

### Deviation 2 — Non-standard Vite template

- **Found during:** Task 2 review
- **Issue:** The Vite create template used is a newer non-standard template that included `src/App.css`, `public/icons.svg`, `src/assets/hero.png`, and complex markup in App.tsx.
- **Fix:** Replaced `src/App.tsx` and `src/index.css` entirely per plan spec. Kept `src/App.css` committed (harmless — it's orphaned by the new App.tsx that doesn't import it). Kept template assets in `src/assets/` and `public/` as they don't affect the build.

## Known Stubs

None. The App.tsx smoke test wires all 7 color tokens and the font directly — no placeholder data, no stubs. The plan's goal (design system scaffold) is fully achieved.

## Self-Check: PASSED

- [x] `tailwind.config.js` exists with `darkMode: 'selector'`
- [x] `src/index.css` has `--color-base: #0D0B12` and `@import '@fontsource-variable/space-grotesk'`
- [x] `index.html` has `class="dark"` on `<html>`
- [x] `src/App.tsx` renders 7 color swatches + font identifier text
- [x] `npm run build` exits 0 (confirmed — 16 modules transformed, no errors)
- [x] Font woff2 files appear in dist/assets/ (Space Grotesk latin, latin-ext, vietnamese)
- [x] Commit 719048c exists in git log
