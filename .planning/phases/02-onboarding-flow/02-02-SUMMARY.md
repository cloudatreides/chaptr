---
phase: 02-onboarding-flow
plan: 02
subsystem: ui
tags: [react-easy-crop, zustand, framer-motion, canvas, selfie, modal]

requires:
  - phase: 02-onboarding-flow/01
    provides: AppShell layout wrapper, Zustand store with setSelfie, react-easy-crop installed
provides:
  - SelfieUploadModal component with primer->crop flow
  - cropImage canvas helper (256x256 JPEG compression)
  - showSelfiePrompt Zustand flag with trigger/dismiss actions
  - Global modal mount in AppShell
affects: [03-core-reading-loop]

tech-stack:
  added: []
  patterns: [modal-state-machine, canvas-crop-compress, global-modal-mount]

key-files:
  created:
    - src/components/SelfieUploadModal.tsx
    - src/lib/cropImage.ts
    - src/__tests__/useChaptrStore.test.ts
    - src/__tests__/SelfieUploadModal.test.tsx
    - src/__tests__/cropImage.test.ts
  modified:
    - src/store/useChaptrStore.ts
    - src/components/AppShell.tsx

key-decisions:
  - "Zustand persist schema bumped to v2 with migration for showSelfiePrompt field"

patterns-established:
  - "Modal state machine: internal ModalStep type ('primer' | 'crop') controls sub-views within a single modal component"
  - "Canvas crop helper: isolated async function taking image src + crop area, returning compressed base64"
  - "Global modal mount: AppShell reads Zustand flag, conditionally renders modal overlay above Outlet"

requirements-completed: [ONB-04, ONB-05, ONB-06, ONB-07]

duration: 2min
completed: 2026-03-27
---

# Phase 2 Plan 2: Selfie Upload Modal Summary

**Selfie upload modal with primer->crop pipeline using react-easy-crop at 4:5 aspect, canvas compression to 256x256 JPEG, mounted globally in AppShell via Zustand flag**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-27T10:49:26Z
- **Completed:** 2026-03-27T10:52:05Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Zustand store extended with showSelfiePrompt flag, triggerSelfiePrompt/dismissSelfiePrompt/clearSelfie actions, schema v2 migration
- SelfieUploadModal with two-step flow: primer screen (headline, privacy copy, photo CTA, skip CTA) and crop screen (react-easy-crop at 4:5, confirm/retry)
- Canvas cropImage helper compresses uploaded photos to 256x256 JPEG at 80% quality
- AppShell conditionally renders modal based on store flag
- 16 tests passing across all test files (store, modal, cropImage, landing, universes)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add showSelfiePrompt to Zustand store + create cropImage helper + SelfieUploadModal component** - `0939187` (feat)
2. **Task 2: Create test files for selfie modal and cropImage helper** - `b5a8035` (test)

## Files Created/Modified
- `src/store/useChaptrStore.ts` - Added showSelfiePrompt boolean, trigger/dismiss/clearSelfie actions, schema v2 migration
- `src/lib/cropImage.ts` - Canvas crop and compress helper (256x256 JPEG at 0.8 quality)
- `src/components/SelfieUploadModal.tsx` - Multi-step modal (primer -> crop) with react-easy-crop, Framer Motion animations, accessibility attributes
- `src/components/AppShell.tsx` - Conditional SelfieUploadModal render based on showSelfiePrompt store flag
- `src/__tests__/useChaptrStore.test.ts` - Store logic tests for selfie prompt trigger/dismiss/set/clear
- `src/__tests__/SelfieUploadModal.test.tsx` - Primer screen rendering and accessibility tests
- `src/__tests__/cropImage.test.ts` - Module export verification test

## Decisions Made
- Bumped Zustand persist schema to version 2 with migration that sets showSelfiePrompt: false for existing v1 data

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all data flows are wired. The selfie modal is triggered by Zustand state (showSelfiePrompt), which will be set by the story engine after chapter 1 completion in Phase 3.

## Next Phase Readiness
- Onboarding flow complete: landing page, universe selection, and selfie upload modal all built
- Ready for Phase 3 (core reading loop) which will trigger showSelfiePrompt after chapter 1
- selfieUrl stored in Zustand/localStorage ready for protagonist overlay in reading screens

---
*Phase: 02-onboarding-flow*
*Completed: 2026-03-27*
