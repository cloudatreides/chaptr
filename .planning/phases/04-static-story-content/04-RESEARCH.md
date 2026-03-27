# Phase 4: Static Story Content - Research

**Researched:** 2026-03-28
**Domain:** Static story state machine, React local state, modal patterns, prose content authoring
**Confidence:** HIGH

## Summary

Phase 4 is a code-and-content phase with no new library dependencies. Every tool is already installed and proven in earlier phases. The work divides cleanly into two concerns: (1) wiring the story state machine correctly — fixing the READ-03 gap and extending types — and (2) authoring the full Chapter 1 prose that runs through that machine.

The existing `StoryBeat/StoryChoice` type system in `src/data/mockStoryData.ts` is almost complete. The only structural gap is that `StoryBeat` lacks a `nextBeatId?: string` field to support prose-only (no-choice) beats. `StoryChoice` already carries `nextBeatId` for choice-driven advancement. Adding `nextBeatId` to `StoryBeat` and fixing the `onAdvance` stub in `StoryReaderPage.tsx` (lines 114-122) closes READ-03 and makes prose-only beats functional.

The name prompt modal can be built directly from the `SelfieUploadModal` pattern: `AnimatePresence` + `motion.div` backdrop + centered panel in `bg-surface rounded-2xl`. It is a single-screen modal (no step state needed) with one input and a "Start reading" CTA. The chapter-end overlay lives inside `StoryReaderPage` conditional on `currentBeat.isChapterEnd === true` and follows the same Framer Motion pattern.

**Primary recommendation:** Complete Plan 04-01 (types + READ-03 fix + data file skeleton) before writing a single line of prose. This prevents authoring beats that cannot be rendered.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### State Machine Architecture
- Extend existing `StoryBeat/StoryChoice` types — add `nextBeatId?: string` to StoryBeat for prose-only beats; no new node union types needed
- New file `src/data/chapter1.ts` exports the final Chapter 1 data; delete `mockStoryData.ts` entirely
- READ-03 fix in Plan 04-01 — close the gap early so prose-only beats work before content authoring begins
- Keep `currentBeatId` as local `useState` in `StoryReaderPage` — story traversal is session-level, only choices go to Zustand

#### Chapter 1 Content Depth
- ~9 beats total: opening beat → 3 branch paths (2 beats each, including Mina on hang-back path) → converge at mid-chapter beat → 1 final choice → chapter end beat
- 1-2 prose-only beats (scene transitions, e.g. elevator ride to Studio B) — exercises READ-03 fix meaningfully
- Reuse and extend existing mock prose (beat-1 through beat-3 are well-written) — fill the gap between branch beats and chapter end
- Mina (blue-streaked hair trainee from beat-2b) appears in 2 beats on the "hang back" path as a foil to Jiwoo's cool demeanor

#### Chapter End & Navigation
- Show chapter-end overlay in `StoryReaderPage` when `currentBeat.isChapterEnd === true` — pulsing "Chapter Complete" display, sidebar decision log CTA, tease of next chapter
- Name prompt modal on `/story/chapter-1` if `userName` is null — single input field, "Start reading" button, dismissible
- Colored gradient placeholder per beat category (lobby/office = gold-purple, corridor = cool blue, studio = warm rose) via Tailwind `bg-gradient-to-b` classes in SceneImage
- Hardcode `/story/chapter-1` → `chapter1` data in StoryReaderPage — no chapter registry needed for PoC

### Claude's Discretion
- Exact prose length per beat (target 150-250 words)
- Exact gradient colors used for each beat's scene image placeholder
- Secondary chapter-end teaser copy
- Name prompt modal visual design (match existing modal patterns)

