# Phase 4: Static Story Content - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Build and wire the full static story state machine for Chapter 1 of "The Seoul Transfer". This phase delivers: typed story graph data structure, READ-03 gap fix, full Chapter 1 prose (~9 beats), chapter-end overlay, and name prompt on story entry. No AI generation — all content is static. Phase 5 replaces static beats with Claude Haiku streaming.

</domain>

<decisions>
## Implementation Decisions

### State Machine Architecture
- Extend existing `StoryBeat/StoryChoice` types — add `nextBeatId?: string` to StoryBeat for prose-only beats; no new node union types needed
- New file `src/data/chapter1.ts` exports the final Chapter 1 data; delete `mockStoryData.ts` entirely
- READ-03 fix in Plan 04-01 — close the gap early so prose-only beats work before content authoring begins
- Keep `currentBeatId` as local `useState` in `StoryReaderPage` — story traversal is session-level, only choices go to Zustand

### Chapter 1 Content Depth
- ~9 beats total: opening beat → 3 branch paths (2 beats each, including Mina on hang-back path) → converge at mid-chapter beat → 1 final choice → chapter end beat
- 1-2 prose-only beats (scene transitions, e.g. elevator ride to Studio B) — exercises READ-03 fix meaningfully
- Reuse and extend existing mock prose (beat-1 through beat-3 are well-written) — fill the gap between branch beats and chapter end
- Mina (blue-streaked hair trainee from beat-2b) appears in 2 beats on the "hang back" path as a foil to Jiwoo's cool demeanor

### Chapter End & Navigation
- Show chapter-end overlay in `StoryReaderPage` when `currentBeat.isChapterEnd === true` — pulsing "Chapter Complete" display, sidebar decision log CTA, tease of next chapter
- Name prompt modal on `/story/chapter-1` if `userName` is null — single input field, "Start reading" button, dismissible
- Colored gradient placeholder per beat category (lobby/office = gold-purple, corridor = cool blue, studio = warm rose) via Tailwind `bg-gradient-to-b` classes in SceneImage
- Hardcode `/story/chapter-1` → `chapter1` data in StoryReaderPage — no chapter registry needed for PoC

### Claude's Discretion
- Exact prose length per beat (target 150-250 words)
- Exact gradient colors used for each beat's scene image placeholder
- Secondary chapter-end teaser copy
- Name prompt modal visual design (match existing modal patterns)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useChaptrStore` — Zustand store with `recordChoice`, `logDecision`, `setUserName`, `userName` already wired
- `StoryReaderPage.tsx` — full reader layout already built; `handleChoiceSelect` handles gem gates, choice logging, beat advancement
- `TypewriterText.tsx` — renders text with `[Name]` replacement; `onSkip` and `onAdvance` props exist
- `SceneImage.tsx` — accepts `src?: string`, handles undefined gracefully with gradient fallback
- `SelfieUploadModal.tsx` — reusable modal pattern for the name prompt

### Established Patterns
- Story types in `src/data/` (not in store or components)
- `currentBeatId` local state drives render; `advanceBeat(nextBeatId)` resets choice state and increments visited count
- Zustand `recordChoice` + `logDecision` called from `handleChoiceSelect` — keep this pattern for new beats
- Framer Motion used for choice transitions; keep existing animation patterns

### Integration Points
- `StoryReaderPage.tsx:24` — replace `import { mockChapter1 } from '../data/mockStoryData'` with `import { chapter1 } from '../data/chapter1'`
- `StoryReaderPage.tsx:114-122` — READ-03 fix: `onAdvance` stub needs to call `advanceBeat(beat.nextBeatId!)` when `choices.length === 0 && !isChapterEnd && beat.nextBeatId`
- New chapter-end overlay renders conditionally when `currentBeat.isChapterEnd === true`
- Name prompt modal renders on mount if `userName === null`

</code_context>

<specifics>
## Specific Ideas

- Story universe: "The Seoul Transfer" — NOVA Entertainment, group VEIL, lead Jiwoo, trainee Mina (original fictional characters only)
- Prose style: second-person present tense ("You step into..."), `[Name]` for protagonist, no physical description of protagonist
- Jiwoo characterization: cool/intimidating with warmth underneath — not hostile, not immediately charming
- Existing beat-1 prose is keeper quality; the opening lobby scene sets the tone well
- Chapter end hook: protagonist has made it to Studio B and sees VEIL in practice — end on anticipation, not resolution

</specifics>

<deferred>
## Deferred Ideas

- Chapter registry (map chapterId → Chapter) — not needed for PoC with single chapter
- Cross-session chapter resume via Zustand persist — deferred to V2
- Real illustrated scene art — out of scope per PROJECT.md constraints
- Chapter 2+ content — deferred until AI engine validated in Phase 5

</deferred>
