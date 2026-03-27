---
phase: 03-core-reading-loop
plan: 01
subsystem: ui
tags: [react, zustand, typewriter, reader-layout, framer-motion, vaul, tailwind]

requires:
  - phase: 02-onboarding-flow
    provides: Zustand store with persist v2, Framer Motion patterns, Tailwind tokens, routing
provides:
  - Extended Zustand store with decisionLog, sidebarOpen, firstGemChoiceUsed (v3 migration)
  - Mock story data (mockChapter1 with 5 beats, gem-gated choices)
  - useTypewriter hook (recursive setTimeout, isCancelledRef, instant-complete)
  - Reader layout shell (3-column desktop grid, scene image, progress bar, nav bar)
  - Reader sub-components (ProgressBar, SceneImage, GemCounter, ReaderNavBar, LoadingSkeleton)
  - vaul package installed for Plan 02/03 bottom sheets
affects: [03-02-PLAN, 03-03-PLAN]

tech-stack:
  added: [vaul@1.1.2]
  patterns: [recursive-setTimeout-typewriter, zustand-v3-migration, 3-column-lg-grid]

key-files:
  created:
    - src/hooks/useTypewriter.ts
    - src/data/mockStoryData.ts
    - src/components/reader/ProgressBar.tsx
    - src/components/reader/SceneImage.tsx
    - src/components/reader/GemCounter.tsx
    - src/components/reader/ReaderNavBar.tsx
    - src/components/reader/LoadingSkeleton.tsx
    - src/__tests__/useTypewriter.test.ts
  modified:
    - src/store/useChaptrStore.ts
    - src/__tests__/useChaptrStore.test.ts
    - src/pages/StoryReaderPage.tsx
    - src/index.css
    - package.json

key-decisions:
  - "useTypewriter uses recursive setTimeout with isCancelledRef (not setInterval) for React Strict Mode safety"
  - "Zustand persist bumped to v3 with migration adding decisionLog, sidebarOpen, firstGemChoiceUsed"
  - "vaul@1.1.2 installed now for Plan 02/03 bottom sheet needs"

patterns-established:
  - "Recursive setTimeout typewriter: isCancelledRef + indexRef to avoid stale closures and Strict Mode double-fire"
  - "Reader 3-column layout: lg:grid lg:grid-cols-[280px_1fr_1fr] with sidebar slot, reading column, right space"
  - "Shimmer animation: CSS @keyframes shimmer with animate-shimmer utility class"

requirements-completed: [READ-01, READ-08, READ-09, VIZ-01, VIZ-02, DESK-01]

duration: 4min
completed: 2026-03-27
---

# Phase 03 Plan 01: Reader Layout Foundation Summary

**Reader layout shell with 3-column desktop grid, scene image (40vh + selfie overlay), typewriter hook, progress bar, gem counter, loading skeleton, and extended Zustand store v3**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-27T14:41:32Z
- **Completed:** 2026-03-27T14:46:00Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments
- Extended Zustand store with Phase 3 fields (decisionLog, sidebarOpen, firstGemChoiceUsed) and v3 migration
- Created useTypewriter hook with recursive setTimeout, isCancelledRef guard, and instant-complete
- Built complete reader layout shell: scene image (40vh), progress bar (2px rose), nav bar, loading skeleton, 3-column desktop grid
- Created mockChapter1 with 5 story beats, NOVA Entertainment/VEIL/Jiwoo characters, and gem-gated choices
- All 62 tests passing (4 new typewriter tests, 10 new store tests)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend store, mock data, useTypewriter, tests** - `09f7ad0` (feat)
2. **Task 2: Reader layout shell with all components** - `ee5499a` (feat)

## Files Created/Modified
- `src/store/useChaptrStore.ts` - Extended with decisionLog, sidebarOpen, firstGemChoiceUsed, v3 migration
- `src/data/mockStoryData.ts` - Mock chapter with 5 beats, gem-gated choices, NOVA/VEIL/Jiwoo
- `src/hooks/useTypewriter.ts` - Recursive setTimeout typewriter with isCancelledRef
- `src/components/reader/ProgressBar.tsx` - 2px rose accent progress bar, fixed top, role=progressbar
- `src/components/reader/SceneImage.tsx` - 40vh scene image with selfie overlay (mix-blend-mode luminosity)
- `src/components/reader/GemCounter.tsx` - Gold diamond glyph + balance with Framer Motion pulse
- `src/components/reader/ReaderNavBar.tsx` - Sticky nav with sidebar trigger, chapter title, gem counter
- `src/components/reader/LoadingSkeleton.tsx` - Shimmer skeleton with aria-busy
- `src/pages/StoryReaderPage.tsx` - Full reader layout replacing placeholder
- `src/index.css` - Shimmer keyframes and animate-shimmer utility
- `src/__tests__/useTypewriter.test.ts` - 4 tests for typewriter behavior
- `src/__tests__/useChaptrStore.test.ts` - 10 new tests for gems, decisions, sidebar

## Decisions Made
- useTypewriter uses recursive setTimeout with isCancelledRef (not setInterval) for React Strict Mode safety
- Zustand persist bumped to v3 with migration for new Phase 3 fields
- vaul@1.1.2 installed early for Plan 02/03 bottom sheet components
- Mock data uses second-person present tense with [Name] placeholder as specified

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Reader layout shell complete with all foundational components
- Plan 02 can build typewriter text rendering and choice mechanics on this foundation
- Plan 03 can fill the sidebar slot and wire gem spending
- vaul already installed for bottom sheet components

## Self-Check: PASSED

- All 8 created files verified on disk
- Both commit hashes (09f7ad0, ee5499a) verified in git log
- All 62 tests passing

---
*Phase: 03-core-reading-loop*
*Completed: 2026-03-27*
