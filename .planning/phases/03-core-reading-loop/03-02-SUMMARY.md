---
phase: 03-core-reading-loop
plan: 02
subsystem: ui
tags: [react, framer-motion, vaul, typewriter, choices, gems, tailwind]

requires:
  - phase: 03-01
    provides: "useTypewriter hook, StoryReaderPage scaffold, mock data, Zustand store with gem/decision/sidebar state"
provides:
  - "TypewriterText component with two-tap skip mechanic and name replacement"
  - "ChoiceButton with default/selected/unchosen/locked states and gem badge"
  - "ChoiceList with Framer Motion stagger, isComplete gate, gem state logic"
  - "GemGateSheet Vaul drawer at 50% snap for insufficient gems"
  - "Full choice flow wired in StoryReaderPage with spendGems, logDecision, recordChoice"
affects: [03-core-reading-loop]

tech-stack:
  added: []
  patterns:
    - "Vaul Drawer with snapPoints [0.5, 1] for bottom sheet UX"
    - "ChoiceButton state pattern: default/selected/unchosen/locked"
    - "ChoiceList stagger animation via Framer Motion containerVariants/itemVariants"

key-files:
  created:
    - src/components/reader/TypewriterText.tsx
    - src/components/reader/ChoiceButton.tsx
    - src/components/reader/ChoiceList.tsx
    - src/components/reader/GemGateSheet.tsx
    - src/__tests__/ChoiceList.test.tsx
  modified:
    - src/pages/StoryReaderPage.tsx

key-decisions:
  - "TypewriterText receives pre-rendered displayedText from parent (useTypewriter stays in page)"
  - "ChoiceList uses useChaptrStore.getState() for gem checks to avoid re-render thrashing"

patterns-established:
  - "Vaul Drawer pattern: snapPoints=[0.5,1], overlay bg-black/40, content bg-surface rounded-t-2xl"
  - "Choice state derivation: selected/unchosen based on selectedChoiceId, locked based on gem balance"

requirements-completed: [READ-02, READ-03, READ-04, READ-05, READ-06, READ-07]

duration: 2min
completed: 2026-03-27
---

# Phase 3 Plan 2: Choice Mechanic & Gem Gate Summary

**Typewriter text component with two-tap skip, choice buttons with selected/unchosen/locked/gem-gated states, and Vaul bottom sheet for insufficient gems**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-27T14:49:10Z
- **Completed:** 2026-03-27T14:51:31Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- TypewriterText component with two-tap mechanic (skip on first tap, advance on second), name replacement, and aria-live accessibility
- ChoiceButton with four visual states: default, selected (rose gradient + left accent), unchosen (30% opacity), locked (gold border + gem badge)
- ChoiceList with Framer Motion stagger animation, isComplete gate (returns null until typewriter finishes), and gem state derivation
- GemGateSheet using Vaul Drawer with snapPoints [0.5, 1], showing gem cost, current balance, and "Get More Gems" placeholder CTA
- Full choice flow wired in StoryReaderPage: gem spending, first-free-per-chapter logic, decision logging, choice recording, and 600ms delay before beat advance

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TypewriterText, ChoiceButton, ChoiceList, GemGateSheet and wire into StoryReaderPage** - `05818c6` (feat)
2. **Task 2: Create ChoiceList test covering READ-04** - `b387c58` (test)

## Files Created/Modified
- `src/components/reader/TypewriterText.tsx` - Typewriter text display with two-tap skip, name replacement, paragraph splitting
- `src/components/reader/ChoiceButton.tsx` - Single choice button with 4 states and gem badge variant
- `src/components/reader/ChoiceList.tsx` - Choice container with stagger animation, isComplete gate, gem state derivation
- `src/components/reader/GemGateSheet.tsx` - Vaul bottom sheet for insufficient gems at 50% snap
- `src/pages/StoryReaderPage.tsx` - Wired all new components replacing inline placeholder buttons
- `src/__tests__/ChoiceList.test.tsx` - 4 tests covering choices-hidden-until-complete and gem badge rendering

## Decisions Made
- TypewriterText receives pre-rendered displayedText from parent rather than running useTypewriter internally -- keeps hook ownership in StoryReaderPage where beat advancement logic lives
- ChoiceList uses useChaptrStore.getState() for gem balance/free-choice checks to avoid unnecessary re-renders during choice state derivation

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None - all components are fully wired to the Zustand store and render real state.

## Next Phase Readiness
- Choice mechanic complete; ready for Plan 03-03 (Your Story sidebar + desktop layout)
- All 122 tests passing across the full suite

---
*Phase: 03-core-reading-loop*
*Completed: 2026-03-27*
