---
phase: 04-static-story-content
plan: 02
subsystem: ui
tags: [react, typescript, story-content, framer-motion, modal]

requires:
  - phase: 04-static-story-content
    plan: 01
    provides: chapter1.ts skeleton graph, READ-03 fix, chapter1.test.ts

provides:
  - Full 9-beat Chapter 1 prose graph in chapter1.ts
  - NamePromptModal component (non-dismissible, setUserName on submit)
  - chapter-end overlay in StoryReaderPage (pulsing heading, sidebar CTA)
  - sceneGradient prop wired from chapter1.ts beats to SceneImage

affects:
  - 05-ai-story-engine (receives fully authored chapter1.ts as the static baseline)
  - StoryReaderPage.tsx (chapter-end state, name prompt display)

tech-stack:
  added: []
  patterns:
    - "NamePromptModal mirrors SelfieUploadModal structure — AnimatePresence + motion backdrop + panel"
    - "chapter-end overlay uses motion.h1 with opacity pulse animation (Framer Motion)"
    - "gradientClass prop on SceneImage overrides default gradient when sceneImage is undefined"

key-files:
  created:
    - src/components/NamePromptModal.tsx
  modified:
    - src/data/chapter1.ts
    - src/pages/StoryReaderPage.tsx
    - src/components/reader/SceneImage.tsx
    - src/__tests__/StoryReaderPage.test.tsx

key-decisions:
  - "Replaced 'gives' with 'shoots' and 'offers' throughout beat prose — 'gives' contains banned substring 'ive' (IVE group name)"
  - "framer-motion mock in StoryReaderPage.test.tsx extended with motion.h1 — required for chapter-end overlay render in tests"
  - "NamePromptModal mocked in StoryReaderPage tests — isolates test from modal implementation"

requirements-completed: [STORY-01, STORY-02, STORY-03, STORY-04]

duration: ~6min
completed: 2026-03-28
---

# Phase 4 Plan 02: Prose Authoring + Chapter-End Wiring Summary

**Full 9-beat Chapter 1 prose authored with scene gradients, NamePromptModal built, chapter-end overlay wired, and sceneGradient prop plumbed end-to-end from data to SceneImage**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-03-27T23:53:33Z
- **Completed:** 2026-03-28T00:00:00Z
- **Tasks:** 2 of 3 (Task 3 is human playthrough verification checkpoint)
- **Files modified:** 5 (1 created, 4 modified)

## Accomplishments

- **Task 1:** Replaced all stub prose in beat-2b-2, beat-3, beat-4, beat-5 with full authored content (second-person present tense, [Name] token, Jiwoo/Mina characterization, VEIL Studio B chapter-end hook). Added `sceneGradient` to all 8 beats. All 8 chapter1.test.ts tests green.
- **Task 2:** Created `NamePromptModal.tsx` (non-dismissible, name.trim() validation, setUserName on submit, aria-labelledby). Added `gradientClass` prop to SceneImage. Wired chapter-end overlay (motion.h1 pulse, sidebar CTA) into StoryReaderPage. Added `showNamePrompt` state init from `userName === null`. TypeScript clean, StoryReaderPage tests green.

## Task Commits

1. **Task 1: Chapter 1 prose + gradients** - `3b5885e` (feat)
2. **Task 2: NamePromptModal + overlay + SceneImage** - `8d2409c` (feat)

## Files Created/Modified

- `src/data/chapter1.ts` — Full 9-beat prose graph with sceneGradient on every beat
- `src/components/NamePromptModal.tsx` — Non-dismissible name input modal, exports default
- `src/pages/StoryReaderPage.tsx` — chapter-end overlay, showNamePrompt state, gradientClass wiring
- `src/components/reader/SceneImage.tsx` — gradientClass prop added
- `src/__tests__/StoryReaderPage.test.tsx` — motion.h1 mock + NamePromptModal mock added

## Decisions Made

- Replaced "gives" → "shoots"/"offers" throughout beat prose (Rule 1 auto-fix: "gives" contains banned substring "ive")
- Extended framer-motion mock in StoryReaderPage.test.tsx to include `motion.h1` (Rule 1 auto-fix: chapter-end overlay uses motion.h1 which was undefined in tests)
- Added NamePromptModal mock to StoryReaderPage.test.tsx to prevent import chain from running in test environment

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] "ive" substring in beat-2b-2 prose triggering STORY-03 test failure**
- **Found during:** Task 1 (first test run after authoring)
- **Issue:** The word "gives" contains the substring "ive" (lowercase match for banned K-pop group name "IVE"). Beat text had "gives you a quick sideways look" and "gives a short nod".
- **Fix:** Replaced "gives you" → "shoots you" and "gives a short nod" → "offers a short nod"
- **Files modified:** src/data/chapter1.ts
- **Commit:** 3b5885e

**2. [Rule 1 - Bug] framer-motion mock missing `motion.h1` causing StoryReaderPage test failure**
- **Found during:** Task 2 (test run after adding chapter-end overlay)
- **Issue:** StoryReaderPage now renders `<motion.h1>` in the chapter-end overlay, but the test's vi.mock for framer-motion only had `motion.div`. React threw "Element type is invalid: expected string or function but got undefined."
- **Fix:** Added `motion.h1` to the vi.mock definition in StoryReaderPage.test.tsx
- **Files modified:** src/__tests__/StoryReaderPage.test.tsx
- **Verification:** StoryReaderPage tests pass (2/2)
- **Committed in:** 8d2409c (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for test correctness. No scope creep.

## Issues Encountered

Pre-existing LandingPage test failure ("renders hero headline") — text split across `<br />` element. Confirmed pre-existing before this plan's changes. Logged in 04-01 SUMMARY, remains out of scope.

## Known Stubs

None — all 9 beats have full authored prose. No placeholder text remaining.

## Checkpoint Status

Task 3 (human playthrough verification) is a `checkpoint:human-verify` gate. The plan is functionally complete — all code tasks done, tests green, TypeScript clean. Awaiting human approval of manual playthrough per the how-to-verify steps in the plan.

## Self-Check: PASSED

- FOUND: src/data/chapter1.ts (9 beats, all with sceneGradient, isChapterEnd: true on beat-5)
- FOUND: src/components/NamePromptModal.tsx
- FOUND: aria-labelledby="name-modal-headline" in NamePromptModal.tsx
- CONFIRMED: No onClick on backdrop in NamePromptModal.tsx
- FOUND: showNamePrompt + NamePromptModal render in StoryReaderPage.tsx
- FOUND: currentBeat.isChapterEnd in StoryReaderPage.tsx JSX
- FOUND: gradientClass={currentBeat.sceneGradient} in StoryReaderPage.tsx
- FOUND: gradientClass prop in SceneImage.tsx
- FOUND: commit 3b5885e (Task 1)
- FOUND: commit 8d2409c (Task 2)

---
*Phase: 04-static-story-content*
*Completed: 2026-03-28*
