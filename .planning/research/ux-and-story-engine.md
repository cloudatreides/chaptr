# Chaptr — UX & Story Engine Research

**Domain:** Mobile-first AI interactive fiction / visual novel web app
**Researched:** 2026-03-27
**Overall confidence:** MEDIUM-HIGH (UX patterns confirmed from multiple sources; AI prompt patterns partially from training knowledge, flagged where low confidence)

---

## 1. Story Reader UX — How Episode/Choices Structure Their Experience

### The Core Loop

Episode and Choices use the same fundamental loop:

```
TEXT LINE → TAP TO ADVANCE → TEXT LINE → ... → CHOICE GATE → RESUME
```

There is no auto-scroll. The reader taps anywhere on screen to advance each dialogue line. This keeps engagement active and gives the reader a sense of pacing control. Auto-advance (holding tap) exists as an accessibility option, not the default.

### Dialogue Box Anatomy

- Fixed at bottom 25–30% of screen
- Character name label above the dialogue bubble
- Portrait/avatar on the left or right of the box (alternates by speaker)
- Text appears character-by-character (typewriter), then the reader taps to advance
- A visual "tap to continue" caret or pulse animation sits at the bottom-right of the box

### Chapter Progression Pattern

1. **Splash / Chapter Title card** — full screen, cinematic, 2–3 second hold with a "Tap to Begin" CTA
2. **Scene blocks** — 5–15 dialogue lines per scene beat, separated by background transitions
3. **Choice gate** — choices appear after emotional peaks, never mid-scene
4. **Scene continues** — 5–15 more lines, then next choice gate or chapter end
5. **Chapter end card** — summary of choices made, "Next Chapter" CTA with gem cost or cooldown

### Choice Gate UX (Critical for Chaptr)

Episode and Choices both use the same gem-gate pattern:

```
[Free choice A]               (no indicator, just text)
[Premium choice B]  [diamond/gem icon]  [cost: 15 gems]
```

Key observations:
- **Free choices are always listed first.** Premium choices appear below with a gem icon and cost.
- **Choices never appear until text animation completes.** Showing choices while text is still revealing feels broken.
- **3 choices maximum.** Most gates have 2. Three feels crowded on mobile.
- **Premium choices show a brief teaser of outcome**, e.g. "Tell him the truth (unlock a secret scene)". Free choices don't.
- **Locked premium choices are NOT greyed out by default** in Episode. They show full text with the gem cost badge. Tapping opens a gem purchase overlay. This creates FOMO, not exclusion.
- **Choice timing delay**: A 400–600ms pause after the final text line lands before choices animate in. This prevents accidental taps.

### Pacing Rules (from community VN design resources)

- Slow down for emotional reveals: extend the delay between lines with punctuation-aware timing (longer pause on `.` and `...` than on `,`)
- Speed up for banter: shorter intervals between shorter lines
- Never put a choice gate mid-sentence or mid-thought
- One choice gate every 8–12 lines is the sweet spot for engagement without fatigue

**Source confidence:** MEDIUM — derived from platform analysis, community VN design forums (Lemma Soft, VNDev Wiki), and the Choices/Episode Wikipedia/Fandom breakdown. No official design docs from Pocket Gems or Naver Webtoon.

---

## 2. Typewriter Text Animation in React

### Recommended Approach: Custom Hook with useRef + setInterval

**Do not use a third-party library for this.** `react-type-animation` and `typewriter-effect` are fine for marketing pages. For a story engine you need:
- Skip-to-end on tap
- Cancellation when text changes
- Punctuation-aware delay (longer pause after `.`)
- Framer Motion integration for the choice-reveal animation that follows

The canonical pattern uses a `useRef` for the interval ID and an `isCancelled` flag to guard against stale closures in React Strict Mode (which mounts/unmounts twice in development):

