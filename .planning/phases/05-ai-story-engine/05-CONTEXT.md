# Phase 5: AI Story Engine - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace static beat prose with Claude Haiku streaming. Beat-1 (opening) stays static. All continuation beats after a choice trigger a Claude API call that streams prose via SSE. Choices remain static in `chapter1.ts`. The static prose is retained as fallback text if the API fails. `isChapterEnd` and choice graph stay in static data — Claude generates prose only, never state decisions.

</domain>

<decisions>
## Implementation Decisions

### API Key & Error Handling
- API key stored as `VITE_ANTHROPIC_API_KEY` in `.env.local` (standard Vite env var pattern)
- Streaming client: custom `fetch` + manual SSE parsing — no Anthropic SDK added to browser bundle
- Error handling: silent fallback to static beat prose from `chapter1.ts` when API call fails — UX stays unbroken
- Prohibited phrase enforcement via system prompt only — no client-side post-processing

### What AI Generates vs. What Stays Static
- Beat-1 (opening) stays static — AI kicks in only on continuation beats after a choice
- Choices remain static in `chapter1.ts` (per AI-04: Claude generates prose only, app manages all state)
- `chapter1.ts` beat prose fields retained as runtime fallback text — AI output replaces them at runtime, static prose serves as error fallback
- Beat-5 (chapter end): AI generates the final beat prose; `isChapterEnd` flag remains in static data

### System Prompt Architecture
- Character Bible: ~200 words — Jiwoo (personality, speech, dynamic), Mina (secondary), NOVA setting, K-pop trainee tone
- Story State Block: bulleted list of choices made — "Beat 1 → [choice label]", "Beat 3 → [choice label]" — human-readable for Claude
- Chapter Brief: current beat ID + scene setting (lobby/corridor/studio) + "what just happened" — injected dynamically per call
- Output constraint: "Write exactly one prose paragraph of 80–120 words, second-person present tense, no choices, no dialogue tags after prose"
- Prohibited phrases in system prompt: "her heart skipped a beat", "suddenly", "she couldn't help but"

### Streaming UX Integration
- New `useStreamingTypewriter` hook — accumulates streamed chunks, drives character-by-character reveal matching current typewriter behavior
- Loading shimmer disappears when first SSE chunk arrives — `isStreaming` → false, typewriter starts
- Tap-to-complete: first tap during active stream cancels fetch + shows full buffered text instantly; second tap advances beat (same two-tap mechanic as static typewriter)
- Streaming logic lives in `src/lib/claudeStream.ts` — standalone async generator, called by StoryReaderPage

### Claude's Discretion
- Exact SSE parsing implementation (line splitting, `data:` prefix handling, `[DONE]` sentinel)
- Buffer guard implementation details for split chunks
- Exact system prompt wording within agreed architecture
- AbortController integration for tap-cancel

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useChaptrStore` — `choiceHistory: ChoiceRecord[]` already tracks all choices with nodeId, choiceIndex, label, timestamp — ready to inject into Claude system prompt
- `LoadingSkeleton` component — loading shimmer already implemented, used in StoryReaderPage
- `useTypewriter` hook — character-by-character text reveal; new `useStreamingTypewriter` should mirror its interface (`displayedText`, `isComplete`, `completeInstantly`)
- `StoryReaderPage` — `isLoading` state currently `useState(false)` (unused) — wire to streaming state
- `chapter1.ts` — `StoryBeat.text` fields serve as fallback prose; `StoryBeat.nextBeatId` and `choices[].nextBeatId` remain static routing

### Established Patterns
- State management via Zustand with persist middleware (`useChaptrStore`)
- Framer Motion for animations throughout (typewriter, choice transitions, modal overlays)
- TypeScript strict mode — all new code must be TypeScript clean
- Vitest + Testing Library for tests

### Integration Points
- `StoryReaderPage.tsx` — primary integration point: swap `useTypewriter` for `useStreamingTypewriter` on continuation beats, wire `isLoading` to streaming state, use static text for beat-1
- `src/lib/claudeStream.ts` — new file, async generator, consumed by StoryReaderPage
- `src/hooks/useStreamingTypewriter.ts` — new hook, replaces `useTypewriter` for AI-generated beats
- `.env.local` — `VITE_ANTHROPIC_API_KEY` (not committed)

</code_context>

<specifics>
## Specific Ideas

- The streaming client should be a standalone `async function* streamBeatProse(...)` generator — makes it easy to cancel via AbortController and test independently
- `useStreamingTypewriter` interface should be a drop-in replacement for `useTypewriter` so StoryReaderPage changes are minimal
- The system prompt Character Bible should establish that Jiwoo's speech is "direct, low-key, occasionally dry" — consistent with how he appears in the static beats
- Beat-1 detection: check `currentBeat.isChapterStart === true` to decide static vs. AI path

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
