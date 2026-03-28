# Phase 5: AI Story Engine - Research

**Researched:** 2026-03-28
**Domain:** Anthropic Claude API streaming, SSE parsing, React hook architecture
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- API key stored as `VITE_ANTHROPIC_API_KEY` in `.env.local` (standard Vite env var pattern)
- Streaming client: custom `fetch` + manual SSE parsing — no Anthropic SDK added to browser bundle
- Error handling: silent fallback to static beat prose from `chapter1.ts` when API call fails — UX stays unbroken
- Prohibited phrase enforcement via system prompt only — no client-side post-processing
- Beat-1 (opening) stays static — AI kicks in only on continuation beats after a choice
- Choices remain static in `chapter1.ts` (per AI-04: Claude generates prose only, app manages all state)
- `chapter1.ts` beat prose fields retained as runtime fallback text — AI output replaces them at runtime, static prose serves as error fallback
- Beat-5 (chapter end): AI generates the final beat prose; `isChapterEnd` flag remains in static data
- System prompt: Character Bible (~200w) + Story State Block (bulleted choices) + Chapter Brief + Prose constraints
- New `useStreamingTypewriter` hook — accumulates streamed chunks, drives character-by-character reveal matching current typewriter behavior
- Loading shimmer disappears when first SSE chunk arrives — `isStreaming` → false, typewriter starts
- Tap-to-complete: first tap cancels fetch + shows full buffered text instantly; second tap advances beat
- Streaming logic in `src/lib/claudeStream.ts` — standalone async generator
- Model ID must be `claude-haiku-4-5`; `claude-3-haiku-20240307` must not appear anywhere

### Claude's Discretion
- Exact SSE parsing implementation (line splitting, `data:` prefix handling, `[DONE]` sentinel)
- Buffer guard implementation details for split chunks
- Exact system prompt wording within agreed architecture
- AbortController integration for tap-cancel

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AI-01 | Claude API integration using `claude-haiku-4-5` model | Model ID confirmed; SSE fetch pattern documented |
| AI-02 | Direct browser API calls via `anthropic-dangerous-direct-browser-access: true` header | Header requirement confirmed from Anthropic docs |
| AI-03 | System prompt architecture: Character Bible + Story State Block + Prose Style Constraints + Chapter Brief | Prompt assembly pattern researched; choice data shape confirmed from store |
| AI-04 | App manages all story state; Claude generates prose only | Beat-1 static guard, fallback pattern, chapter1.ts routing stays static |
| AI-05 | Streaming response via SSE; buffer maintained across `reader.read()` chunks | Full SSE event sequence confirmed from official docs; buffer guard pattern documented |
| AI-06 | Story choices stored in Zustand and injected into every subsequent Claude system prompt | `choiceHistory: ChoiceRecord[]` already exists in store; injection pattern documented |
| AI-07 | Prohibited prose list enforced in system prompt | System prompt instruction pattern documented |
</phase_requirements>

---

## Summary

Phase 5 replaces static beat prose with live Claude Haiku generation. The architecture is well-defined: a standalone async generator (`claudeStream.ts`) handles raw SSE fetch and yields text deltas; a new hook (`useStreamingTypewriter`) mirrors the existing `useTypewriter` interface exactly so `StoryReaderPage` changes are minimal. Beat-1 stays static; all continuation beats after a choice trigger the API.

The Anthropic streaming API sends `content_block_delta` events with `text_delta` deltas as newline-delimited SSE over a standard POST endpoint. Browser fetch with a `ReadableStream` reader handles this cleanly without an SDK. The primary implementation risk is the buffer guard: SSE chunks from `reader.read()` do not align with event boundaries. A leftover-string accumulator must be maintained across reads and flushed on `message_stop`.

The existing `useTypewriter` hook interface (`displayedText`, `isComplete`, `completeInstantly`) is the exact target interface for `useStreamingTypewriter`. The two-tap mechanic maps cleanly: first tap calls `abortController.abort()` and sets the full buffered text; second tap calls the existing advance logic. No changes to `TypewriterText`, `ChoiceList`, or any downstream component are needed.

