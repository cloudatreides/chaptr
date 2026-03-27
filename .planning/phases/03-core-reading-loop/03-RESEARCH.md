# Phase 3: Core Reading Loop - Research

**Researched:** 2026-03-27
**Domain:** React interactive reader UI (typewriter animation, choice mechanics, drawer components, responsive layout)
**Confidence:** HIGH

## Summary

Phase 3 transforms the placeholder `StoryReaderPage.tsx` into the full interactive reading experience. The work spans three domains: (1) layout and visual states (scene image, progress bar, loading shimmer, 3-column desktop), (2) typewriter text animation with two-tap skip and choice rendering, and (3) gem economy with Vaul-based bottom sheets and a decision sidebar.

The existing codebase already has Zustand with persist (schema v2), Framer Motion, Tailwind v3 with custom color tokens, and React Router v7 routing to `/story/:chapterId`. The store already has `gemBalance: 30`, `spendGems()`, `choiceHistory`, and `recordChoice()` -- meaning substantial gem and choice tracking infrastructure is already in place. New state needed: `decisionLog`, `sidebarOpen`, `firstGemChoiceUsed` per chapter tracking.

**Primary recommendation:** Build mobile-first, layer desktop at `lg:` breakpoint. Use recursive `setTimeout` for typewriter (not Framer Motion staggerChildren despite what READ-02's description mentions -- the actual implementation spec is setTimeout with isCancelledRef). Install `vaul` for the bottom sheet components (sidebar + gem gate).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Scene image: full-width at top, fixed height 40vh, content scrolls below
- Progress bar: thin 2px rose-accent bar at very top
- Loading shimmer: dark shimmer on bg-surface for text lines + angular spinner on scene image
- Protagonist overlay (VIZ-02): mix-blend-mode: luminosity on selfie thumbnail, only on chapter cover + completion screen
- Typewriter: recursive setTimeout with isCancelledRef guard (React Strict Mode safe)
- Two-tap skip: tap anywhere on text area completes text; second tap advances beat
- Choice layout: stacked vertical, full-width buttons with subtle border
- Gem badge: inline gold pill on right side of locked choice button
- Gem counter: top-right of reader nav bar, gold icon + number
- Gem-gate bottom sheet: Vaul with snapPoints [0.5, 1], slides up 50%
- Sidebar desktop: fixed left panel 280px wide, always visible at lg: (1024px)
- Decision log entry: "Ch.1 . [choice summary text]" with rose dot indicator
- Desktop breakpoint: lg: (1024px), 3-column layout (280px sidebar + 680px column + remaining)
- Reading column max-width: 680px centered
- Reader nav bar: gem counter (top-right) + "Your Story" trigger (top-left mobile) + chapter title (center)

### Claude's Discretion
- Exact shimmer animation keyframes and timing
- Vaul backdrop opacity and transition
- Decision timeline entry hover/active states
- Gem bottom sheet visual design beyond copy

### Deferred Ideas (OUT OF SCOPE)
- Real gem purchase flow (placeholder only)
- Animated scene transitions between beats
- Full mobile polish for sidebar (iOS Safari snap behavior)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| READ-01 | Reader screen layout: scene image, 680px column, choices, gem counter, sidebar trigger | Layout architecture pattern with responsive breakpoints |
| READ-02 | Typewriter text animation via recursive setTimeout with isCancelledRef | useTypewriter hook pattern documented below |
| READ-03 | Two-tap skip: first tap completes, second advances | State machine pattern in useTypewriter |
| READ-04 | Choices appear only after typewriter completes | isComplete flag from useTypewriter gates choice rendering |
| READ-05 | 2-3 choices per beat, gem badge on locked, first gem-gated free per chapter | Zustand firstGemChoiceUsed tracking per chapter |
| READ-06 | Selected choice rose gradient, unchosen 30% opacity | Tailwind conditional classes + Framer Motion animate |
| READ-07 | Locked choice gate: Vaul bottom sheet, not full-screen | Vaul Drawer with snapPoints [0.5, 1] |
| READ-08 | Loading state: shimmer, spinner, skeleton text | Tailwind animate-pulse + custom keyframes |
| READ-09 | Progress bar at top of reader | 2px bar with width% based on beat progress |
| SIDE-01 | Sidebar: Vaul bottom sheet on mobile, left panel on desktop | Responsive conditional rendering at lg: breakpoint |
| SIDE-02 | Chapter timeline with decision moments | Zustand decisionLog array |
| SIDE-03 | Timeline entry: chapter number, summary, option chosen | DecisionLogEntry type |
| GEM-01 | Gem counter in reader top-right, initialized at 30 | Already exists in store (gemBalance: 30) |
| GEM-02 | Spending deducts from Zustand balance | Already exists (spendGems action) |
| GEM-03 | Gem balance persists in localStorage | Already exists (persist middleware) |
| VIZ-01 | Scene images with silhouette protagonist | Static placeholder artwork, gradient placeholder for PoC |
| VIZ-02 | Selfie overlay on protagonist silhouette | CSS position absolute + mix-blend-mode: luminosity |
| DESK-01 | Desktop 1440px: left sidebar + 680px column + scene image | 3-column flex layout at lg: breakpoint |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | 19.2.4 | UI framework | Already in project |
| zustand | 5.0.12 | State management | Already configured with persist middleware |
| framer-motion | 12.38.0 | Choice animations, fade transitions | Already in project, established patterns |
| tailwindcss | 3.4.19 | Styling (responsive breakpoints, utility classes) | Already configured with custom tokens |
| lucide-react | 1.7.0 | Icons (gem icon, sidebar trigger, spinner) | Already in project |

### To Install
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vaul | 1.1.2 | Bottom sheet drawer (gem gate + sidebar mobile) | Decision from CONTEXT.md; 369k+ projects use it; unstyled, composable |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vaul | Custom bottom sheet | Vaul handles touch gestures, snap points, backdrop -- hand-rolling is weeks of work |
| recursive setTimeout | Framer Motion staggerChildren | setTimeout gives character-level control + isCancelledRef for instant-complete; FM stagger is word/element level |

**Installation:**
```bash
npm install vaul@1.1.2
```

**Note:** Vaul is marked unmaintained by its author as of late 2024, but at v1.1.2 it is stable and widely used. No breaking issues with React 19. For this PoC, it is the right choice.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── reader/
│   │   ├── StoryReader.tsx        # Main reader container (orchestrates all reader sub-components)
│   │   ├── SceneImage.tsx         # 40vh scene image with protagonist overlay
│   │   ├── ReaderNavBar.tsx       # Top nav: sidebar trigger, chapter title, gem counter
│   │   ├── ProgressBar.tsx        # 2px rose bar at very top
│   │   ├── TypewriterText.tsx     # Renders text using useTypewriter hook
│   │   ├── ChoiceList.tsx         # Renders choice buttons (locked/unlocked/selected/dimmed)
│   │   ├── ChoiceButton.tsx       # Single choice with gem badge variant
│   │   ├── GemCounter.tsx         # Gold gem icon + balance number
│   │   ├── GemGateSheet.tsx       # Vaul bottom sheet for insufficient gems
│   │   ├── YourStorySidebar.tsx   # Desktop panel + mobile Vaul drawer
│   │   ├── DecisionEntry.tsx      # Single timeline entry in sidebar
│   │   └── LoadingSkeleton.tsx    # Shimmer + spinner loading state
│   └── AppShell.tsx               # Existing, extend for desktop layout
├── hooks/
│   └── useTypewriter.ts           # Recursive setTimeout typewriter hook
├── pages/
│   └── StoryReaderPage.tsx        # Replace placeholder; delegates to StoryReader
├── store/
│   └── useChaptrStore.ts          # Extend with decisionLog, sidebarOpen, firstGemChoiceUsed
└── data/
    └── mockStoryData.ts           # Hardcoded story beats for PoC testing
```

### Pattern 1: useTypewriter Hook (recursive setTimeout, Strict Mode safe)
**What:** Custom hook that reveals text character-by-character using recursive setTimeout, with instant-complete via ref.
**When to use:** All story text reveals in the reader.
**Example:**
```typescript
// src/hooks/useTypewriter.ts
import { useState, useEffect, useRef, useCallback } from 'react';

type UseTypewriterReturn = {
  displayedText: string;
  isComplete: boolean;
  completeInstantly: () => void;
};

export function useTypewriter(
  fullText: string,
  speed: number = 30
): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const isCancelledRef = useRef(false);
  const indexRef = useRef(0);

  const completeInstantly = useCallback(() => {
    isCancelledRef.current = true;
    setDisplayedText(fullText);
    setIsComplete(true);
  }, [fullText]);

  useEffect(() => {
    // Reset on new text
    isCancelledRef.current = false;
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);

    function typeNext() {
      if (isCancelledRef.current) return;
      if (indexRef.current >= fullText.length) {
        setIsComplete(true);
        return;
      }
      indexRef.current++;
      setDisplayedText(fullText.slice(0, indexRef.current));
      setTimeout(typeNext, speed);
    }

    const timerId = setTimeout(typeNext, speed);

    return () => {
      isCancelledRef.current = true;
      clearTimeout(timerId);
    };
  }, [fullText, speed]);

  return { displayedText, isComplete, completeInstantly };
}
```

**Key details:**
- `isCancelledRef` prevents the recursive chain from continuing after unmount or text change (React Strict Mode fires effects twice in dev)
- `completeInstantly()` sets the ref AND updates state in one call
- Cleanup clears the current timeout AND sets the cancelled flag
- `indexRef` avoids stale closure issues with the character index

### Pattern 2: Two-Tap Skip State Machine
**What:** Tap handler that distinguishes between "complete text" (first tap) and "advance beat" (second tap).
**When to use:** The reader text area click/tap handler.
**Example:**
```typescript
// Inside StoryReader or TypewriterText component
const handleTextTap = useCallback(() => {
  if (!isComplete) {
    completeInstantly(); // First tap: show all text
  } else {
    advanceBeat(); // Second tap: next story beat
  }
}, [isComplete, completeInstantly, advanceBeat]);
```

### Pattern 3: Vaul Bottom Sheet (Gem Gate + Sidebar)
**What:** Vaul Drawer for both the gem-gate sheet and the mobile sidebar.
**When to use:** SIDE-01 (sidebar mobile) and READ-07 (gem gate).
**Example:**
```typescript
// Gem gate bottom sheet
import { Drawer } from 'vaul';