```typescript
import { useState, useEffect, useRef, useCallback } from 'react';

interface TypewriterOptions {
  text: string;
  speed?: number;           // ms per character, default 28
  punctuationDelay?: number; // extra ms on . ! ? default 180
  onComplete?: () => void;
}

export function useTypewriter({ text, speed = 28, punctuationDelay = 180, onComplete }: TypewriterOptions) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCancelledRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const skip = useCallback(() => {
    clearTimer();
    isCancelledRef.current = true;
    setDisplayText(text);
    setIsComplete(true);
    onComplete?.();
  }, [text, clearTimer, onComplete]);

  useEffect(() => {
    // Reset on new text
    indexRef.current = 0;
    isCancelledRef.current = false;
    setDisplayText('');
    setIsComplete(false);
    clearTimer();

    const tick = () => {
      if (isCancelledRef.current) return;

      const i = indexRef.current;
      if (i >= text.length) {
        setIsComplete(true);
        onComplete?.();
        return;
      }

      setDisplayText(text.slice(0, i + 1));
      indexRef.current = i + 1;

      const char = text[i];
      const isPunctuation = ['.', '!', '?', '…'].includes(char);
      const delay = isPunctuation ? speed + punctuationDelay : speed;

      intervalRef.current = setTimeout(tick, delay);
    };

    intervalRef.current = setTimeout(tick, 0);

    return () => {
      isCancelledRef.current = true;
      clearTimer();
    };
  }, [text]); // intentionally only text — speed/punctuationDelay are stable config

  return { displayText, isComplete, skip };
}
```

### Usage in Story Reader

```typescript
function DialogueLine({ line, onAdvance }: { line: string; onAdvance: () => void }) {
  const { displayText, isComplete, skip } = useTypewriter({
    text: line,
    onComplete: () => {
      // show tap-to-continue caret
    }
  });

  const handleTap = () => {
    if (!isComplete) {
      skip(); // first tap: complete text instantly
    } else {
      onAdvance(); // second tap: go to next line
    }
  };

  return (
    <div onClick={handleTap} className="dialogue-box">
      <p>{displayText}</p>
      {isComplete && <AdvanceCaret />}
    </div>
  );
}
```

### Performance Gotchas

- **Never animate individual character `<span>` elements.** Mounting 300 DOM nodes for a long sentence causes visible jank on mid-range Android phones. Use a single `<p>` with `text.slice(0, index)` — one re-render per character is fine because it's just a text diff.
- **Do not use `setInterval`.** Use `setTimeout` in a recursive pattern (as above). This avoids drift accumulation over long texts and lets punctuation delays vary per character.
- **React Strict Mode** mounts effects twice. The `isCancelledRef` guard handles this — the first cancelled interval never writes state.
- **Skip must be idempotent.** Calling `skip()` twice should not cause double `onComplete()` calls. The `isCancelledRef` flag handles this.

**Source confidence:** HIGH — pattern derived from React docs (effects/cleanup), LogRocket implementation guide, and common practice for story engine implementations.

---

## 3. Branching Story State Machine in React

### Recommended Architecture: Zustand Store + Explicit Choice Tree

Do not use XState for this. XState is excellent for UI state machines (modals, auth flows) but adds unnecessary ceremony to narrative branching where the "states" are story beats, not application states. A Zustand store with a structured story graph is simpler and more debuggable.

### Story Node Schema

