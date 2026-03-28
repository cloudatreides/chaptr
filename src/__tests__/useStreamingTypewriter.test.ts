import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useStreamingTypewriter } from '../hooks/useStreamingTypewriter';
import type { StoryBeat } from '../data/mockStoryData';
import type { UseStreamingTypewriterParams } from '../hooks/useStreamingTypewriter';

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

function makeParams(overrides?: Partial<UseStreamingTypewriterParams>): UseStreamingTypewriterParams {
  return {
    beatId: 'beat-2a',
    choiceHistory: [],
    currentBeat: TEST_BEAT,
    isStaticBeat: false,
    fallbackText: 'Fallback text for testing.',
    ...overrides,
  };
}

describe('useStreamingTypewriter', () => {
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

  it('returns displayedText, isComplete, completeInstantly', () => {
    const { result } = renderHook(() =>
      useStreamingTypewriter(makeParams({ isStaticBeat: true }))
    );

    expect(result.current).toHaveProperty('displayedText');
    expect(result.current).toHaveProperty('isComplete');
    expect(result.current).toHaveProperty('completeInstantly');
    expect(typeof result.current.completeInstantly).toBe('function');
  });

  it('static beat returns fallback text without calling fetch', () => {
    const { result } = renderHook(() =>
      useStreamingTypewriter(makeParams({
        isStaticBeat: true,
        fallbackText: 'Static text here',
      }))
    );

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.displayedText).toBe('Static text here');
    expect(result.current.isComplete).toBe(true);
  });

  it('accumulates streamed chunks into displayedText', async () => {
    const { result } = renderHook(() =>
      useStreamingTypewriter(makeParams({ isStaticBeat: false }))
    );

    await waitFor(() => {
      expect(result.current.displayedText).toBe('You step forward.');
    });

    expect(result.current.isComplete).toBe(true);
  });

  it('completeInstantly aborts stream and reveals buffer', async () => {
    // Use a stream that yields one chunk then hangs (never closes)
    const encoder = new TextEncoder();
    const hangingStream = new ReadableStream<Uint8Array>({
      start(controller) {
        const events = [
          'event: content_block_delta\n',
          'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Partial text"}}\n',
          '\n',
        ];
        for (const e of events) {
          controller.enqueue(encoder.encode(e));
        }
        // Never close — simulates ongoing stream
      },
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, body: hangingStream })
    );

    const { result } = renderHook(() =>
      useStreamingTypewriter(makeParams({ isStaticBeat: false }))
    );

    // Wait for partial text to arrive
    await waitFor(() => {
      expect(result.current.displayedText).toBe('Partial text');
    });

    // Call completeInstantly
    act(() => {
      result.current.completeInstantly();
    });

    expect(result.current.isComplete).toBe(true);
    expect(result.current.displayedText).toBe('Partial text');
  });

  it('resets on beatId change', async () => {
    const { result, rerender } = renderHook(
      (props: UseStreamingTypewriterParams) => useStreamingTypewriter(props),
      { initialProps: makeParams({ beatId: 'beat-2a', isStaticBeat: false }) }
    );

    // Wait for first stream to complete
    await waitFor(() => {
      expect(result.current.displayedText).toBe('You step forward.');
    });

    // Provide fresh stream for second beat
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        body: makeSSEStream([
          'event: content_block_delta',
          'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"New beat text"}}',
          '',
          'event: message_stop',
          'data: {"type":"message_stop"}',
          '',
        ]),
      })
    );

    // Change beatId
    rerender(makeParams({ beatId: 'beat-3a', isStaticBeat: false }));

    // displayedText should reset then accumulate new text
    await waitFor(() => {
      expect(result.current.displayedText).toBe('New beat text');
    });
  });

  it('falls back to fallbackText on stream error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error'))
    );

    const { result } = renderHook(() =>
      useStreamingTypewriter(makeParams({
        isStaticBeat: false,
        fallbackText: 'Fallback text for testing.',
      }))
    );

    await waitFor(() => {
      expect(result.current.displayedText).toBe('Fallback text for testing.');
    });

    expect(result.current.isComplete).toBe(true);
  });
});