function GemGateSheet({ open, onClose, gemCost }: Props) {
  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()} snapPoints={[0.5, 1]}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-6">
          <Drawer.Handle className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />
          <h3 className="text-text-primary text-lg font-bold">
            This choice costs {gemCost} gems
          </h3>
          <p className="text-muted mt-2">Get more gems to unlock premium choices.</p>
          {/* Placeholder CTA for PoC */}
          <button className="mt-4 w-full rounded-lg bg-gold py-3 text-base font-bold">
            Get More Gems
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

### Pattern 4: Responsive Sidebar (Desktop Panel vs Mobile Drawer)
**What:** Conditional rendering -- always-visible panel at `lg:` breakpoint, Vaul drawer below.
**When to use:** SIDE-01.
**Example:**
```typescript
function YourStorySidebar() {
  const sidebarOpen = useChaptrStore((s) => s.sidebarOpen);
  const toggleSidebar = useChaptrStore((s) => s.toggleSidebar);
  const decisionLog = useChaptrStore((s) => s.decisionLog);

  return (
    <>
      {/* Desktop: always visible */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-[280px] bg-surface border-r border-muted/20 p-5 overflow-y-auto">
        <SidebarContent decisionLog={decisionLog} />
      </aside>

      {/* Mobile: Vaul drawer */}
      <Drawer.Root open={sidebarOpen} onOpenChange={(o) => !o && toggleSidebar()} snapPoints={[0.5, 1]}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 lg:hidden" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-5 lg:hidden">
            <Drawer.Handle className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />
            <SidebarContent decisionLog={decisionLog} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
```

