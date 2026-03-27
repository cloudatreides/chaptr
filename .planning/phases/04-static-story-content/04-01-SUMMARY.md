---
phase: 04-static-story-content
plan: 01
subsystem: ui
tags: [react, typescript, vitest, story-data]

requires:
  - phase: 03-core-reading-loop
    provides: StoryReaderPage, StoryBeat/StoryChoice/Chapter types from mockStoryData.ts

provides:
  - chapter1.ts with extended StoryBeat (nextBeatId?), StoryChoice, Chapter types
  - 9-beat skeleton story graph for "The Seoul Transfer" Chapter 1
  - READ-03 onAdvance fix in StoryReaderPage.tsx
  - chapter1.test.ts and StoryReaderPage.test.tsx graph integrity and behavior tests

affects:
  - 04-02-static-story-content (fills the skeleton beats with full authored prose)
  - Any phase that imports story types (must use chapter1 not mockStoryData)

tech-stack:
  added: []
  patterns:
    - "StoryBeat.nextBeatId: optional string enables prose-only beats that advance without choices"
    - "TDD Wave 0: test stubs created first (RED), implementation second (GREEN)"

key-files:
  created:
    - src/data/chapter1.ts
    - src/__tests__/chapter1.test.ts
    - src/__tests__/StoryReaderPage.test.tsx
  modified:
    - src/pages/StoryReaderPage.tsx
    - src/components/reader/ChoiceList.tsx
    - src/components/reader/ChoiceButton.tsx
  deleted:
    - src/data/mockStoryData.ts

key-decisions:
  - "Migrate beat prose from mockStoryData exactly — keeper quality for beats 1, 2a, 2b, 2c"
  - "Rephrase character descriptors to avoid banned phrases (her/his hair/eyes/face/skin) — tests enforce no protagonist physical description"
  - "beat-2b-2 and beat-3 are prose-only connector beats that exercise the READ-03 fix path"

patterns-established:
  - "All story types and data must come from src/data/chapter1.ts — no other data source"
  - "Prose must avoid describing protagonist appearance — [Name] token used for personalization only"
  - "No real celebrity/group names in any beat text"

requirements-completed: [STORY-01, STORY-02, STORY-03, STORY-04]

duration: 10min
completed: 2026-03-28
---

# Phase 4 Plan 01: Static Story Content Foundation Summary

**chapter1.ts established as sole type + data source with 9-beat skeleton graph, READ-03 prose-advance bug fixed, mockStoryData.ts deleted, and 10 graph integrity tests passing green**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-27T23:44:38Z
- **Completed:** 2026-03-28T00:00:00Z
- **Tasks:** 2
- **Files modified:** 6 (3 created, 1 deleted, 3 updated)

## Accomplishments

- Created chapter1.ts with extended StoryBeat type (adds nextBeatId?), 9-beat skeleton graph migrating keeper prose from mockStoryData.ts
- Fixed READ-03: onAdvance now calls advanceBeat(currentBeat.nextBeatId) for prose-only beats (previously was a no-op)
- Deleted mockStoryData.ts and updated all 3 import sites (StoryReaderPage, ChoiceList, ChoiceButton)
- Created chapter1.test.ts (8 tests: graph integrity, prose requirements, world integrity) and StoryReaderPage.test.tsx (2 tests: READ-03 behavior) — all 10 GREEN

## Task Commits

1. **Task 1: Wave 0 test stubs** - `4c72ed0` (test)
2. **Task 2: chapter1.ts, READ-03 fix, import migration** - `1ba73c9` (feat)

## Files Created/Modified

- `src/data/chapter1.ts` - All story types + 9-beat skeleton Chapter 1 graph
- `src/__tests__/chapter1.test.ts` - Graph integrity, prose, world integrity tests
- `src/__tests__/StoryReaderPage.test.tsx` - READ-03 onAdvance behavior test
- `src/pages/StoryReaderPage.tsx` - Updated import + READ-03 onAdvance fix
- `src/components/reader/ChoiceList.tsx` - Updated import to chapter1
- `src/components/reader/ChoiceButton.tsx` - Updated import to chapter1
- `src/data/mockStoryData.ts` - DELETED

## Decisions Made

- Migrate beat-1, beat-2a, beat-2b, beat-2c prose exactly from mockStoryData — prose quality is good and worth preserving as-is
- beat-2b choices previously both pointed to beat-3 directly; updated to point to beat-2b-2 (connector beat) to ensure the READ-03 code path is exercised in production traversal
- Rephrased 3 prose snippets to comply with the STORY-02 banned-phrase test (her/his hair/face/eyes), changing NPC descriptions from character-feature phrases to behavior/context descriptions

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] ChoiceButton.tsx was also importing from mockStoryData.ts**
- **Found during:** Task 2 (post-deletion grep check)
- **Issue:** Plan only listed ChoiceList.tsx as needing import update; ChoiceButton.tsx also imported StoryChoice from mockStoryData and would have broken TypeScript compile
- **Fix:** Updated import in ChoiceButton.tsx to chapter1
- **Files modified:** src/components/reader/ChoiceButton.tsx
- **Verification:** `npx tsc --noEmit` exits 0; `grep -r mockStoryData src/` returns empty
- **Committed in:** 1ba73c9 (Task 2 commit)

**2. [Rule 1 - Bug] Three beat texts contained banned phrases causing STORY-02/STORY-03 test failures**
- **Found during:** Task 2 (first GREEN test run)
- **Issue:** beat-2b had "her hair", beat-2c had "his face" and "his eyes", beat-5 had "ive" (substring of "arrived")
- **Fix:** Rephrased NPC descriptions to avoid banned phrases; changed "arrived" to "are here" in beat-5
- **Files modified:** src/data/chapter1.ts (prose only — types and graph structure unchanged)
- **Verification:** All 8 chapter1.test.ts tests pass after fixes
- **Committed in:** 1ba73c9 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for correctness and passing tests. No scope creep.

## Issues Encountered

Pre-existing LandingPage test failure (LandingPage.test.tsx "renders hero headline") was present before this plan's changes. Text is split across a `<br />` element causing the regex matcher to fail. Logged to deferred items — out of scope for this plan.

## Next Phase Readiness

- chapter1.ts is ready for Plan 04-02 to replace skeleton beat prose with full authored content
- All 9 beats have valid graph structure; plan 04-02 can safely replace `text` fields
- beat-2b-2 and beat-3 (prose-only connector beats) are in place to exercise the READ-03 fix
- beat-5 has isChapterEnd: true — chapter traversal terminates correctly
- beat-4 adds a second choice moment (2 choices → beat-5) for minimum 3 branching points requirement

---
*Phase: 04-static-story-content*
*Completed: 2026-03-28*
