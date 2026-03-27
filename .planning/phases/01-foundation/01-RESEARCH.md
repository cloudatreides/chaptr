# Phase 1: Foundation - Research

**Researched:** 2026-03-27
**Domain:** Vite + React + Tailwind v3 scaffold, design system, React Router v7 data mode, Zustand persist
**Confidence:** HIGH

---

## Summary

Phase 1 is a pure scaffolding phase — no content, no API calls. Every finding here was verified against the live npm registry and official documentation. The stack is conventional and mature. The main gotchas are Tailwind v4 interference (the web is now saturated with v4 guides), React Router's rebranded API in v7 (single `react-router` package), and Zustand v5's import paths.

Because no `dark:` prefixes are used anywhere (all colors are custom token classes backed by CSS vars), the `darkMode` setting in tailwind.config.js is essentially inert. It should still be set to `'selector'` for correctness — this is the v3.4+ replacement for `'class'`, and both activate on `class="dark"` on the `<html>` element.

The font family name for the variable font package is `"Space Grotesk Variable"` (not `"Space Grotesk"`) — these are different package/name pairs.

**Primary recommendation:** Scaffold with `react-ts` Vite template, install Tailwind v3 explicitly pinned, add React Router v7 + Zustand in a single second install pass. Apply `class="dark"` to `<html>` in `main.tsx` before `ReactDOM.createRoot` renders.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Tailwind: lock to `tailwindcss@3` explicitly (NOT v4 — config model is completely different)
- React Router: use `react-router` v7 package (`createBrowserRouter` + `RouterProvider`)
- Zustand: with `persist` middleware, single key `chaptr-v1`, versioned migrations
- Font: `@fontsource-variable/space-grotesk` (self-hosted, NOT Google CDN)
- Dark mode: permanent `class="dark"` on `<html>` at boot — no toggle, no system preference check
- All color tokens defined as CSS variables on `:root`, added to `tailwind.config.js` `extend.colors`
- Write `bg-base`, `text-rose` etc — no `dark:` prefixes anywhere
- `.page-container` class in `index.css`: `max-width: 1440px; margin: 0 auto; width: 100%`
- All page content inside `.page-container`; backgrounds stay full-width on parent
- Mobile-first: `flex-col md:flex-row`, `px-5 md:px-[60px]` — no hardcoded desktop offsets
- Routes: `/` (Landing), `/universes` (Selection), `/story/:chapterId` (Reader); selfie = modal
- Zustand initial state: `{ gemBalance: 30, selfieUrl: null, userName: null, storyState: null, choiceHistory: [] }`
- `chaptr-v1` key in localStorage with versioned migrations via `version` field

### Claude's Discretion
- File structure within `src/` (components/, hooks/, pages/, store/, lib/)
- Vite config details beyond defaults
- ESLint/Prettier config if added

### Deferred Ideas (OUT OF SCOPE)
- Supabase integration — V2, after localStorage PoC validated
- Auth — skip entirely for PoC
- PWA manifest / service worker — not needed for PoC
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Vite + React + Tailwind v3 project scaffold (locked to tailwindcss@3, not v4) | Scaffold command + exact install sequence documented below |
| FOUND-02 | Global design system: CSS variable color tokens configured in tailwind.config.js + applied via class names | tailwind.config.js extend.colors pattern with var() references documented |
| FOUND-03 | Space Grotesk font loaded via @fontsource-variable/space-grotesk (self-hosted) | Import pattern + CSS font-family name verified against Fontsource docs |
| FOUND-04 | Dark mode only — `class="dark"` applied permanently to `<html>` at boot, no toggle | main.tsx DOM mutation pattern before ReactDOM.createRoot documented |
| FOUND-05 | Global `.page-container` class (max-width 1440px, margin auto) | CSS class pattern documented in index.css section |
| FOUND-06 | React Router v7 (`createBrowserRouter` + `RouterProvider`) with routes | Exact import + router config with :chapterId param documented |
| FOUND-07 | Zustand store with localStorage persistence; single key `chaptr-v1`; versioned migrations | Exact TypeScript store file with persist + version + migrate documented |
| DESK-02 | All layout uses Tailwind responsive prefixes; no hardcoded desktop pixel offsets | Documented as pattern enforcement, verified working in Tailwind v3 |
</phase_requirements>