### Pattern 5: Desktop 3-Column Layout
**What:** Flex layout that activates at `lg:` breakpoint with fixed sidebar + centered reading column.
**Example:**
```typescript
// StoryReaderPage layout wrapper
<div className="min-h-screen bg-base">
  {/* Progress bar at very top */}
  <ProgressBar percent={progress} />

  {/* Scene image full-width */}
  <SceneImage src={sceneUrl} selfieUrl={selfieUrl} showOverlay={isChapterCover} />

  {/* Content area: sidebar + reading column */}
  <div className="lg:pl-[280px]">
    <div className="mx-auto max-w-[680px] px-5 pb-20">
      <ReaderNavBar />
      <TypewriterText text={currentBeat.text} />
      {isComplete && <ChoiceList choices={currentBeat.choices} />}
    </div>
  </div>

  <YourStorySidebar />
</div>
```

### Anti-Patterns to Avoid
- **setInterval for typewriter:** Creates timing drift and is harder to cancel cleanly. Use recursive setTimeout.
- **Framer Motion for character-by-character text:** Creating a `<motion.span>` per character is DOM-heavy and slow for long passages. Use a single text node updated via state.
- **Conditional Vaul import for desktop:** Do not dynamically import Vaul only on mobile. Render both desktop panel and Vaul drawer; hide with Tailwind `hidden lg:block` / `lg:hidden`. Simpler, no layout shift.
- **Storing gem balance outside Zustand persist:** GEM-03 requires localStorage persistence. Do not use separate localStorage calls -- the store already handles this.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bottom sheet drawer | Custom touch drag handler | `vaul` Drawer | Snap points, velocity-based swiping, backdrop, accessibility -- months to replicate |
| Typewriter cancellation in Strict Mode | Naive setInterval + clearInterval | Recursive setTimeout + isCancelledRef | Strict Mode double-fires effects; setInterval leaves zombie intervals |
| Responsive sidebar toggle | Media query listener in JS | Tailwind `hidden lg:block` / `lg:hidden` | CSS handles this without JS, no hydration mismatch |