**Primary recommendation:** Build `claudeStream.ts` as a standalone typed async generator first, test it in isolation with a mocked ReadableStream, then wire `useStreamingTypewriter` and finally update `StoryReaderPage` to swap hooks on non-beat-1 beats.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Anthropic Messages API | REST (no SDK) | Claude Haiku streaming | Locked decision — no SDK in browser bundle |
| `fetch` + `ReadableStream` | Browser built-in | SSE stream consumption | Native, no dependencies |
| `AbortController` | Browser built-in | Stream cancellation on tap-to-complete | Native, integrates with fetch signal |
| Vitest | ^4.1.2 (installed) | Unit tests for generator and hook | Already in devDependencies |
| `@testing-library/react` | ^16.3.2 (installed) | Hook testing via `renderHook` | Already in devDependencies |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zustand `useChaptrStore` | ^5.0.12 (installed) | Read `choiceHistory` for prompt injection | Already provides typed `ChoiceRecord[]` |

**No new packages are required for this phase.** All dependencies are already installed.

---

## Architecture Patterns

### Recommended File Structure
```
src/
├── lib/
│   └── claudeStream.ts      # NEW — async generator, standalone, no React deps
├── hooks/
│   ├── useTypewriter.ts     # UNCHANGED
│   └── useStreamingTypewriter.ts  # NEW — mirrors useTypewriter interface
├── pages/
│   └── StoryReaderPage.tsx  # MODIFIED — swap hook on continuation beats, wire isLoading
└── __tests__/
    ├── claudeStream.test.ts        # NEW — unit tests for generator
    └── useStreamingTypewriter.test.ts  # NEW — hook tests with fake timers
```

### Pattern 1: SSE Async Generator

The Anthropic streaming API uses standard server-sent events over HTTP POST. Each SSE event is two lines: `event: <name>` then `data: <json>`, separated by blank lines. The termination sentinel is `message_stop` event type (not a `[DONE]` string — that is OpenAI's format).

**Exact wire format (from official docs):**
```
event: message_start
data: {"type": "message_start", ...}

event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn"}, ...}

event: message_stop
data: {"type": "message_stop"}
```

**The generator pattern:**
```typescript
// src/lib/claudeStream.ts
// Source: https://platform.claude.com/docs/en/build-with-claude/streaming

export type StreamBeatParams = {
  beatId: string;
  choiceHistory: ChoiceRecord[];
  currentBeat: StoryBeat;
  signal: AbortSignal;
};

export async function* streamBeatProse(params: StreamBeatParams): AsyncGenerator<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal: params.signal,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      stream: true,
      system: buildSystemPrompt(params.choiceHistory, params.currentBeat),
      messages: [{ role: 'user', content: 'Continue the story.' }],
    }),
  });

  if (!response.ok || !response.body) throw new Error(`API error: ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';  // last incomplete line stays in buffer

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (!json) continue;
      const event = JSON.parse(json);
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        yield event.delta.text as string;
      }
      if (event.type === 'message_stop') return;
    }
  }
}
```

**Key implementation detail:** Anthropic does NOT use `data: [DONE]` as a termination sentinel. The stream ends on `event: message_stop` / `data: {"type": "message_stop"}`. The generator can also simply end when `reader.read()` returns `done: true` — both work. The `message_stop` check is belt-and-suspenders.

### Pattern 2: useStreamingTypewriter Hook

The hook must be a drop-in replacement for `useTypewriter`. The exact existing interface from `src/hooks/useTypewriter.ts`:

```typescript
type UseTypewriterReturn = {
  displayedText: string;  // currently visible text
  isComplete: boolean;    // true when typewriter has finished
  completeInstantly: () => void;  // skip: show all text immediately
};

function useTypewriter(fullText: string, speed?: number): UseTypewriterReturn
```

`useStreamingTypewriter` must return the same three fields. It receives the `AbortController` from the parent so `StoryReaderPage` controls cancellation:

```typescript
// src/hooks/useStreamingTypewriter.ts
type UseStreamingTypewriterReturn = {
  displayedText: string;
  isComplete: boolean;
  completeInstantly: () => void;  // cancels fetch + reveals full buffer instantly
};

type UseStreamingTypewriterParams = {
  beatId: string;                    // triggers new stream on change
  choiceHistory: ChoiceRecord[];
  currentBeat: StoryBeat;
  isStaticBeat: boolean;             // beat-1: skip streaming, return static text directly
  fallbackText: string;              // chapter1.ts beat.text, used on error or static beat
};