### Deferred Ideas (OUT OF SCOPE)
- Chapter registry (map chapterId → Chapter) — not needed for PoC with single chapter
- Cross-session chapter resume via Zustand persist — deferred to V2
- Real illustrated scene art — out of scope per PROJECT.md constraints
- Chapter 2+ content — deferred until AI engine validated in Phase 5
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| STORY-01 | Static story graph for Chapter 1 — trainee life framing, enemies-to-lovers with Jiwoo; first choice within first 300 words; 3–5 choices total; chapter ends on emotional hook | `nextBeatId` on StoryBeat enables prose-only beats; existing `StoryChoice.nextBeatId` drives choice advancement; `isChapterEnd` flag on final beat |
| STORY-02 | Second-person present tense; `[Name]` placeholder renders the user's name; no protagonist physical description | `TypewriterText` already does `text.replace(/\[Name\]/g, userName ?? 'you')` — authoring just needs to follow conventions |
| STORY-03 | Original fictional world only: NOVA Entertainment, VEIL, no real celebrity names | Content authoring constraint — enforced by prose guidelines in RESEARCH; name prompt modal provides `userName` for `[Name]` substitution |
| STORY-04 | Chapter 1 fully playable end-to-end with static content before AI integration | Full graph with no undefined `nextBeatId` references; READ-03 fix ensures prose-only beats advance correctly |
</phase_requirements>

---

## Standard Stack

All libraries already installed. No new dependencies required for this phase.

### Core (already in project)
| Library | Version | Purpose | Relevance to Phase 4 |
|---------|---------|---------|----------------------|
| React | 19.2.4 | Component rendering | `useState` for local beat tracking, modal state |
| Framer Motion | 12.38.0 | Animations | Chapter-end overlay entrance, name prompt modal |
| Zustand | 5.0.12 | Persisted state | `userName` read; `logDecision` / `recordChoice` write |
| TypeScript | 5.9.3 | Type safety | Extending `StoryBeat` type with `nextBeatId?: string` |
| Tailwind CSS v3 | 3.4.19 | Styling | Gradient classes for scene image placeholders |

### No New Installs
This phase is purely code authoring + type extension. Zero new npm packages.

---

## Architecture Patterns

### Story Graph Data Structure

The existing pattern in `mockStoryData.ts` is the authoritative reference. The file exports a `Chapter` object with `beats: Record<string, StoryBeat>` and `startBeatId`. The planner must:

1. Add `nextBeatId?: string` to the `StoryBeat` type
2. Create `src/data/chapter1.ts` with the full graph
3. Delete `src/data/mockStoryData.ts`
4. Update all imports (`StoryReaderPage.tsx`, `ChoiceList.tsx`) from `mockStoryData` → `chapter1`

```typescript
// Extended StoryBeat type (src/data/chapter1.ts)
export type StoryBeat = {
  id: string;
  text: string;
  sceneImage?: string;
  choices: StoryChoice[];
  nextBeatId?: string;       // NEW — for prose-only beats with no choices
  isChapterStart?: boolean;
  isChapterEnd?: boolean;
};
```

### READ-03 Fix Pattern

The current `onAdvance` stub in `StoryReaderPage.tsx` (lines 114-122) has a comment placeholder but no actual advancement logic. The fix is minimal:

```typescript
// StoryReaderPage.tsx — onAdvance prop fix
onAdvance={() => {
  if (
    currentBeat.choices.length === 0 &&
    !currentBeat.isChapterEnd &&
    currentBeat.nextBeatId
  ) {
    advanceBeat(currentBeat.nextBeatId);
  }
}}
```

This is guarded by three conditions: no choices, not chapter end, and nextBeatId is defined. Prose-only beats without a `nextBeatId` will not advance (intentional dead end guard).

### Chapter 1 Beat Graph

The ~9-beat graph follows this topology:

```
beat-1 (opening, isChapterStart)
  → [choice A] beat-2a (bold intro)
      → [choice] beat-3 (convergence)
  → [choice B] beat-2b (hang back, Mina appears)
      → [choice] beat-2b-2 (Mina path, prose-only transition)
          → nextBeatId: beat-3 (convergence)
  → [choice C, gem-gated] beat-2c (direct Jiwoo confrontation)
      → [choice] beat-3 (convergence)

beat-3 (convergence mid-chapter, prose-only elevator ride)
  → nextBeatId: beat-4

beat-4 (corridor arrival + 1 final choice)
  → [choice] beat-5 (chapter end, isChapterEnd: true)
  → [choice] beat-5 (same chapter end — both paths merge)
```

Note: beat-2b introduces Mina; beat-2b-2 is the prose-only scene transition that exercises the READ-03 fix. Beat-3 can also be prose-only (elevator ride). This gives 1-2 prose-only beats as specified.