## Common Pitfalls

### Pitfall 1: React Strict Mode Double-Firing setTimeout
**What goes wrong:** Typewriter runs twice in development, showing garbled text or double-speed animation.
**Why it happens:** React 18/19 Strict Mode fires useEffect twice on mount in development to catch impure effects.
**How to avoid:** The `isCancelledRef` pattern in the cleanup function. When the first effect is torn down, it sets `isCancelledRef = true`, stopping the recursive chain. The second effect starts fresh.
**Warning signs:** Text appearing at 2x speed in dev mode, or characters duplicating.

### Pitfall 2: Vaul snapPoints as Fractions vs Pixels
**What goes wrong:** Setting snapPoints to `[50, 100]` (integers) instead of `[0.5, 1]` (fractions) causes the drawer to be invisible or full-screen only.
**Why it happens:** Vaul interprets numbers 0-1 as fractions of viewport height, and larger numbers as pixel values.
**How to avoid:** Use `[0.5, 1]` as specified in CONTEXT.md for 50% and 100% snap points.
**Warning signs:** Drawer snaps to wrong position or doesn't appear.

### Pitfall 3: Zustand Persist Schema Migration
**What goes wrong:** Adding new fields (decisionLog, sidebarOpen, firstGemChoiceUsed) without bumping schema version causes existing users to have undefined fields.
**Why it happens:** The persist middleware only runs migrate when version changes.
**How to avoid:** Bump `version` from 2 to 3, add migration that sets defaults for new fields.
**Warning signs:** `undefined` errors when accessing new state fields after page refresh with existing localStorage.

### Pitfall 4: Choice Rendering Before Typewriter Completes
**What goes wrong:** Choices flash briefly during text animation, then the user accidentally taps a choice.
**Why it happens:** Not gating choice rendering on `isComplete` from the typewriter hook.
**How to avoid:** `{isComplete && <ChoiceList ... />}` -- simple conditional render.
**Warning signs:** Choices visible while text is still typing.

### Pitfall 5: First Gem-Gated Choice Free Logic
**What goes wrong:** Every gem choice is free, or no gem choice is free.
**Why it happens:** Tracking `firstGemChoiceUsed` globally instead of per-chapter, or not tracking at all.
**How to avoid:** Store `firstGemChoiceUsed` as a `Record<string, boolean>` keyed by chapterId in Zustand. Check before deducting gems.
**Warning signs:** Free gem choice resets on page refresh (if not persisted) or applies across chapters.

## Code Examples