```typescript
// story/types.ts

type NodeType = 'dialogue' | 'choice' | 'scene-transition' | 'chapter-end';

interface DialogueNode {
  id: string;
  type: 'dialogue';
  speaker: string;         // character name
  text: string;
  next: string;            // next node id
  emotion?: string;        // for character expression variant
}

interface ChoiceNode {
  id: string;
  type: 'choice';
  choices: Choice[];
}

interface Choice {
  id: string;
  label: string;
  nextNodeId: string;
  gemCost?: number;        // undefined = free
  outcomeHint?: string;    // teaser shown on premium choices
  aiPromptKey?: string;    // key injected into AI generation context
}

interface SceneTransitionNode {
  id: string;
  type: 'scene-transition';
  background: string;      // image key
  next: string;
}

interface ChapterEndNode {
  id: string;
  type: 'chapter-end';
  chapterId: string;
  summaryChoiceIds: string[]; // which choices to surface in summary
}

type StoryNode = DialogueNode | ChoiceNode | SceneTransitionNode | ChapterEndNode;

// The full story graph — a flat map keyed by node id
type StoryGraph = Record<string, StoryNode>;
```

### Zustand Store

```typescript
// store/storyStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChoiceRecord {
  nodeId: string;       // which choice node
  choiceId: string;     // which option was picked
  timestamp: number;
}

interface StoryState {
  // Navigation
  currentNodeId: string;
  currentChapterId: string;

  // History
  choiceHistory: ChoiceRecord[];
  visitedNodeIds: Set<string>;

  // Economy
  gemBalance: number;

  // Character context
  playerName: string;
  playerAvatarUrl: string;

  // Story-specific flags (set by choices, read by AI prompt builder)
  storyFlags: Record<string, string | number | boolean>;

  // Actions
  advance: (nextNodeId: string) => void;
  makeChoice: (choiceNodeId: string, choice: Choice) => void;
  spendGems: (amount: number) => boolean; // returns false if insufficient
  setFlag: (key: string, value: string | number | boolean) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  currentNodeId: 'ch1_start',
  currentChapterId: 'ch1',
  choiceHistory: [],
  visitedNodeIds: new Set<string>(),
  gemBalance: 50,  // hardcoded PoC starting balance
  playerName: '',
  playerAvatarUrl: '',
  storyFlags: {},
};

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      advance: (nextNodeId) => set((state) => ({
        currentNodeId: nextNodeId,
        visitedNodeIds: new Set([...state.visitedNodeIds, nextNodeId]),
      })),

      makeChoice: (choiceNodeId, choice) => set((state) => ({
        currentNodeId: choice.nextNodeId,
        choiceHistory: [...state.choiceHistory, {
          nodeId: choiceNodeId,
          choiceId: choice.id,
          timestamp: Date.now(),
        }],
        visitedNodeIds: new Set([...state.visitedNodeIds, choice.nextNodeId]),
      })),

      spendGems: (amount) => {
        const { gemBalance } = get();
        if (gemBalance < amount) return false;
        set({ gemBalance: gemBalance - amount });
        return true;
      },

      setFlag: (key, value) => set((state) => ({
        storyFlags: { ...state.storyFlags, [key]: value },
      })),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'chaptr-story-state',
      version: 1,
      // Migrate v0 (no version) to v1
      migrate: (persisted: any, version: number) => {
        if (version === 0) {
          return { ...INITIAL_STATE, ...persisted, version: 1 };
        }
        return persisted;
      },
      // Set is not JSON-serializable — convert to/from array
      partialize: (state) => ({
        ...state,
        visitedNodeIds: [...state.visitedNodeIds],
      }),
      // Restore Set from serialized array
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).visitedNodeIds)) {
          state.visitedNodeIds = new Set((state as any).visitedNodeIds);
        }
      },
    }
  )
);
```

### Choice History for AI Context

Build a compact summary of key choices to inject into each AI generation call:

```typescript
// story/contextBuilder.ts

export function buildChoiceSummary(choiceHistory: ChoiceRecord[], storyGraph: StoryGraph): string {
  return choiceHistory
    .filter(record => {
      // Only include narrative choices, not cosmetic ones
      const node = storyGraph[record.nodeId] as ChoiceNode;
      return node?.choices.find(c => c.id === record.choiceId)?.aiPromptKey;
    })
    .map(record => {
      const node = storyGraph[record.nodeId] as ChoiceNode;
      const choice = node.choices.find(c => c.id === record.choiceId)!;
      return `- ${choice.aiPromptKey}: ${choice.label}`;
    })
    .join('\n');
}
```