### Name Prompt Modal Pattern

Model directly on `SelfieUploadModal.tsx`. Key structural elements to replicate:

```typescript
// Pattern from SelfieUploadModal.tsx
<AnimatePresence>
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <motion.div
      className="absolute inset-0 bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      // NOTE: clicking backdrop dismisses for selfie modal
      // Name prompt should NOT be dismissible by backdrop tap per spec
      // (must enter a name before reading)
    />
    <motion.div
      role="dialog"
      aria-modal="true"
      className="relative bg-surface rounded-2xl max-w-[440px] w-full mx-4 p-8"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* single input + "Start reading" CTA */}
    </motion.div>
  </div>
</AnimatePresence>
```

The name prompt shows on mount when `userName === null`. It calls `store.setUserName(name)` on submit and removes itself from the DOM. A local `showNamePrompt` state in `StoryReaderPage` is initialized from `userName === null`.

### Chapter-End Overlay Pattern

Renders inside `StoryReaderPage` over the normal content when `currentBeat.isChapterEnd === true`. Uses Framer Motion `AnimatePresence` + `motion.div` for fade-in entrance. Contains:
- "Chapter Complete" heading (pulsing or fade-in animation)
- Key decision count / sidebar CTA
- Next chapter tease copy (Claude's discretion)

The overlay should use `fixed inset-0` or be rendered after the main reading column. Given the existing `lg:pl-[280px]` offset pattern, a centered overlay on top of the page content is the cleanest approach.

### SceneImage Gradient Pattern

`SceneImage.tsx` already has a fallback gradient when `src` is undefined:
```tsx
<div className="h-full w-full bg-gradient-to-b from-purple-accent/20 to-base" />
```

The plan should pass a `sceneCategory` prop or simply pass the gradient class as part of a `sceneImageClass` string — or more simply, define the gradient inline per beat in the data file as a CSS class name string stored alongside `sceneImage`. However, the simplest approach that avoids changing `SceneImage` props is to extend the `StoryBeat` type with an optional `sceneGradient?: string` field and thread it into `SceneImage` as an additional prop.

Alternatively, pass `undefined` for `src` and accept the default gradient on all beats (minimum viable). The per-beat gradient differentiation is Claude's discretion per CONTEXT.md.

### Anti-Patterns to Avoid

- **Moving beat traversal to Zustand:** Beat traversal is local `useState` by locked decision. Only `recordChoice` and `logDecision` write to the store.
- **Creating a chapter registry:** Hardcode `chapter1` directly in `StoryReaderPage` — no abstraction needed for PoC.
- **Authoring beats before fixing READ-03:** If prose-only beats are authored before the `onAdvance` fix, they will appear as dead ends during local testing, causing confusion.
- **Using `StoryChoice.nextBeatId` for prose-only transitions:** `StoryChoice.nextBeatId` already exists and is correct for choice-driven advancement. `StoryBeat.nextBeatId` is the NEW field exclusively for prose-only beats. These are distinct; do not conflate them.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal backdrop + animation | Custom CSS transitions | Framer Motion `AnimatePresence` + `motion.div` | Already installed; matches existing `SelfieUploadModal` pattern exactly |
| Name persistence | Custom localStorage hook | `useChaptrStore` `setUserName` / `userName` | Already wired in Zustand with v3 schema |
| `[Name]` substitution | New regex logic | `TypewriterText.tsx` line 16 already does this | Authoring just needs to include `[Name]` tokens in prose |
| Beat progress tracking | New state | Existing `visitedBeats` / `totalBeats` in `StoryReaderPage` | Progress bar already correct; just needs accurate total from new chapter data |

**Key insight:** The entire reader infrastructure is already built. Phase 4 is wiring and content, not framework work.

---

## Common Pitfalls

### Pitfall 1: Broken beat references in the graph
**What goes wrong:** A `nextBeatId` or `StoryChoice.nextBeatId` references a beat ID that doesn't exist in `chapter1.beats`, causing `chapter.beats[currentBeatId]` to return `undefined` and crash the reader.
**Why it happens:** Prose authoring is iterative; beat IDs change or get misspelled.
**How to avoid:** After authoring all beats, enumerate every `nextBeatId` across all beats and choices, and verify each one exists as a key in the `beats` record. A simple validation script or a unit test covers this.
**Warning signs:** `currentBeat` is `undefined` in the reader; TypeScript won't catch this at the data layer because `beats` is `Record<string, StoryBeat>` (non-exhaustive).

### Pitfall 2: Orphaned beats (beats with no path leading to them)
**What goes wrong:** A beat is defined in the data but no `nextBeatId` or `StoryChoice.nextBeatId` points to it. The beat is unreachable.
**Why it happens:** Renaming a beat ID during authoring without updating all references.
**How to avoid:** Draw the graph topology before writing prose. Verify every beat is reachable from `startBeatId`.
**Warning signs:** Reduced `totalBeats` count vs. expected graph size; progress bar math is off.

### Pitfall 3: READ-03 fix missing the `nextBeatId` guard
**What goes wrong:** `onAdvance` calls `advanceBeat(currentBeat.nextBeatId!)` without checking if `nextBeatId` is defined, causing advancement to `undefined` → crash.
**Why it happens:** Forgetting the guard in the stub replacement.
**How to avoid:** The fix must check three conditions: `choices.length === 0 && !isChapterEnd && beat.nextBeatId`.

### Pitfall 4: Name prompt allows empty name submission
**What goes wrong:** User submits blank name; `userName` is set to `""` (empty string); `TypewriterText` falls back to `'you'` but `userName` is truthy, so it renders as empty string.
**Why it happens:** Input validation not added to the name prompt form.
**How to avoid:** Trim the input value and guard `name.trim().length > 0` before calling `setUserName`.

### Pitfall 5: First choice appears after 300 words (STORY-01 violation)
**What goes wrong:** The opening beat prose is authored too long, causing the first choice to appear past the 300-word threshold.
**Why it happens:** Prose naturally grows during authoring.
**How to avoid:** Count words in beat-1 prose before finalizing. The existing beat-1 in `mockStoryData.ts` is ~160 words — well within limit. Keep it as-is or trim if extending.

### Pitfall 6: `ChoiceList.tsx` import path breaks after mockStoryData deletion
**What goes wrong:** `ChoiceList.tsx` line 2 imports `StoryChoice` from `../../data/mockStoryData`. After deletion, the import breaks.
**Why it happens:** Types are currently defined in `mockStoryData.ts`; the new `chapter1.ts` must re-export or re-define them.
**How to avoid:** Plan 04-01 must update the import in `ChoiceList.tsx` and any other consumers to point to `chapter1.ts`.

---

## Code Examples

Verified from codebase inspection:

### Beat advancement (existing advanceBeat function)
```typescript
// StoryReaderPage.tsx:43-47
const advanceBeat = (nextBeatId: string) => {
  setSelectedChoiceId(null);
  setCurrentBeatId(nextBeatId);
  setVisitedBeats((v) => v + 1);
};
```

### TypewriterText onAdvance stub (current broken state)
```typescript
// StoryReaderPage.tsx:114-122 — CURRENT (READ-03 gap)
onAdvance={() => {
  // Only advance on text tap if current beat has no choices (prose-only beats)
  if (
    currentBeat.choices.length === 0 &&
    !currentBeat.isChapterEnd
  ) {
    // No auto-advance for prose-only beats without a defined next
  }
}}
```

### [Name] substitution (already working)
```typescript
// TypewriterText.tsx:16
const resolvedText = text.replace(/\[Name\]/g, userName ?? 'you');
```

### Zustand store actions available for phase 4
```typescript
// These are all already wired:
setUserName: (name: string) => void
logDecision: (entry: DecisionLogEntry) => void
recordChoice: (choice: ChoiceRecord) => void
isFirstGemChoiceFree: (chapterId: string) => boolean
setFirstGemChoiceUsed: (chapterId: string) => void
spendGems: (amount: number) => boolean
```

---

## Environment Availability

Step 2.6: SKIPPED — this phase has no external dependencies. All tooling (Vite, React, Framer Motion, Zustand, Tailwind, Vitest) is already installed and proven in Phases 1-3.

---

## Validation Architecture

`workflow.nyquist_validation` is `true` in `.planning/config.json`.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + Testing Library React 16.3.2 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `npx vitest run src/__tests__/chapter1.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STORY-01 | All beat IDs referenced in nextBeatId/choices exist in beats record | unit | `npx vitest run src/__tests__/chapter1.test.ts` | No — Wave 0 |
| STORY-01 | First choice appears within 300 words of beat-1 text | unit | `npx vitest run src/__tests__/chapter1.test.ts` | No — Wave 0 |
| STORY-01 | At least 3 choices branch and resolve (no dead ends) | unit | `npx vitest run src/__tests__/chapter1.test.ts` | No — Wave 0 |
| STORY-02 | No prose contains protagonist physical description | unit | `npx vitest run src/__tests__/chapter1.test.ts` | No — Wave 0 |
| STORY-02 | [Name] token present in at least one beat | unit | `npx vitest run src/__tests__/chapter1.test.ts` | No — Wave 0 |
| STORY-03 | No real celebrity names appear in any beat text | unit | `npx vitest run src/__tests__/chapter1.test.ts` | No — Wave 0 |
| STORY-04 | Full playthrough from startBeatId reaches isChapterEnd without undefined beat | unit | `npx vitest run src/__tests__/chapter1.test.ts` | No — Wave 0 |
| READ-03 | onAdvance advances prose-only beat to nextBeatId | unit (component) | `npx vitest run src/__tests__/StoryReaderPage.test.tsx` | No — Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/chapter1.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/chapter1.test.ts` — covers STORY-01, STORY-02, STORY-03, STORY-04 (graph integrity tests)
- [ ] `src/__tests__/StoryReaderPage.test.tsx` — covers READ-03 onAdvance fix (component render test)

Note: `vitest.config.ts` exists and `setupFiles` is empty — no conftest setup needed. Framer Motion mock pattern from `ChoiceList.test.tsx` can be copied for any component tests.

---

## Import Dependency Map

Files that import from `mockStoryData.ts` (must be updated in Plan 04-01):

| File | Import | New Import |
|------|--------|------------|
| `src/pages/StoryReaderPage.tsx` | `import { mockChapter1 } from '../data/mockStoryData'` | `import { chapter1 } from '../data/chapter1'` |
| `src/pages/StoryReaderPage.tsx` | `import type { StoryChoice } from '../data/mockStoryData'` | `import type { StoryChoice } from '../data/chapter1'` |
| `src/components/reader/ChoiceList.tsx` | `import type { StoryChoice } from '../../data/mockStoryData'` | `import type { StoryChoice } from '../../data/chapter1'` |

---

## Sources

### Primary (HIGH confidence)
- `src/data/mockStoryData.ts` — authoritative type definitions and existing beat graph
- `src/pages/StoryReaderPage.tsx` — exact READ-03 stub location and advanceBeat signature
- `src/components/SelfieUploadModal.tsx` — modal pattern to replicate for name prompt
- `src/components/reader/SceneImage.tsx` — gradient fallback rendering confirmed
- `src/components/reader/ChoiceList.tsx` — import path verified
- `src/hooks/useTypewriter.ts` — typewriter reset behavior on `fullText` change confirmed
- `src/components/reader/TypewriterText.tsx` — [Name] substitution confirmed
- `src/store/useChaptrStore.ts` — all relevant actions confirmed present
- `vitest.config.ts` — test framework config confirmed
- `.planning/config.json` — nyquist_validation: true confirmed

### Secondary (MEDIUM confidence)
- `src/__tests__/ChoiceList.test.tsx` — Framer Motion mock pattern for component tests
- `src/__tests__/useTypewriter.test.ts` — Vitest fake timers pattern for hook tests

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified from package.json and existing usage
- Architecture: HIGH — all patterns read directly from existing source files
- Pitfalls: HIGH — derived from static analysis of actual code, not speculation
- Content guidelines: HIGH — prose rules verified from CONTEXT.md locked decisions and REQUIREMENTS.md

**Research date:** 2026-03-28
**Valid until:** Stable — no external dependencies; valid until codebase changes