### Mock Story Data Structure
```typescript
// src/data/mockStoryData.ts
export type StoryChoice = {
  id: string;
  text: string;
  gemCost: number; // 0 = free choice
  nextBeatId: string;
};

export type StoryBeat = {
  id: string;
  text: string;
  sceneImage?: string; // URL or import path
  choices: StoryChoice[];
  isChapterStart?: boolean;
  isChapterEnd?: boolean;
};

export type Chapter = {
  id: string;
  title: string;
  beats: Record<string, StoryBeat>;
  startBeatId: string;
};

// Minimal mock for Phase 3 testing (real content comes in Phase 4)
export const mockChapter1: Chapter = {
  id: 'seoul-transfer-ch1',
  title: 'Chapter 1: First Day',
  startBeatId: 'beat-1',
  beats: {
    'beat-1': {
      id: 'beat-1',
      text: 'You step through the glass doors of NOVA Entertainment...',
      sceneImage: undefined, // gradient placeholder for PoC
      isChapterStart: true,
      choices: [
        { id: 'c1a', text: 'Introduce yourself confidently', gemCost: 0, nextBeatId: 'beat-2a' },
        { id: 'c1b', text: 'Hang back and observe', gemCost: 0, nextBeatId: 'beat-2b' },
        { id: 'c1c', text: 'Walk straight up to Jiwoo', gemCost: 10, nextBeatId: 'beat-2c' },
      ],
    },
    'beat-2a': {
      id: 'beat-2a',
      text: 'The room quiets as you step forward...',
      choices: [
        { id: 'c2a1', text: 'Keep talking', gemCost: 0, nextBeatId: 'beat-3' },
        { id: 'c2a2', text: 'Flash a smile and sit down', gemCost: 0, nextBeatId: 'beat-3' },
      ],
    },
    // ... more beats
  },
};
```

### Zustand Store Extension (Schema v3)
```typescript
// Add to ChaptrState type
export type DecisionLogEntry = {
  chapterId: string;
  chapterNum: number;
  choiceSummary: string;
  timestamp: number;
};

// New fields in state
decisionLog: DecisionLogEntry[];
sidebarOpen: boolean;
firstGemChoiceUsed: Record<string, boolean>; // keyed by chapterId

// New actions
logDecision: (entry: DecisionLogEntry) => void;
toggleSidebar: () => void;
setFirstGemChoiceUsed: (chapterId: string) => void;
isFirstGemChoiceFree: (chapterId: string) => boolean; // derived, not persisted

// Migration v2 -> v3
migrate: (persisted, version) => {
  const state = persisted as Record<string, unknown>;
  if (version < 2) {
    state.showSelfiePrompt = false;
  }
  if (version < 3) {
    state.decisionLog = [];
    state.sidebarOpen = false;
    state.firstGemChoiceUsed = {};
  }
  return state as ChaptrState;
}
```

### Loading Skeleton with Shimmer
```typescript
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3 px-5">
      <div className="h-4 w-3/4 rounded bg-surface" />
      <div className="h-4 w-full rounded bg-surface" />
      <div className="h-4 w-5/6 rounded bg-surface" />
      <div className="h-4 w-2/3 rounded bg-surface" />
    </div>
  );
}
```

