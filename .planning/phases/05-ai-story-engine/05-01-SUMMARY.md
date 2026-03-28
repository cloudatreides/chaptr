---
phase: 05-ai-story-engine
plan: 01
subsystem: api
tags: [claude-api, streaming, sse, async-generator, system-prompt, vitest, tdd]

requires:
  - phase: 03-core-reading-loop
    provides: useTypewriter hook interface, StoryBeat/ChoiceRecord types, Zustand store with choiceHistory
provides:
  - streamBeatProse async generator for Claude API streaming
  - buildSystemPrompt function with Character Bible, Story State, Output Constraints
  - StreamBeatParams type for generator input
  - useStreamingTypewriter skeleton (stub for Plan 02)
  - Test suite covering AI-01 through AI-07
affects: [05-02-streaming-hook-integration]

tech-stack:
  added: []
  patterns: [async-generator-sse-parsing, buffer-guard-split-chunks, abort-error-catch]

key-files:
  created:
    - src/lib/claudeStream.ts
    - src/hooks/useStreamingTypewriter.ts
    - src/__tests__/claudeStream.test.ts
    - src/__tests__/useStreamingTypewriter.test.ts
  modified: []

key-decisions:
  - "Import StoryBeat from mockStoryData.ts (not chapter1.ts) -- actual file name in codebase"
  - "AbortError test mocks fetch rejection rather than reader.read() hang -- jsdom limitation"

patterns-established:
  - "SSE parsing: split on newline, keep last incomplete line in buffer, process data: lines only"
  - "Async generator pattern: yield text deltas, return on message_stop, catch AbortError"
  - "System prompt sections: CHARACTER BIBLE, STORY STATE, CHAPTER BRIEF, OUTPUT CONSTRAINTS"

requirements-completed: [AI-01, AI-02, AI-03, AI-04, AI-05, AI-06, AI-07]

duration: 4min
completed: 2026-03-28
---

# Phase 5 Plan 1: Claude Streaming Client Summary

**Async generator SSE client for Claude Haiku with system prompt containing Character Bible, Story State, and prohibited phrase constraints -- all 9 tests green via TDD**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-28T02:12:55Z
- **Completed:** 2026-03-28T02:17:26Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- `streamBeatProse` async generator streams text deltas from Claude claude-haiku-4-5 via SSE fetch with buffer guard for split chunks
- `buildSystemPrompt` assembles Character Bible (Jiwoo, Mina, NOVA setting), Story State (choice history as bulleted list), and Output Constraints (prohibited phrases, word count, tense)
- Full TDD cycle: 9 failing tests written first, then all made green with implementation
- `useStreamingTypewriter` stub tests ready for Plan 02 (2 tests, expected to fail until hook implementation)

## Task Commits

Each task was committed atomically:

1. **Task 1: Wave 0 -- Test stubs + skeletons (TDD RED)** - `34abc78` (test)
2. **Task 2: Implement claudeStream.ts (TDD GREEN)** - `afc4cd1` (feat)

## Files Created/Modified

- `src/lib/claudeStream.ts` - Async generator for streaming Claude API responses + system prompt builder
- `src/hooks/useStreamingTypewriter.ts` - Skeleton with types (implementation in Plan 02)
- `src/__tests__/claudeStream.test.ts` - 9 unit tests covering model ID, headers, prompt sections, text yields, split chunks, abort, message_stop
- `src/__tests__/useStreamingTypewriter.test.ts` - 2 stub tests for hook interface and static beat fallback

## Decisions Made

- **Import path:** StoryBeat imported from `mockStoryData.ts` (actual filename) instead of `chapter1.ts` (plan reference was outdated)
- **AbortError test approach:** Mocked fetch rejection with DOMException rather than testing reader.read() abort, since jsdom does not propagate AbortSignal to ReadableStream reader in Node

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed import path for StoryBeat type**
- **Found during:** Task 1
- **Issue:** Plan referenced `src/data/chapter1.ts` but actual file is `src/data/mockStoryData.ts`
- **Fix:** Used correct import path `../data/mockStoryData` in all files
- **Files modified:** src/lib/claudeStream.ts, src/hooks/useStreamingTypewriter.ts, src/__tests__/claudeStream.test.ts, src/__tests__/useStreamingTypewriter.test.ts
- **Verification:** All imports resolve, tests compile and run
- **Committed in:** 34abc78 (Task 1)

**2. [Rule 1 - Bug] Fixed AbortError test to work in jsdom/vitest**
- **Found during:** Task 2
- **Issue:** Test used a never-closing ReadableStream expecting abort to unblock reader.read(), but jsdom does not propagate AbortSignal to ReadableStream -- test timed out at 5000ms
- **Fix:** Changed test to mock fetch itself rejecting with DOMException('AbortError') which tests the same catch path
- **Files modified:** src/__tests__/claudeStream.test.ts
- **Verification:** Test passes in < 10ms
- **Committed in:** afc4cd1 (Task 2)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for correct test execution. No scope creep.

## Issues Encountered

None beyond the auto-fixed deviations.

## User Setup Required

None - no external service configuration required. API key (`VITE_ANTHROPIC_API_KEY`) setup was done in a prior phase.

## Known Stubs

- `src/hooks/useStreamingTypewriter.ts` - Throws 'Not implemented'. Intentional stub -- implementation comes in Plan 02 (05-02).

## Next Phase Readiness

- `claudeStream.ts` is complete and tested -- ready for Plan 02 to build `useStreamingTypewriter` hook on top
- `useStreamingTypewriter.test.ts` stubs provide the test targets for Plan 02

---
*Phase: 05-ai-story-engine*
*Completed: 2026-03-28*