function useStreamingTypewriter(params: UseStreamingTypewriterParams): UseStreamingTypewriterReturn
```

Internally the hook:
1. Creates an `AbortController` ref on mount and per beat change
2. Calls `streamBeatProse()` and accumulates chunks into a buffer ref
3. Runs the same `setTimeout`-based character reveal as `useTypewriter` on the accumulated buffer
4. On `completeInstantly()`: aborts the controller, sets `displayedText` to full buffer, sets `isComplete = true`
5. On error/abort: falls back to `fallbackText` (static beat prose)

### Pattern 3: StoryReaderPage Integration

The only changes needed in `StoryReaderPage.tsx`:

1. Replace `const [isLoading] = useState(false)` with `const [isStreaming, setIsStreaming] = useState(false)`
2. Detect static beat: `const isStaticBeat = currentBeat.isChapterStart === true`
3. Replace `useTypewriter(currentBeat.text)` with `useStreamingTypewriter({...})` for continuation beats
4. For beat-1 (static): pass `isStaticBeat: true` so the hook skips the API call and typewriters the static text
5. Wire `isStreaming` to control `<LoadingSkeleton />` display — show skeleton until first chunk arrives

The existing `isLoading` variable on line 30 is currently `useState(false)` and unused (`const [isLoading] = useState(false)`). Rename it to `isStreaming` and wire it to `useStreamingTypewriter`.

### Pattern 4: System Prompt Assembly

```typescript
function buildSystemPrompt(choiceHistory: ChoiceRecord[], currentBeat: StoryBeat): string {
  const storyStateBlock = choiceHistory.length > 0
    ? choiceHistory.map(c => `- ${c.nodeId} → ${c.label}`).join('\n')
    : '- No choices made yet (this is the first beat)';

  return `
CHARACTER BIBLE
Protagonist: you (second-person, unnamed until player sets name). New transfer trainee at NOVA Entertainment.
Jiwoo: Lead vocalist of VEIL. Direct, low-key, occasionally dry. Warm beneath the surface but reveals it slowly. Never performatively kind.
Mina: Secondary character. High-energy, chatty, genuinely welcoming. Electric-blue streaks.
Setting: NOVA Entertainment HQ, Seoul. K-pop trainee world. Competitive but not cruel.
Tone: Quiet tension, restrained romance, cinematic. Second-person present tense throughout.

STORY STATE (choices made so far)
${storyStateBlock}

CHAPTER BRIEF
Current beat: ${currentBeat.id}
Scene: ${currentBeat.sceneGradient ? 'See gradient context' : 'continuation'}

OUTPUT CONSTRAINTS
- Write exactly one prose paragraph of 80–120 words
- Second-person present tense ("You step", "You notice")
- No choices, no dialogue tags after prose ends
- Do not use: "her heart skipped a beat", "suddenly", "she couldn't help but"
- Do not describe protagonist's physical appearance
- Do not reference real K-pop artists or groups
`.trim();
}
```

### Anti-Patterns to Avoid

- **Parsing `[DONE]` as terminator:** That is OpenAI's SSE format. Anthropic uses `message_stop` event type. Checking for `[DONE]` will cause the generator to never terminate cleanly.
- **Using `EventSource` API:** EventSource only works with GET requests. The Messages API requires POST. Use `fetch` + `ReadableStream`.
- **Installing the Anthropic SDK:** Locked decision. The SDK adds ~200KB to the browser bundle and is unnecessary when SSE parsing is ~20 lines.
- **Asking Claude to decide routing:** AI-04 explicitly forbids it. Claude outputs prose only. `nextBeatId` routing stays in `chapter1.ts`.
- **Split-chunk JSON parse without buffer:** A `reader.read()` call can split a `data:` line mid-JSON. The leftover partial line must stay in `buffer` and be prepended to the next read. Failing to do this causes intermittent JSON parse errors.
- **Not resetting AbortController on beat change:** If the user advances before stream finishes, the old controller must be aborted or the old generator will continue writing into the new beat's state.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSE line parsing | Custom state machine | Split on `\n`, strip `data: ` prefix, JSON.parse | SSE format is simple enough for 10-line parser |
| Stream termination | Polling / timeout | `message_stop` event type or `reader.done` | Both reliably signal stream end |
| Cancellation | Timeout-based abort | `AbortController` signal passed to `fetch` | Native, cleans up the HTTP connection immediately |
| Fallback on error | Complex retry logic | `try/catch` in generator → caller uses `fallbackText` | Silent fallback is the locked UX decision |

**Key insight:** The entire streaming client is ~40 lines of TypeScript. Anything more suggests over-engineering.

---

## Common Pitfalls

### Pitfall 1: Split SSE Chunks
**What goes wrong:** `reader.read()` delivers arbitrary byte boundaries. A single `data: {"type":"content_block_delta"...}` line can be split across two reads. JSON.parse on a partial line throws, breaking the generator.
**Why it happens:** TCP packets and browser buffering do not align with SSE line boundaries.
**How to avoid:** Maintain a `buffer` string. After each `decoder.decode(value, { stream: true })`, split on `\n`, keep the last element (which may be incomplete) in `buffer`, process all others.
**Warning signs:** Intermittent "Unexpected end of JSON input" errors in the console, especially on the first or last chunk.

### Pitfall 2: Stale AbortController After Beat Advance
**What goes wrong:** User advances to a new beat while a stream is still running. The generator from the old beat continues yielding, writing into the new beat's state. The new beat renders the old beat's prose.
**Why it happens:** The generator runs asynchronously and does not know the beat has changed.
**How to avoid:** In `useStreamingTypewriter`, cancel the AbortController in the `useEffect` cleanup (the function returned from `useEffect`). This fires when `beatId` changes in the dependency array.
**Warning signs:** Text from a previous beat briefly appears in the next beat before being overwritten.

### Pitfall 3: isStreaming State Causing Flash
**What goes wrong:** `isStreaming` is set to `true` immediately on beat advance, but the first chunk arrives in < 2 seconds. If `LoadingSkeleton` shows for < 200ms before disappearing, it causes a visible flash instead of a smooth transition.
**Why it happens:** The shimmer-to-text transition has no minimum display time.
**How to avoid:** Accept the flash for PoC. If it is visually jarring, add a minimum shimmer duration of 300ms using a timestamp comparison when first chunk arrives.
**Warning signs:** Flashing white skeleton before text appears on fast connections.

### Pitfall 4: useTypewriter and useStreamingTypewriter Both Active
**What goes wrong:** If `StoryReaderPage` uses both hooks simultaneously (e.g., wrong conditional), they conflict over `displayedText` state and produce doubled or garbled output.
**Why it happens:** The hooks both drive character-by-character reveal independently.
**How to avoid:** Use a single ternary — beat-1 gets `useTypewriter`, all others get `useStreamingTypewriter`. Do not render both.
**Warning signs:** Text appearing twice, or random characters appearing mid-prose.

### Pitfall 5: Vitest jsdom Missing ReadableStream
**What goes wrong:** `ReadableStream` and `TextDecoder` are Web APIs not available in Node/jsdom. Tests of `claudeStream.ts` that call real fetch will fail with "ReadableStream is not defined".
**Why it happens:** Vitest runs in Node (jsdom environment), which does not fully implement browser streaming APIs.
**How to avoid:** Mock `fetch` entirely in tests. Supply a fake `ReadableStream` that yields pre-canned SSE lines. Never call real fetch in unit tests.
**Warning signs:** "ReferenceError: ReadableStream is not defined" in vitest output.

---

## Code Examples

### Verified SSE Wire Format (Official Docs)

Source: https://platform.claude.com/docs/en/build-with-claude/streaming

The exact event sequence for a streaming message:
```
event: message_start
data: {"type": "message_start", "message": {"id": "msg_...", "type": "message", "role": "assistant", "content": [], "model": "claude-haiku-4-5", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}
```

Text extraction: `event.delta.text` when `event.type === 'content_block_delta' && event.delta.type === 'text_delta'`.

### Required Headers for Browser Direct Access

```
x-api-key: <VITE_ANTHROPIC_API_KEY>
anthropic-version: 2023-06-01
anthropic-dangerous-direct-browser-access: true
content-type: application/json
```

The `anthropic-dangerous-direct-browser-access` header is required for direct browser calls. Without it, the API rejects browser-origin requests (CORS policy).

### AbortController Pattern for Tap-to-Cancel

```typescript
// In useStreamingTypewriter hook
const abortRef = useRef<AbortController>(new AbortController());

useEffect(() => {
  abortRef.current = new AbortController();
  // start streaming...
  return () => {
    abortRef.current.abort();  // cleanup on beat change or unmount
  };
}, [beatId]);  // re-run when beat changes

const completeInstantly = useCallback(() => {
  abortRef.current.abort();               // cancel in-flight fetch
  setDisplayedText(bufferRef.current);    // show all accumulated text
  setIsComplete(true);
}, []);
```

### Zustand Choice History Shape (from useChaptrStore.ts)

```typescript
type ChoiceRecord = {
  nodeId: string;     // e.g. 'beat-1'
  choiceIndex: number;
  label: string;      // e.g. 'Introduce yourself confidently...'
  timestamp: number;
};

// Access in StoryReaderPage:
const choiceHistory = useChaptrStore((s) => s.choiceHistory);
// Result: [{nodeId: 'beat-1', choiceIndex: 0, label: 'Introduce yourself...', timestamp: ...}]
```

Human-readable format for system prompt:
```typescript
choiceHistory.map(c => `- ${c.nodeId} → ${c.label}`).join('\n')
// Output: "- beat-1 → Introduce yourself confidently and walk toward the reception desk"
```

### useTypewriter Interface to Mirror Exactly

From `src/hooks/useTypewriter.ts` (lines 3-7):
```typescript
type UseTypewriterReturn = {
  displayedText: string;
  isComplete: boolean;
  completeInstantly: () => void;
};
```

`useStreamingTypewriter` must return these exact three fields. Additional internal state (buffer, streaming status, abort controller) must not be exposed in the return type — they are encapsulated inside the hook.

---

## Codebase Integration Map

### StoryReaderPage.tsx — Exact Change Points

| Line | Current | Change |
|------|---------|--------|
| 5 | `import { useTypewriter } from '../hooks/useTypewriter'` | Add import for `useStreamingTypewriter` |
| 30 | `const [isLoading] = useState(false)` | Change to `const [isStreaming, setIsStreaming] = useState(false)` |
| 44-46 | `useTypewriter(currentBeat.text)` | Conditional: beat-1 → `useTypewriter`, others → `useStreamingTypewriter` |
| 111 | `{isLoading ? <LoadingSkeleton />` | Change to `{isStreaming ? <LoadingSkeleton />` |

The `isChapterStart` field is already present on `beat-1` in `chapter1.ts` (line 34 of chapter1.ts). Use `currentBeat.isChapterStart === true` as the static-beat guard.

### chapter1.ts — No Changes Required
All `StoryBeat.text` fields are retained as fallback prose. The `isChapterStart`, `isChapterEnd`, `nextBeatId`, and `choices` fields are all unchanged. Claude only replaces the runtime prose, not the data structure.

### useChaptrStore.ts — No Changes Required
`choiceHistory: ChoiceRecord[]` is already typed and persisted. `recordChoice()` action is already called in `handleChoiceSelect()`. The store is ready to be read by `useStreamingTypewriter`.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `claude-3-haiku-20240307` | `claude-haiku-4-5` | April 2026 retirement | Old model ID must not appear in code |
| Anthropic SDK for browser | Direct fetch + SSE parsing | PoC decision | ~200KB bundle savings |
| Browser `EventSource` for SSE | `fetch` + `ReadableStream` | N/A | EventSource only supports GET — POST required for API |

**Deprecated:**
- `claude-3-haiku-20240307`: Retires April 19, 2026. All code must use `claude-haiku-4-5`.

---

## Open Questions

1. **min_tokens / response length control**
   - What we know: The system prompt requests 80-120 words. Claude may produce shorter or longer output.
   - What's unclear: Whether `min_tokens` parameter helps enforce this reliably.
   - Recommendation: Use system prompt instruction only (locked decision). Add word-count check to `claudeStream` if output quality is poor during QA.

2. **`import.meta.env` in tests**
   - What we know: Vite replaces `import.meta.env.VITE_ANTHROPIC_API_KEY` at build time. Vitest handles this via the `define` config.
   - What's unclear: Whether the current `vite.config.ts` (minimal, no test config) needs a `test.env` block.
   - Recommendation: In `claudeStream.test.ts`, mock `import.meta.env` directly with `vi.stubEnv('VITE_ANTHROPIC_API_KEY', 'test-key')` — Vitest supports this without config changes.

3. **`message_stop` vs reader `done`**
   - What we know: Both signal stream end. The generator will exit cleanly on either.
   - What's unclear: Whether there are race conditions between the two signals on abort.
   - Recommendation: Check `message_stop` event type first, then fall through to `reader.done`. On abort, catch the `AbortError` and return cleanly from the generator.

---

## Environment Availability

Step 2.6: SKIPPED — this phase adds no external CLI tools, databases, or services beyond the Anthropic REST API, which is accessed via HTTP from the browser. No local processes required.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.1.2 |
| Config file | None separate — vitest config is inline in vite.config.ts (currently absent, so vitest uses defaults: `environment: 'jsdom'` not explicitly set) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --reporter=verbose` |

**Note:** The vite.config.ts has no `test` block. Vitest defaults apply. The existing tests pass with jsdom (confirmed by existing test files using `@testing-library/react`). No config change is needed for Phase 5 tests.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AI-01 | `claude-haiku-4-5` is the model ID sent in every API request | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | Wave 0 |
| AI-02 | `anthropic-dangerous-direct-browser-access: true` header present in fetch call | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | Wave 0 |
| AI-03 | System prompt contains all 4 sections; prohibited phrases are in the constraint list | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | Wave 0 |
| AI-04 | `streamBeatProse` does not return choice labels or routing data; beat-1 is static | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | Wave 0 |
| AI-05 | Generator correctly accumulates split SSE chunks and yields only text_delta values | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | Wave 0 |
| AI-06 | `choiceHistory` from store is injected as bulleted list in system prompt | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | Wave 0 |
| AI-07 | Prohibited phrases appear in the system prompt string passed to API | unit | `npx vitest run src/__tests__/claudeStream.test.ts` | Wave 0 |
| AI-01 (UX) | Loading shimmer shows during streaming, disappears on first chunk | unit | `npx vitest run src/__tests__/useStreamingTypewriter.test.ts` | Wave 0 |
| AI-01 (UX) | `completeInstantly()` cancels fetch and reveals full buffer | unit | `npx vitest run src/__tests__/useStreamingTypewriter.test.ts` | Wave 0 |
| AI-01 (UX) | `isComplete` is false while streaming, true when done | unit | `npx vitest run src/__tests__/useStreamingTypewriter.test.ts` | Wave 0 |
| AI-01 (model ID) | `claude-3-haiku-20240307` does not appear anywhere in src/ | unit / grep | `grep -r 'claude-3-haiku' src/` | N/A — grep gate |

### Mock Strategy for Claude API in Tests

**Core principle:** Never call real fetch in unit tests. Mock fetch globally.

```typescript
// In claudeStream.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Construct a fake ReadableStream that yields pre-canned SSE lines
function makeSSEStream(events: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(event + '\n'));
      }
      controller.close();
    },
  });
}

const FAKE_SSE_EVENTS = [
  'event: content_block_delta',
  'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"You step"}}',
  '',
  'event: content_block_delta',
  'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" forward."}}',
  '',
  'event: message_stop',
  'data: {"type":"message_stop"}',
  '',
];

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    body: makeSSEStream(FAKE_SSE_EVENTS),
  }));
  vi.stubEnv('VITE_ANTHROPIC_API_KEY', 'test-key');
});
```

**Split chunk test** (critical for AI-05 buffer guard):
```typescript
it('handles split SSE chunks without JSON parse error', () => {
  // Simulate one data: line split across two reads
  const encoder = new TextEncoder();
  const part1 = 'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hel"';
  const part2 = 'lo"}}\n\ndata: {"type":"message_stop","type":"message_stop"}\n\n';
  // Supply via ReadableStream that yields these two chunks
  // Generator must yield 'Hel' + 'lo' separately or 'Hello' combined
  // No JSON parse error thrown
});
```

**useStreamingTypewriter tests** follow the same `renderHook` + `vi.useFakeTimers()` pattern as `useTypewriter.test.ts`. The stream mock is set up in `beforeEach`, and `act()` wraps state updates.

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/claudeStream.test.ts src/__tests__/useStreamingTypewriter.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/claudeStream.test.ts` — covers AI-01 through AI-07 (generator behavior, headers, system prompt, buffer guard)
- [ ] `src/__tests__/useStreamingTypewriter.test.ts` — covers hook interface parity, isStreaming state, completeInstantly cancellation
- [ ] `src/lib/claudeStream.ts` — the module being tested (new file)
- [ ] `src/hooks/useStreamingTypewriter.ts` — the hook being tested (new file)

*(Existing test infrastructure is sufficient — no config changes needed. jsdom environment and fake timers already work as proven by `useTypewriter.test.ts`.)*

---

## Sources

### Primary (HIGH confidence)
- https://platform.claude.com/docs/en/build-with-claude/streaming — Full SSE event sequence, exact wire format, `text_delta` structure, termination via `message_stop`, `anthropic-dangerous-direct-browser-access` header requirement
- `src/hooks/useTypewriter.ts` — Exact interface to mirror (`displayedText`, `isComplete`, `completeInstantly`)
- `src/store/useChaptrStore.ts` — `ChoiceRecord` type and `choiceHistory` field shape
- `src/pages/StoryReaderPage.tsx` — Exact lines to change; current `isLoading` wiring
- `src/data/chapter1.ts` — Beat structure, `isChapterStart` flag on beat-1, `StoryBeat.text` as fallback
- `package.json` — vitest ^4.1.2, @testing-library/react ^16.3.2 (both installed, no new deps needed)

### Secondary (MEDIUM confidence)
- `src/__tests__/useTypewriter.test.ts` — Pattern reference for fake timers + renderHook in this codebase
- `src/__tests__/useChaptrStore.test.ts` — Pattern reference for Zustand store testing (setState + getState)
- `src/__tests__/StoryReaderPage.test.tsx` — Pattern reference for mocking framer-motion, react-router, and sub-components

### Tertiary (LOW confidence)
- None — all critical claims verified from official docs or direct codebase inspection.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed, no new dependencies
- SSE event format: HIGH — verified from official Anthropic streaming docs
- Architecture: HIGH — based on direct codebase read of exact files to be changed
- Pitfalls: HIGH — buffer guard and AbortController patterns are well-documented; split-chunk issue is a known fetch streaming gotcha
- Test strategy: HIGH — existing tests establish exact vitest/renderHook/fakeTimers pattern to follow

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (API format stable; model ID retirement date April 19, 2026 means `claude-haiku-4-5` must be in use by then)

---

## RESEARCH COMPLETE

**Phase:** 5 - AI Story Engine
**Confidence:** HIGH

### Key Findings

- No new npm packages needed. All dependencies (Vitest, @testing-library/react, fetch, AbortController) are already in the project.
- Anthropic SSE terminator is `message_stop` event, not `[DONE]`. This is the most common implementation error when migrating from OpenAI streaming.
- The buffer guard (keeping the last incomplete line across `reader.read()` calls) is mandatory. Omitting it causes intermittent JSON parse errors on split chunks.
- `useStreamingTypewriter` must return exactly `{ displayedText, isComplete, completeInstantly }` — the same three fields as `useTypewriter` — so `StoryReaderPage` changes are limited to 4 lines.
- The `choiceHistory: ChoiceRecord[]` array in Zustand is already populated by `recordChoice()` calls in `handleChoiceSelect()`. No store changes needed for AI-06.
- Beat-1 static guard: `currentBeat.isChapterStart === true`. This field is already set in `chapter1.ts`.

### Files Created
`C:\Users\ASUS\projects\chaptr\.planning\phases\05-ai-story-engine\05-RESEARCH.md`

### Confidence Assessment
| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | All packages pre-installed; verified from package.json |
| SSE Protocol | HIGH | Verified from official Anthropic streaming docs; full wire format captured |
| Architecture | HIGH | Based on direct read of all 4 integration point files |
| Pitfalls | HIGH | Split-chunk and AbortController patterns verified; flash UX is observable not speculative |
| Test Strategy | HIGH | Existing test files establish exact patterns to follow |

### Open Questions
- Whether `min_tokens` parameter improves prose length consistency (LOW impact, can validate during QA)
- Whether `import.meta.env` needs explicit vitest stubbing or works via default vite config (LOW risk — `vi.stubEnv` resolves it)

### Ready for Planning
Research complete. Planner can now create PLAN.md files targeting `src/lib/claudeStream.ts`, `src/hooks/useStreamingTypewriter.ts`, modifications to `src/pages/StoryReaderPage.tsx`, and two new test files.