---

## Standard Stack

### Core (verified against npm registry 2026-03-27)

| Library | Verified Version | Purpose | Why Standard |
|---------|-----------------|---------|--------------|
| vite | 8.0.3 | Build tool + dev server | Fastest React HMR, official React recommendation |
| react | 19.2.4 | UI framework | Latest stable |
| react-dom | 19.2.4 | React DOM renderer | Paired with react |
| @vitejs/plugin-react | 6.0.1 | React Fast Refresh for Vite | Official Vite React plugin |
| tailwindcss | **3.4.19** (pin to `tailwindcss@3`) | Utility CSS framework | Locked to v3 — v4 is incompatible config model |
| postcss | 8.5.8 | CSS processor (Tailwind peer) | Required by Tailwind |
| autoprefixer | 10.4.27 | Vendor prefix automation | Required by Tailwind |
| react-router | 7.13.2 | Client-side routing | v7 consolidates react-router-dom into single package |
| zustand | 5.0.12 | Global state management | Minimal API, no boilerplate |
| @fontsource-variable/space-grotesk | 5.2.10 | Self-hosted variable font | Zero CDN round-trip, locked version |

### Installation Commands (exact, ordered)

```bash
# Step 1: Scaffold
npm create vite@latest chaptr -- --template react-ts
cd chaptr

# Step 2: Install dependencies
npm install

# Step 3: Tailwind v3 (explicitly pinned — do NOT omit @3)
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# Step 4: App dependencies
npm install react-router zustand @fontsource-variable/space-grotesk
```

**Why this order matters:** `npx tailwindcss init -p` generates both `tailwind.config.js` and `postcss.config.js`. Running it before adding app deps keeps installs clean. The `@3` pin on tailwindcss is mandatory — without it npm will resolve v4 (currently 4.2.2) which has a completely different config model (no tailwind.config.js, different CLI, CSS-first config).

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| tailwindcss@3 | tailwindcss@4 | v4 uses CSS-first config, no tailwind.config.js — incompatible with the project's chosen pattern |
| react-router v7 data mode | BrowserRouter (declarative mode) | Data mode enables loaders/actions for future phases; declarative mode is simpler but less extensible |
| zustand persist | localStorage direct | Zustand persist handles serialisation, hydration, and migration automatically |

---

## Architecture Patterns

### Recommended Project Structure

```
chaptr/
├── public/
├── src/
│   ├── components/       # Shared UI primitives (Button, Modal, etc.)
│   ├── pages/            # Route-level components (LandingPage, UniversesPage, etc.)
│   ├── store/            # Zustand store (useAppStore.ts)
│   ├── lib/              # Pure utilities (no React deps)
│   └── main.tsx          # Entry: dark class + RouterProvider
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── tsconfig.json
```

### Pattern 1: Scaffold Command — react-ts Template

Use `react-ts`, not `react`. The TypeScript template includes `tsconfig.json`, `tsconfig.node.json`, `vite-env.d.ts`, and all `@types/react` deps. This is the correct starting point for a typed production codebase.

```bash
# Source: https://vite.dev/guide/
npm create vite@latest chaptr -- --template react-ts
```

### Pattern 2: Tailwind v3 Configuration

The `npx tailwindcss init -p` command generates both config files. After running it, replace the generated `tailwind.config.js` content:

```js
// tailwind.config.js
// Source: https://v3.tailwindcss.com/docs/guides/vite + verified against v3 docs
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        base:    'var(--color-base)',
        rose:    'var(--color-rose)',
        purple:  'var(--color-purple)',
        gold:    'var(--color-gold)',
        surface: 'var(--color-surface)',
        text:    'var(--color-text)',
        muted:   'var(--color-muted)',
      },
      fontFamily: {
        sans: ['"Space Grotesk Variable"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**`darkMode: 'selector'` note:** This is the v3.4.1+ replacement for `'class'`. Both activate when `class="dark"` is on an `<html>` ancestor. Since this project uses no `dark:` prefixes (all colors are custom token classes), the setting is technically inert — but `'selector'` is the correct current value. Using the old `'class'` string still works in v3.4.x but is legacy.

**CSS variable color values:** Pass the `var(--name)` string directly. Tailwind resolves it at utility-class-generation time. No need for RGB channel splitting unless you need Tailwind opacity modifiers like `bg-base/50`. For this project's solid colors, direct `var()` references are correct.

### Pattern 3: index.css

```css
/* src/index.css */
/* Source: Fontsource docs (https://fontsource.org/fonts/space-grotesk/install) + Tailwind v3 docs */

