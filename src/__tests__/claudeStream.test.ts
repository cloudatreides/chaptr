import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { streamBeatProse, buildSystemPrompt } from '../lib/claudeStream';
import type { StreamBeatParams } from '../lib/claudeStream';
import type { ChoiceRecord } from '../store/useChaptrStore';
import type { StoryBeat } from '../data/mockStoryData';

// --- Helpers ---

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
  'event: message_start',
  'data: {"type":"message_start","message":{"id":"msg_test","type":"message","role":"assistant","content":[],"model":"claude-haiku-4-5"}}',
  '',
  'event: content_block_start',
  'data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}',
  '',
  'event: ping',
  'data: {"type":"ping"}',
  '',
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

const TEST_BEAT: StoryBeat = {
  id: 'beat-2a',
  text: 'Fallback text for testing.',
  choices: [],
};

function makeParams(overrides?: Partial<StreamBeatParams>): StreamBeatParams {
  return {
    beatId: 'beat-2a',
    choiceHistory: [],
    currentBeat: TEST_BEAT,
    signal: new AbortController().signal,
    ...overrides,
  };
}

// --- Tests ---

describe('streamBeatProse', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        body: makeSSEStream(FAKE_SSE_EVENTS),
      })
    );
    vi.stubEnv('VITE_ANTHROPIC_API_KEY', 'test-key');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('sends request with claude-haiku-4-5 model', async () => {
    const gen = streamBeatProse(makeParams());
    // Consume generator fully
    const chunks: string[] = [];
    for await (const chunk of gen) {
      chunks.push(chunk);
    }

    expect(fetch).toHaveBeenCalledOnce();
    const callArgs = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.model).toBe('claude-haiku-4-5');
  });

  it('includes anthropic-dangerous-direct-browser-access header', async () => {
    const gen = streamBeatProse(makeParams());
    for await (const _ of gen) {
      /* consume */
    }

    const callArgs = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = callArgs[1].headers;
    expect(headers['anthropic-dangerous-direct-browser-access']).toBe('true');
    expect(headers['x-api-key']).toBe('test-key');
  });

  it('yields only text_delta content', async () => {
    const gen = streamBeatProse(makeParams());
    const chunks: string[] = [];
    for await (const chunk of gen) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['You step', ' forward.']);
  });

  it('handles split SSE chunks without JSON parse error', async () => {
    const encoder = new TextEncoder();
    const part1 =
      'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hel';
    const part2 =
      'lo"}}\n\nevent: message_stop\ndata: {"type":"message_stop"}\n\n';

    const splitStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(part1));
        controller.enqueue(encoder.encode(part2));
        controller.close();
      },
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        body: splitStream,
      })
    );

    const gen = streamBeatProse(makeParams());
    const chunks: string[] = [];
    for await (const chunk of gen) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['Hello']);
  });

  it('terminates on message_stop event', async () => {
    const gen = streamBeatProse(makeParams());
    const chunks: string[] = [];
    for await (const chunk of gen) {
      chunks.push(chunk);
    }

    // Generator should complete (not hang)
    expect(chunks.length).toBeGreaterThan(0);
  });

  it('handles AbortError gracefully', async () => {
    const controller = new AbortController();

    // Create a stream that yields one chunk then waits forever
    const slowStream = new ReadableStream<Uint8Array>({
      start(ctrl) {
        const encoder = new TextEncoder();
        ctrl.enqueue(
          encoder.encode(
            'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"First"}}\n\n'
          )
        );
        // Don't close -- simulate slow stream
      },
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        body: slowStream,
      })
    );

    const gen = streamBeatProse(makeParams({ signal: controller.signal }));
    const chunks: string[] = [];

    // Read first chunk then abort
    const firstResult = await gen.next();
    if (!firstResult.done) {
      chunks.push(firstResult.value);
    }
    controller.abort();

    // Generator should complete without throwing
    try {
      for await (const chunk of gen) {
        chunks.push(chunk);
      }
    } catch {
      // AbortError should NOT propagate
      expect.fail('AbortError should not propagate from generator');
    }

    expect(chunks).toContain('First');
  });
});

describe('buildSystemPrompt', () => {
  it('contains all required sections', () => {
    const prompt = buildSystemPrompt([], TEST_BEAT);

    expect(prompt).toContain('CHARACTER BIBLE');
    expect(prompt).toContain('STORY STATE');
    expect(prompt).toContain('OUTPUT CONSTRAINTS');
  });

  it('contains prohibited phrases', () => {
    const prompt = buildSystemPrompt([], TEST_BEAT);

    expect(prompt).toContain('her heart skipped a beat');
    expect(prompt).toContain('suddenly');
    expect(prompt).toContain("she couldn't help but");
  });

  it('includes choice history as bulleted list', () => {
    const history: ChoiceRecord[] = [
      { nodeId: 'beat-1', choiceIndex: 0, label: 'Walk forward', timestamp: 0 },
    ];

    const prompt = buildSystemPrompt(history, TEST_BEAT);

    expect(prompt).toContain('- beat-1');
    expect(prompt).toContain('Walk forward');
  });
});