### Resuming Progress

Because the store is persisted, resume is automatic. On app load:

```typescript
function App() {
  const { currentNodeId } = useStoryStore();
  // currentNodeId is hydrated from localStorage — pick up exactly where left off
  return <StoryReader startNodeId={currentNodeId} />;
}
```

**Source confidence:** HIGH for Zustand patterns (official docs, widely verified). MEDIUM for story graph schema (derived from visual novel engine analysis, not a canonical spec).

---

## 4. Bottom Sheet for Mobile Web ("Your Story" Sidebar)

### Use Vaul

**Vaul** (by Emil Kowalski, used by Vercel in production) is the correct choice for this. It is:
- Built for React web (not React Native)
- 7.4k+ GitHub stars, actively maintained (v1.1.2, December 2024)
- Snap points, gesture dismiss, physics-based animations
- No Radix dependency issues that plague `react-modal-sheet`

```bash
npm install vaul
```

### Implementation Pattern

```typescript
// components/YourStorySheet.tsx
import { Drawer } from 'vaul';

interface YourStorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  choiceHistory: ChoiceRecord[];
  gemBalance: number;
  playerAvatarUrl: string;
}

export function YourStorySheet({ isOpen, onClose, choiceHistory, gemBalance, playerAvatarUrl }: YourStorySheetProps) {
  return (
    <Drawer.Root open={isOpen} onClose={onClose} snapPoints={[0.5, 1]} defaultSnap={0.5}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-zinc-900 border-t border-zinc-700">
          {/* Drag handle */}
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-zinc-600" />

          <div className="px-5 pt-4 pb-8 overflow-y-auto flex-1">
            {/* Avatar + gem balance header */}
            <div className="flex items-center gap-3 mb-6">
              <img src={playerAvatarUrl} className="w-12 h-12 rounded-full object-cover" alt="You" />
              <div>
                <p className="text-white font-semibold">Your Story</p>
                <p className="text-amber-400 text-sm">{gemBalance} gems</p>
              </div>
            </div>

            {/* Choice timeline */}
            <ol className="space-y-3">
              {choiceHistory.map((record, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="text-zinc-500 w-4 shrink-0">{i + 1}.</span>
                  <span>{record.choiceId}</span>
                </li>
              ))}
            </ol>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

### Snap Point Behaviour

- `snapPoints={[0.5, 1]}` — half-screen (summary view) and full-screen (full timeline)
- Default snap to 0.5 on open — shows enough context without blocking the story
- Dragging down past 0.5 dismisses — no explicit close button needed for power users
- Keep a close button for first-time users regardless

### Gotchas

- Vaul requires `overflow-y: auto` on the content container with a `flex-1` parent to enable scrolling inside snap points
- Test the drag handle hit area on iOS Safari — it defaults to too small. Use `min-h-[44px]` on the handle area
- `body` gets a `pointer-events: none` during Vaul's backdrop animation — ensure your story tap handlers aren't attached to `body`

**Source confidence:** HIGH — Vaul is the standard for React web bottom sheets as of 2024–2025, widely used and documented.

---

## 5. AI Story Generation Prompts for Claude — Narrative Consistency

### The Fundamental Problem

Claude Haiku generates one scene segment per API call. Between calls, it has no memory of previous dialogue unless you inject it. The solution is a structured context object rebuilt on every call.

### System Prompt Structure

Set the world, character, and tone once in the system prompt. This stays constant across all calls in a session:

```typescript
const SYSTEM_PROMPT = `You are the narrator for "The Seoul Transfer," a K-pop romance interactive story.

STORY WORLD:
- Setting: Seoul, South Korea. Present day. A prestigious arts academy.
- Tone: Romantic, emotionally grounded, webtoon aesthetic. Think "True Beauty" meets "Weightlifting Fairy."
- Pacing: Short, punchy sentences. Each narrative beat is 1-3 sentences max.

MAIN CHARACTERS:
- Seo Joon (male lead): Idol-trainee-turned-art-student. Guarded, perceptive, secretly kind.
  Voice: Economical. "You noticed?" not "I'm surprised you picked up on that."
- Mira (side character): Joon's ex-manager. Sharp, protective of Joon, wary of outsiders.
- THE PLAYER: {{playerName}}. A transfer student from abroad. The reader IS this character — use "you" for second-person narration, never name them or describe their appearance.

HARD RULES:
- Never describe the player's physical appearance or face. They see themselves in the story via their uploaded selfie.
- Seo Joon always speaks informally (banmal) in private, formally in public.
- Never break the fourth wall or reference being an AI.
- Output only the story content requested — no commentary, no meta-text.

OUTPUT FORMAT:
Return a JSON object matching this exact schema:
{
  "lines": [
    { "speaker": "narrator" | "Seo Joon" | "Mira" | "{{playerName}}", "text": "..." }
  ],
  "suggestedNextChoices": [
    { "label": "...", "tone": "bold" | "warm" | "deflect", "aiPromptKey": "..." }
  ]
}`;
```

### Per-Call Context Injection

On every generation call, inject a compact context block into the user turn:

```typescript
function buildGenerationPrompt({
  sceneDescription,
  choiceSummary,
  storyFlags,
  playerName,
  lastPlayerChoice,
}: GenerationContext): string {
  return `
<scene_context>
${sceneDescription}
</scene_context>

<player_choices_so_far>
${choiceSummary || 'None yet — this is the beginning of the story.'}
</player_choices_so_far>

<active_story_flags>
${Object.entries(storyFlags).map(([k, v]) => `${k}: ${v}`).join('\n') || 'None'}
</active_story_flags>

<last_choice>
${lastPlayerChoice ? `The player just chose: "${lastPlayerChoice}"` : 'No choice made yet.'}
</last_choice>

Continue the scene. Generate the next 4-6 dialogue lines. End at a natural pause point — do NOT include a choice gate. The orchestrating code will inject choices separately.
`.trim();
}
```

### Why This Architecture

- **System prompt = immutable world rules.** Claude treats system prompt content differently from user turn content — it has higher authority. Put character voices and hard rules there.
- **User turn = live context.** Inject choices and flags here so they feel like dynamic story state, not rigid rules.
- **Separate choices from generation.** Never ask Claude to invent the choice gates. Define choices in your story graph and use them to steer generation. AI-invented choices are unpredictable and will break your gem-gate economy.
- **Keep injected context under 800 tokens.** Haiku has a 200k context window, but per-call latency increases with input length. Summarise old choices to 1 line each; only inject the last 3-5 narrative choices in full.
- **XML tags (`<scene_context>`) help Claude parse structure.** Confirmed in official Anthropic prompt engineering docs — XML tags reduce ambiguity when mixing instruction types.
- **`suggestedNextChoices` in the output** gives you a creative fallback. Use them as hints, not gospel. Always override with your graph-defined choices when at a choice gate.

### Consistency Pitfalls

- **Joon's voice drifting**: Add 1-2 example lines of Joon's voice to the system prompt as concrete examples. Claude pattern-matches on examples better than descriptions.
- **Player descriptions slipping in**: Make the hard rule explicit ("never describe their appearance"). Test with a few calls to confirm Haiku respects it — Haiku occasionally drifts on soft rules.
- **Tone shift between calls**: Include a `tone_note` in your scene context ("This is a tense scene — Joon is defensive, player is nervous") to recalibrate each generation.

**Source confidence:** MEDIUM-HIGH — Core prompt structure follows official Anthropic docs (XML tags, system prompt role, few-shot examples). The specific architecture (separate graph choices vs AI-generated choices) is derived from applied practice and the research finding that AI-generated branching choices reduce predictability. LOW confidence on exact token budget — verify with real call timing.

---

## 6. localStorage Schema for Story State

### Recommended Library: Zustand persist middleware

Zustand's `persist` middleware handles serialization, versioning, and migration automatically. Do not hand-roll `localStorage.setItem` calls — the migration story becomes unmaintainable by v2.

```bash
npm install zustand
```

### Complete Schema

```typescript
// The persisted shape (what actually lands in localStorage)
interface PersistedChaptrState {
  schemaVersion: number;         // increment on breaking changes