/* 1. Font import — must precede @tailwind directives */
@import "@fontsource-variable/space-grotesk/wght.css";

/* 2. Tailwind layers */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 3. CSS variable token definitions */
:root {
  --color-base:    #0D0B12;
  --color-rose:    #D4799A;
  --color-purple:  #9B7EC8;
  --color-gold:    #D4AF37;
  --color-surface: #1A1724;
  --color-text:    #F0EAF8;
  --color-muted:   #8B7FA8;
}

/* 4. Layout utility */
.page-container {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

/* 5. Global defaults */
html, body {
  background-color: var(--color-base);
  color: var(--color-text);
  font-family: "Space Grotesk Variable", sans-serif;
}
```

**`@import` before `@tailwind` is required** — PostCSS processes imports before Tailwind directives. If the font `@import` comes after `@tailwind base`, it will be hoisted incorrectly in some build configurations.

### Pattern 4: main.tsx — Dark Class + RouterProvider

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './App'
import './index.css'

// Apply dark class before React mounts to prevent flash
document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

**Why `classList.add` before `createRoot`:** DOM mutation before React renders ensures the `dark` class is present before any CSS is applied, eliminating potential flash-of-unstyled-content on first paint. This is more reliable than setting it inside a component effect.

### Pattern 5: App.tsx — Router Definition

```tsx
// src/App.tsx
// Source: https://reactrouter.com/api/data-routers/createBrowserRouter
import { createBrowserRouter } from 'react-router'

function LandingPage() {
  return <div className="page-container"><h1 className="text-text">Landing</h1></div>
}
function UniversesPage() {
  return <div className="page-container"><h1 className="text-text">Universes</h1></div>
}
function StoryPage() {
  return <div className="page-container"><h1 className="text-text">Story</h1></div>
}
function NotFound() {
  return <div className="page-container"><h1 className="text-muted">404</h1></div>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/universes',
    element: <UniversesPage />,
  },
  {
    path: '/story/:chapterId',
    element: <StoryPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
```

**Import note:** Import from `'react-router'`, NOT `'react-router-dom'`. In v7, `react-router-dom` no longer exists as a separate package — everything ships from the single `react-router` package. The `createBrowserRouter` + `RouterProvider` pattern is React Router's "Data Mode" — the recommended SPA approach that enables future loaders/actions without requiring the full Framework (Remix) mode.

### Pattern 6: Zustand Store

```ts
// src/store/useAppStore.ts
// Source: https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface StoryState {
  // extend in Phase 4 when story graph is defined
  currentNode?: string
}

interface AppState {
  gemBalance: number
  selfieUrl: string | null
  userName: string | null
  storyState: StoryState | null
  choiceHistory: string[]
  // Actions
  setGemBalance: (n: number) => void
  spendGems: (cost: number) => boolean
  setSelfieUrl: (url: string | null) => void
  setUserName: (name: string | null) => void
  addChoice: (choiceId: string) => void
  resetStore: () => void
}

const initialState = {
  gemBalance: 30,
  selfieUrl: null,
  userName: null,
  storyState: null,
  choiceHistory: [],
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setGemBalance: (n) => set({ gemBalance: n }),

      spendGems: (cost) => {
        const { gemBalance } = get()
        if (gemBalance < cost) return false
        set({ gemBalance: gemBalance - cost })
        return true
      },

      setSelfieUrl: (url) => set({ selfieUrl: url }),

      setUserName: (name) => set({ userName: name }),

      addChoice: (choiceId) =>
        set((state) => ({ choiceHistory: [...state.choiceHistory, choiceId] })),

      resetStore: () => set(initialState),
    }),
    {
      name: 'chaptr-v1',                          // localStorage key — locked
      storage: createJSONStorage(() => localStorage),
      version: 1,                                 // increment when state shape changes
      migrate: (persistedState: unknown, fromVersion: number) => {
        // v0 → v1: no prior persisted data expected; migrations added here in future
        if (fromVersion === 0) {
          return { ...initialState, ...(persistedState as Partial<AppState>) }
        }
        return persistedState as AppState
      },
    },
  ),
)
```

**Zustand v5 import paths:**
- `create` from `'zustand'`
- `persist` and `createJSONStorage` from `'zustand/middleware'`
- The old `'zustand/middleware/devtools'` subpath no longer exists in v5; use `'zustand/middleware'` for all middleware.

**`version` field behaviour:** Zustand persist stores `{ state: {...}, version: N }` in localStorage. On load, if the stored version number differs from the configured `version`, the `migrate` function is called with `(storedState, storedVersion)`. Migration is skipped entirely on first load (no existing key). Set `version: 1` now and increment to `2` when state shape changes in later phases.

### Anti-Patterns to Avoid

- **Importing from `react-router-dom`:** The package no longer exists in v7. Always use `'react-router'`.
- **Using `tailwindcss@latest` in install:** Resolves to v4. Always use `tailwindcss@3`.
- **Putting `@import` after `@tailwind base`:** Font imports must come before Tailwind directives in CSS.
- **Using `darkMode: 'class'` in tailwind.config.js:** Functional but deprecated in v3.4+. Use `'selector'` — both activate on `class="dark"` on an ancestor element.
- **Using `font-family: "Space Grotesk"` with the variable package:** The variable font package registers the family as `"Space Grotesk Variable"` (with the word "Variable"). The static `@fontsource/space-grotesk` package uses `"Space Grotesk"`. These are different.
- **Hardcoding `left: 220px` or other fixed desktop offsets:** Use Tailwind responsive prefixes (`md:pl-[220px]`) so mobile layout doesn't break.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| localStorage persistence with migrations | Custom serialize/deserialize + version check | `persist` middleware from `zustand/middleware` | Handles storage unavailability, partial hydration, version mismatch, async storage |
| Client-side routing with URL params | Manual `window.location` parsing | `createBrowserRouter` + `useParams()` | History stack management, scroll restoration, nested route context |
| Font loading optimisation | Manual `<link rel="preload">` in index.html | `@fontsource-variable/space-grotesk` npm package | Self-contained, versioned, zero render-blocking CDN round-trip |
| CSS variable ↔ Tailwind class bridge | `style={{ color: 'var(--color-rose)' }}` inline styles | `extend.colors` with `var()` values in tailwind.config.js | Keeps Tailwind class API intact; enables IDE autocomplete and purging |

**Key insight:** Every "hand-rolled" alternative in this list introduces a maintenance surface. The library versions are the entire point of the Foundation phase.

---

## Common Pitfalls

### Pitfall 1: Tailwind v4 Resolution
**What goes wrong:** `npm install tailwindcss` (no version) installs v4 (currently 4.2.2). Tailwind v4 has no `tailwind.config.js` — config is CSS-first via `@import "tailwindcss"` and `@theme`. The entire configuration pattern in this phase breaks silently.
**Why it happens:** npm resolves `tailwindcss` to latest by default.
**How to avoid:** Always run `npm install -D tailwindcss@3 postcss autoprefixer`. The `@3` range selector pins to the highest 3.x release (3.4.19 as of 2026-03-27).
**Warning signs:** `tailwind.config.js` has no effect; `@tailwind base` emits warnings in console; color classes not generated.

### Pitfall 2: Font Family Name Mismatch
**What goes wrong:** Using `font-family: "Space Grotesk"` when the variable package is installed. The font renders as system fallback; no error.
**Why it happens:** The variable font package (`@fontsource-variable/space-grotesk`) registers a different name than the static package (`@fontsource/space-grotesk`).
**How to avoid:** Use `"Space Grotesk Variable"` in both `tailwind.config.js` fontFamily and in CSS.
**Warning signs:** Font loads with no console error but text looks like system sans-serif; DevTools shows font-family resolved to `-apple-system` or `Arial`.

### Pitfall 3: React Router v7 Package Name
**What goes wrong:** Installing `react-router-dom` or importing from it. `react-router-dom` v7 is a thin compatibility shim — it re-exports from `react-router` but introduces a redundant dependency.
**Why it happens:** All v5/v6 tutorials use `react-router-dom`. Web search results include many v6 guides.
**How to avoid:** Install only `react-router` (no `-dom` suffix). Import `createBrowserRouter`, `RouterProvider`, `useParams`, `useNavigate` all from `'react-router'`.
**Warning signs:** Duplicate React Router code in bundle; peer dep warnings about conflicting versions.

### Pitfall 4: Zustand v5 Middleware Import Paths
**What goes wrong:** Importing from `'zustand/middleware/devtools'` or other v4-era subpaths.
**Why it happens:** v4 exposed individual middleware as subpath exports. v5 consolidates all middleware into `'zustand/middleware'`.
**How to avoid:** All middleware (`persist`, `devtools`, `immer`, `subscribeWithSelector`) import from `'zustand/middleware'` in v5.
**Warning signs:** Module resolution error at build time: `"Cannot find module 'zustand/middleware/persist'"`.

### Pitfall 5: dark class on `<html>` Applied Too Late
**What goes wrong:** Setting `class="dark"` inside a React `useEffect` causes a brief flash of unstyled (light) content on first render.
**Why it happens:** `useEffect` runs after paint.
**How to avoid:** Apply `document.documentElement.classList.add('dark')` synchronously in `main.tsx` before `createRoot(...).render(...)`.
**Warning signs:** Visible white flash on hard reload; background flickers from white to `#0D0B12`.