### Scene Image with Selfie Overlay
```typescript
function SceneImage({ src, selfieUrl, showOverlay }: Props) {
  return (
    <div className="relative h-[40vh] w-full overflow-hidden bg-surface">
      {src ? (
        <img src={src} alt="Scene" className="h-full w-full object-cover" />
      ) : (
        // Gradient placeholder for PoC
        <div className="h-full w-full bg-gradient-to-b from-purple-accent/20 to-base" />
      )}
      {/* Angular spinner for loading */}
      {/* Selfie overlay on chapter cover */}
      {showOverlay && selfieUrl && (
        <img
          src={selfieUrl}
          alt=""
          className="absolute bottom-4 right-4 h-16 w-16 rounded-full object-cover"
          style={{ mixBlendMode: 'luminosity' }}
        />
      )}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS @keyframes typewriter | JS setTimeout with ref guards | React 18+ (2022) | Required for Strict Mode compatibility |
| Custom modal for bottom sheet | Vaul unstyled drawer | 2023-2024 | Snap points, gesture handling, accessibility built-in |
| Redux for UI state | Zustand with persist | 2022+ | Less boilerplate, simpler persist middleware |
| Media query JS listeners for responsive | Tailwind responsive prefixes (hidden/block) | Always | No JS needed, no hydration mismatch |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| Config file | vitest.config.ts (jsdom env, globals: true) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| READ-02 | Typewriter reveals text char-by-char, cancels cleanly | unit | `npx vitest run src/__tests__/useTypewriter.test.ts -t "typewriter"` | Wave 0 |
| READ-03 | Two-tap: first completes, second advances | unit | `npx vitest run src/__tests__/useTypewriter.test.ts -t "skip"` | Wave 0 |
| READ-04 | Choices hidden until isComplete | unit | `npx vitest run src/__tests__/ChoiceList.test.tsx -t "hidden"` | Wave 0 |
| READ-05 | First gem choice free per chapter | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "gem"` | Wave 0 |
| GEM-01 | Gem counter shows balance from store | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "gem"` | Wave 0 |
| GEM-02 | spendGems deducts correctly | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "spend"` | Partially exists |
| GEM-03 | Gem balance persists | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "persist"` | Wave 0 |
| SIDE-02 | Decision log records choices | unit | `npx vitest run src/__tests__/useChaptrStore.test.ts -t "decision"` | Wave 0 |
| READ-06 | Selected choice highlighted, unchosen dimmed | manual-only | Visual verification | N/A |
| READ-08 | Loading skeleton renders shimmer | manual-only | Visual verification | N/A |
| VIZ-01 | Scene image with placeholder | manual-only | Visual verification | N/A |
| VIZ-02 | Selfie overlay with mix-blend-mode | manual-only | Visual verification | N/A |
| DESK-01 | 3-column layout at 1440px | manual-only | Visual verification at viewport | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/useTypewriter.test.ts` -- covers READ-02, READ-03
- [ ] `src/__tests__/useChaptrStore.test.ts` -- extend existing file for GEM-01, GEM-02, GEM-03, READ-05, SIDE-02 (decision log)
- [ ] `src/__tests__/ChoiceList.test.tsx` -- covers READ-04

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| vaul | SIDE-01, READ-07 | Not yet installed | 1.1.2 (npm) | Install as part of Plan 03-02 or 03-03 |
| Node.js | Build/dev | Assumed available | -- | -- |

**Missing dependencies with no fallback:** None -- vaul is installable.
**Missing dependencies with fallback:** None.

## Open Questions

1. **Scene placeholder art for PoC**
   - What we know: VIZ-01 calls for static illustrated artwork with silhouette protagonist. No .pen file or assets exist yet.
   - What's unclear: Whether gradient placeholders are sufficient or if actual placeholder images should be sourced.
   - Recommendation: Use CSS gradient placeholders (purple-accent/base gradient) for PoC. Real artwork is a Phase 4/content concern.

2. **Vaul unmaintained status**
   - What we know: Author marked repo unmaintained Dec 2024. v1.1.2 is latest. 369k+ dependents.
   - What's unclear: Whether any React 19-specific issues exist.
   - Recommendation: Proceed with vaul. If issues surface, the Drawer API is simple enough to replace with a custom implementation later. For PoC, this is acceptable risk.

## Sources

### Primary (HIGH confidence)
- Project codebase: `useChaptrStore.ts`, `AppShell.tsx`, `StoryReaderPage.tsx`, `package.json`, `tailwind.config.js` -- direct file reads
- CONTEXT.md decisions -- locked implementation specs
- REQUIREMENTS.md -- all 18 requirement definitions

### Secondary (MEDIUM confidence)
- [Vaul npm page](https://www.npmjs.com/package/vaul) -- v1.1.2 confirmed, snapPoints API verified
- [Vaul GitHub](https://github.com/emilkowalski/vaul) -- unmaintained notice, 369k dependents, MIT license
- [Vaul docs](https://vaul.emilkowal.ski/) -- snapPoints fraction syntax (0-1 = viewport %, larger = px)

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages already installed except vaul (verified on npm)
- Architecture: HIGH -- patterns derived from locked CONTEXT.md decisions + existing codebase conventions
- Pitfalls: HIGH -- React Strict Mode setTimeout pattern is well-documented; Zustand migration is established pattern in this codebase

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable domain, no fast-moving dependencies)