  // Player identity
  playerName: string;
  playerAvatarUrl: string;       // base64 or object URL from selfie upload
  playerAvatarProcessed: boolean; // has the selfie been through the face-extraction step

  // Story progress
  currentNodeId: string;
  currentChapterId: string;
  visitedNodeIds: string[];      // stored as array, hydrated to Set

  // Choice history — compact records only
  choiceHistory: Array<{
    nodeId: string;
    choiceId: string;
    timestamp: number;
  }>;

  // Narrative flags set by choices (used to steer AI generation)
  storyFlags: Record<string, string | number | boolean>;

  // Economy
  gemBalance: number;
  gemsEverPurchased: number;     // for analytics / IAP state
  lastGemRefresh: number;        // timestamp for daily free gem logic

  // Session metadata
  totalReadTimeMs: number;       // for engagement tracking
  chaptersCompleted: string[];
  lastPlayedAt: number;
}
```

### Storage Key Strategy

Use a single namespaced key:

```
localStorage['chaptr-v1']
```

Not multiple keys. One key = one atomic read/write = no partial-corruption state bugs where progress is saved but gem balance is stale.

### Versioning and Migration

```typescript
// In Zustand persist config:
{
  name: 'chaptr-v1',
  version: 3,  // increment when schema changes
  migrate: (persisted: any, fromVersion: number) => {
    // v0 → v1: added storyFlags
    if (fromVersion < 1) {
      persisted.storyFlags = {};
    }
    // v1 → v2: renamed 'progress' to 'currentNodeId'
    if (fromVersion < 2) {
      persisted.currentNodeId = persisted.progress ?? 'ch1_start';
      delete persisted.progress;
    }
    // v2 → v3: added chaptersCompleted
    if (fromVersion < 3) {
      persisted.chaptersCompleted = [];
    }
    return persisted;
  },
}
```

### Avatar Storage Gotcha

**Do not store the selfie as a base64 string in localStorage.** A 1MB photo encodes to ~1.37MB base64. localStorage has a 5–10MB limit per origin depending on browser. A single large selfie can fill it.

Instead:
1. On upload, resize and compress the image to max 256x256 at 80% JPEG quality using canvas
2. Store the compressed base64 (under 20KB) in localStorage as `playerAvatarUrl`
3. If you later move to Supabase storage, swap `playerAvatarUrl` for a remote URL — the schema doesn't change

```typescript
// utils/avatarCompress.ts
export async function compressAvatar(file: File): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      const size = 256;
      canvas.width = size;
      canvas.height = size;

      // Centre-crop to square
      const scale = Math.max(size / img.width, size / img.height);
      const x = (size - img.width * scale) / 2;
      const y = (size - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    img.src = URL.createObjectURL(file);
  });
}
```

### Daily Free Gem Logic

```typescript
const DAILY_FREE_GEMS = 5;
const MS_PER_DAY = 86_400_000;