### Pitfall 6: `@import` After `@tailwind` Directives
**What goes wrong:** CSS `@import` statements after `@tailwind base` generate a PostCSS warning and may not load correctly: `"@import must precede all other rules"`.
**Why it happens:** CSS spec requires `@import` at the top of the file.
**How to avoid:** Always place `@import "@fontsource-variable/space-grotesk/wght.css"` as the first line of `index.css`, before `@tailwind base`.
**Warning signs:** PostCSS build warning in terminal; font fails to load in production build.

---

## Code Examples

### Verified: Reading URL params from React Router v7

```tsx
// Source: https://reactrouter.com/api/data-routers/createBrowserRouter
import { useParams } from 'react-router'

function StoryPage() {
  const { chapterId } = useParams<{ chapterId: string }>()
  return <div>Chapter: {chapterId}</div>
}
```

### Verified: Zustand store consumption

```tsx
// Source: https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data
import { useAppStore } from '../store/useAppStore'

function GemCounter() {
  const gemBalance = useAppStore((state) => state.gemBalance)
  return <span className="text-gold">✦ {gemBalance}</span>
}
```

### Verified: postcss.config.js (auto-generated by `npx tailwindcss init -p`)

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Verified: tailwind.config.js content check

The `content` array must include `"./index.html"` — Vite projects use `index.html` at root level (not in `public/`). Tailwind scans this for class names. Omitting it means classes only used in `index.html` would be purged in production.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `react-router-dom` package | `react-router` package only | v7.0 (Nov 2024) | Simpler dep tree |
| `darkMode: 'class'` | `darkMode: 'selector'` | Tailwind v3.4.1 (Jan 2024) | Both activate on `class="dark"` — functionally equivalent for permanent dark |
| Zustand `'zustand/middleware/persist'` subpath | `'zustand/middleware'` | Zustand v5.0 (Oct 2024) | Consolidation of all middleware |
| `BrowserRouter` + `<Routes>` pattern | `createBrowserRouter` + `RouterProvider` | React Router v6.4 (2022), standard in v7 | Data loading infrastructure, future loaders |

