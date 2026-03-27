# Phase 1: Foundation - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

A running Vite + React + Tailwind v3 app with the design system, routing skeleton, and Zustand store — no content yet, but every architectural decision locked in. This phase delivers the technical shell that all subsequent phases build on.

</domain>

<decisions>
## Implementation Decisions

### Package Versions
- Tailwind: lock to `tailwindcss@3` explicitly (NOT v4 — config model is completely different)
- React Router: use `react-router` v7 package (`createBrowserRouter` + `RouterProvider`)
- Zustand: with `persist` middleware, single key `chaptr-v1`, versioned migrations
- Font: `@fontsource-variable/space-grotesk` (self-hosted, NOT Google CDN)

### Dark Mode
- Permanent `class="dark"` on `<html>` at boot — no toggle, no system preference check
- All color tokens defined as CSS variables on `:root`, added to `tailwind.config.js` `extend.colors`
- Write `bg-base`, `text-rose` etc — no `dark:` prefixes anywhere

### Color Tokens
- `--color-base: #0D0B12` (background)
- `--color-rose: #D4799A` (primary accent)
- `--color-purple: #9B7EC8` (secondary accent)
- `--color-gold: #D4AF37` (gem/premium)
- `--color-surface: #1A1724` (card surfaces)
- `--color-text: #F0EAF8` (primary text)
- `--color-muted: #8B7FA8` (secondary text)

### Layout
- `.page-container` class in `index.css`: `max-width: 1440px; margin: 0 auto; width: 100%`
- All page content inside `.page-container`; backgrounds stay full-width on parent
- Mobile-first: `flex-col md:flex-row`, `px-5 md:px-[60px]` — no hardcoded desktop offsets

### Routes
- `/` → Landing page
- `/universes` → Story universe selection
- `/story/:chapterId` → Story reader
- Selfie upload triggered as modal/overlay after chapter 1 (not a route)

### Zustand Store Shape
- `chaptr-v1` key in localStorage
- Initial state: `{ gemBalance: 30, selfieUrl: null, userName: null, storyState: null, choiceHistory: [] }`
- Versioned migrations via `version` field

### Claude's Discretion
- File structure within `src/` (components/, hooks/, pages/, store/, lib/)
- Vite config details beyond defaults
- ESLint/Prettier config if added

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project

### Established Patterns
- None yet — this phase establishes all patterns

### Integration Points
- `src/main.tsx` — entry point, mounts RouterProvider and applies dark class to html
- `src/index.css` — global styles, CSS variable definitions, .page-container
- `tailwind.config.js` — color token extensions

</code_context>

<specifics>
## Specific Ideas

- Use `@fontsource-variable/space-grotesk` not Google Fonts CDN (eliminates render-blocking two-server round-trip)
- Apply `class="dark"` to `<html>` in `main.tsx` before React mounts
- `tailwindcss@3` — lock the version, web is full of v4 guides in 2025/2026 with a completely different config model
- `claude-haiku-4-5` is the model ID to use later (NOT `claude-3-haiku-20240307` which retires April 19, 2026)

</specifics>

<deferred>
## Deferred Ideas

- Supabase integration — V2, after localStorage PoC validated
- Auth — skip entirely for PoC
- PWA manifest / service worker — not needed for PoC

</deferred>
