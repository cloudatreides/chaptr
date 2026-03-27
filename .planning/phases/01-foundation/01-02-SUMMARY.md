---
phase: 01-foundation
plan: 02
subsystem: routing-store
tags: [react-router, zustand, persist, routing, state]
dependency_graph:
  requires: [01-01]
  provides: [routing-skeleton, zustand-store]
  affects: [all-phase-2-plus-plans]
tech_stack:
  added: [react-router@7.13.2, zustand@5.0.12]
  patterns: [createBrowserRouter, zustand-persist, localStorage-hydration]
key_files:
  created:
    - src/store/useChaptrStore.ts
    - src/pages/LandingPage.tsx
    - src/pages/UniversesPage.tsx
    - src/pages/StoryReaderPage.tsx
  modified:
    - src/main.tsx
    - package.json
    - package-lock.json
key_decisions:
  - React Router v7 imports all from 'react-router' — no react-router-dom needed
  - Zustand persist key fixed as 'chaptr-v1' — must not change across phases
  - spendGems returns boolean so callers know if spend succeeded
  - migrate stub included so schema can evolve in later phases without breaking localStorage
metrics:
  duration_minutes: 5
  completed_date: 2026-03-27
  tasks_completed: 2
  files_created: 5
  files_modified: 3
---

# Phase 01 Plan 02: React Router v7 Routing + Zustand Persist Store Summary

Routing skeleton and state primitives established — three placeholder pages at `/`, `/universes`, `/story/:chapterId` wired via `createBrowserRouter`, and a Zustand store persisting to `localStorage` as `chaptr-v1` with `gemBalance: 30` initial state.

## Package Versions

| Package | Version |
|---|---|
| react-router | 7.13.2 |
| zustand | 5.0.12 |

## Zustand Store Shape

**Store key (localStorage):** `chaptr-v1`

**File:** `src/store/useChaptrStore.ts`

| Field | Type | Initial Value | Notes |
|---|---|---|---|
| `gemBalance` | `number` | `30` | Decrements on story choices |
| `selfieUrl` | `string \| null` | `null` | Player selfie for character skin |
| `userName` | `string \| null` | `null` | Player display name |
| `storyState` | `StoryState \| null` | `null` | Active node + chapter tracking |
| `choiceHistory` | `ChoiceRecord[]` | `[]` | Full choice audit trail |
| `_schemaVersion` | `number` | `1` | Visible in DevTools, not just persist version |

**Actions:**

| Action | Signature | Behaviour |
|---|---|---|
| `setGemBalance` | `(balance: number) => void` | Sets balance directly |
| `spendGems` | `(amount: number) => boolean` | Returns false if insufficient balance; deducts otherwise |
| `setSelfie` | `(url: string) => void` | Sets selfie URL |
| `setUserName` | `(name: string) => void` | Sets display name |
| `setStoryState` | `(state: StoryState) => void` | Updates active node/chapter |
| `recordChoice` | `(choice: ChoiceRecord) => void` | Appends to choiceHistory |
| `resetStory` | `() => void` | Clears storyState + choiceHistory |

**Persist config:** `version: 1`, `migrate` stub included for future schema changes.

## Route Table

| Path | Component | File |
|---|---|---|
| `/` | LandingPage | `src/pages/LandingPage.tsx` |
| `/universes` | UniversesPage | `src/pages/UniversesPage.tsx` |
| `/story/:chapterId` | StoryReaderPage | `src/pages/StoryReaderPage.tsx` |

All pages: `min-h-screen bg-base` wrapper + `.page-container px-5 py-10` inner container.

`StoryReaderPage` uses `useParams` from `'react-router'` to display `chapterId` in `text-rose-accent`.

## localStorage Key

**Key:** `chaptr-v1`

**Shape in storage:**
```json
{
  "state": {
    "gemBalance": 30,
    "selfieUrl": null,
    "userName": null,
    "storyState": null,
    "choiceHistory": [],
    "_schemaVersion": 1
  },
  "version": 1
}
```

## Build Verification

- `npm run build` exits 0
- 24 modules transformed (up from 16 in 01-01 — 3 pages + store + router all included)
- No TypeScript errors
- Bundle: 283kb JS / 6.26kb CSS (gzipped: 90kb / 2.25kb)

## Deviations from Plan

None — plan executed exactly as written.

The `migrate` function parameter `version` was renamed to `_version` (prefixed underscore) to satisfy the TypeScript `noUnusedParameters` rule. This is a minor style fix, not a behaviour change.

## Known Stubs

All three pages are intentional placeholders. They render headings and "Phase N will build this out" text. Data wiring happens in phases 2–3. These stubs are by design — the plan's goal is routing skeleton only.

## Self-Check: PASSED

- `src/store/useChaptrStore.ts` — exists, contains `chaptr-v1`, compiles
- `src/pages/LandingPage.tsx` — exists
- `src/pages/UniversesPage.tsx` — exists
- `src/pages/StoryReaderPage.tsx` — exists, imports `useParams` from `'react-router'`
- `src/main.tsx` — contains `createBrowserRouter`, no App.tsx import
- Commit `380954b` — exists in git log
- `npm run build` — exits 0