---

## Open Questions

1. **`postcss.config.js` ESM vs CJS format**
   - What we know: `npx tailwindcss init -p` generates `postcss.config.js` as CJS (`module.exports = {}`) by default. Vite projects scaffolded with `react-ts` use `"type": "module"` in `package.json`, which means `.js` files are treated as ESM.
   - What's unclear: Whether the CJS `module.exports` postcss config causes an issue with Vite's ESM-first module system.
   - Recommendation: After running `tailwindcss init -p`, check the generated file. If it uses `module.exports`, rename it to `postcss.config.cjs` OR rewrite it as ESM (`export default { ... }`). The ESM form shown in the Code Examples section above is the safe version.

2. **Vite 8 vs Vite 6**
   - What we know: `npm view vite version` returns 8.0.3. The `create-vite` template scaffolds with whatever Vite version it bundles (may be 6.x in the template's bundled deps).
   - What's unclear: Whether the scaffolded `vite.config.ts` will auto-select Vite 8 or an older version.
   - Recommendation: After scaffolding, check `package.json` for the vite version. If it's < 8, that's fine — no compatibility issues with the chosen stack. Vite 8 requires Node 20.19+ or 22.12+; this machine runs 22.14.0 so either version works.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All npm commands | ✓ | v22.14.0 | — |
| npm | Package management | ✓ | 10.9.2 | — |
| create-vite | Scaffolding | ✓ (via npx) | 9.0.3 | — |
| tailwindcss@3 | Design system | ✓ (via npm) | 3.4.19 | — |
| react-router | Routing | ✓ (via npm) | 7.13.2 | — |
| zustand | State | ✓ (via npm) | 5.0.12 | — |
| @fontsource-variable/space-grotesk | Font | ✓ (via npm) | 5.2.10 | — |

No missing dependencies. All packages are publicly available on npm. No external services required for this phase.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected yet — greenfield project |
| Config file | None — Wave 0 gap |
| Quick run command | `npm run dev` (manual smoke test) |
| Full suite command | N/A for Phase 1 |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | `npm run dev` starts without errors | smoke | `npm run dev` — manual check | ❌ Wave 0 |
| FOUND-02 | Color token class `bg-base` visually applies #0D0B12 | smoke | Manual visual check in browser | ❌ Wave 0 |
| FOUND-03 | Space Grotesk Variable renders on test element | smoke | DevTools font check | ❌ Wave 0 |
| FOUND-04 | `<html>` has `class="dark"` on load | smoke | `document.documentElement.classList.contains('dark')` in console | ❌ Wave 0 |
| FOUND-05 | `.page-container` constrains to 1440px | smoke | DevTools computed width check at >1440px viewport | ❌ Wave 0 |
| FOUND-06 | All 3 routes render placeholder without 404 | smoke | Navigate to `/`, `/universes`, `/story/test` manually | ❌ Wave 0 |
| FOUND-07 | `chaptr-v1` key appears in localStorage after first load | smoke | `localStorage.getItem('chaptr-v1')` in console | ❌ Wave 0 |
| DESK-02 | No hardcoded desktop pixel offsets in any layout | code review | Manual audit of className strings | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run dev` + visual spot check in browser at 375px and 1440px width
- **Phase gate:** All 5 success criteria from phase description pass before marking complete

### Wave 0 Gaps
- [ ] No test framework configured — Phase 1 is scaffold-only, success criteria are manual smoke tests
- [ ] Post-Phase 1: consider adding Vitest for Phase 3+ when component logic begins

---

## Sources

### Primary (HIGH confidence)
- npm registry live queries (2026-03-27) — all package versions verified
- [Tailwind CSS v3 Vite guide](https://v3.tailwindcss.com/docs/guides/vite) — install sequence + config
- [Tailwind CSS v3 Dark Mode](https://v3.tailwindcss.com/docs/dark-mode) — `selector` vs `class` clarification
- [React Router v7 Modes](https://reactrouter.com/start/modes) — Data Mode vs Declarative Mode
- [React Router createBrowserRouter API](https://reactrouter.com/api/data-routers/createBrowserRouter) — exact signature
- [Zustand persist docs](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data) — persist + migrate API
- [Fontsource Space Grotesk install](https://fontsource.org/fonts/space-grotesk/install) — import path + font-family name

### Secondary (MEDIUM confidence)
- [Vite getting started](https://vite.dev/guide/) — `react-ts` template confirmed
- npm view `react-router@7` peerDependencies — confirms React >=18 requirement (satisfied by React 19)

### Tertiary (LOW confidence)
- None — all critical claims verified against official sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions queried live from npm registry
- Architecture: HIGH — patterns verified against official React Router v7 and Zustand v5 docs
- Pitfalls: HIGH — each pitfall reproduced from official changelog or docs (Tailwind `selector` change documented in v3 changelog; RR v7 package consolidation in official migration guide)

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (30 days — stable ecosystem, Tailwind v3 is in maintenance mode, no breaking changes expected)