export function claimDailyGems(state: PersistedChaptrState): Partial<PersistedChaptrState> | null {
  const now = Date.now();
  if (now - state.lastGemRefresh < MS_PER_DAY) return null;  // already claimed today
  return {
    gemBalance: state.gemBalance + DAILY_FREE_GEMS,
    lastGemRefresh: now,
  };
}
```

**Source confidence:** HIGH for Zustand persist patterns (official docs). HIGH for localStorage 5MB limit (browser specs). MEDIUM for avatar compression approach (common practice, verify compression ratios with your actual selfie test images).

---

## Implementation Priority Order

For the PoC, build in this sequence:

1. **Typewriter hook** (`useTypewriter`) — the feel of reading depends entirely on this. Build it first, get the timing right.
2. **Story graph** — hardcode `storyGraph.ts` with ~2 chapters of "The Seoul Transfer" as static nodes before wiring AI.
3. **Zustand store + persist** — get save/resume working with the static graph before adding AI complexity.
4. **Reader component** — DialogueBox + ChoiceGate UI wired to static graph.
5. **AI generation** — replace static dialogue nodes with Claude Haiku calls. The graph structure stays the same; nodes just have a `generated: true` flag.
6. **Selfie upload + avatar compression** — wire to `playerAvatarUrl` in store.
7. **Vaul bottom sheet** — "Your Story" sidebar is a nice-to-have for PoC, not critical path.
8. **Gem gate + premium choices** — hardcode gem balance in store, wire premium choice checks last.

---

## Key Libraries

| Library | Version | Purpose | Install |
|---------|---------|---------|---------|
| zustand | ^5.x | State + persistence | `npm i zustand` |
| vaul | ^1.x | Bottom sheet drawer | `npm i vaul` |
| framer-motion | ^11.x | Choice reveal animations | `npm i framer-motion` |

No visual novel engine library is recommended. `NarraLeaf-React` and `react-visual-novel` are too opinionated about rendering and fight with Tailwind. The custom Zustand + story graph approach gives full control over the cinematic webtoon aesthetic you need.

---

## Sources

- [Motion Typewriter component](https://motion.dev/docs/react-typewriter) — official Motion/Framer docs
- [5 ways to implement typing animation in React — LogRocket](https://blog.logrocket.com/5-ways-implement-typing-animation-react/)
- [React useEffect cleanup — React official docs](https://react.dev/learn/synchronizing-with-effects)
- [Vaul GitHub — emilkowalski](https://github.com/emilkowalski/vaul)
- [Vaul homepage](https://vaul.emilkowal.ski/)
- [NarraLeaf React](https://react.narraleaf.com/)
- [react-visual-novel — GitHub](https://github.com/utilfirst/react-visual-novel)
- [Branching narratives in interactive fiction — Depthtale](https://www.depthtale.com/en/app/blog/how-to-create-branching-narratives-in-interactive-fiction)
- [Timed Choices in VNs — Fuwanovel Forums](https://forums.fuwanovel.moe/blogs/entry/4067-timed-choices-%E2%80%93-an-anatomy-of-visual-novels/)
- [Choice — VNDev Wiki](https://vndev.wiki/Choice)
- [Directing Dialogue in your Visual Novel — Neil Triffett](https://neiltriffett.com/2024/07/31/directing-dialogue-in-your-visual-novel/)
- [Choices Stories You Play — About The Game (Fandom)](https://choices-stories-you-play.fandom.com/wiki/About_The_Game)
- [Episode gem choices — Pocket Gems help](https://pocketgems-support.helpshift.com/hc/en/10-episode-writer-s-portal/faq/235-getting-started-with-gem-choices/)
- [Zustand persist middleware — DeepWiki](https://deepwiki.com/pmndrs/zustand/3.1-persist-middleware)
- [How to migrate Zustand store — DEV Community](https://dev.to/diballesteros/how-to-migrate-zustand-local-storage-store-to-a-new-version-njp)
- [Prompt engineering overview — Claude API docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
- [Context windows — Claude API docs](https://platform.claude.com/docs/en/build-with-claude/context-windows)
- [Lost in Stories: Consistency Bugs in LLM Story Generation — arXiv](https://arxiv.org/html/2603.05890)
