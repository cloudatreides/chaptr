import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStreamingTypewriter } from '../hooks/useStreamingTypewriter';
import type { StoryBeat } from '../data/mockStoryData';

const TEST_BEAT: StoryBeat = {
  id: 'beat-2a',
  text: 'Fallback text for testing.',
  choices: [],
};

describe('useStreamingTypewriter', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns displayedText, isComplete, completeInstantly', () => {
    const { result } = renderHook(() =>
      useStreamingTypewriter({
        beatId: 'beat-2a',
        choiceHistory: [],
        currentBeat: TEST_BEAT,
        isStaticBeat: true,
        fallbackText: 'Test',
      })
    );

    expect(result.current).toHaveProperty('displayedText');
    expect(result.current).toHaveProperty('isComplete');
    expect(result.current).toHaveProperty('completeInstantly');
    expect(typeof result.current.completeInstantly).toBe('function');
  });

  it('static beat returns fallback text without calling fetch', () => {
    renderHook(() =>
      useStreamingTypewriter({
        beatId: 'beat-2a',
        choiceHistory: [],
        currentBeat: TEST_BEAT,
        isStaticBeat: true,
        fallbackText: 'Static text here',
      })
    );

    expect(fetch).not.toHaveBeenCalled();
  });
});
