import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from '../hooks/useTypewriter';

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('typewriter reveals text character by character', () => {
    const { result } = renderHook(() => useTypewriter('Hello', 30));

    expect(result.current.displayedText).toBe('');
    expect(result.current.isComplete).toBe(false);

    // Advance one tick (30ms) -- first character
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(result.current.displayedText).toBe('H');

    // Advance another tick -- second character
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(result.current.displayedText).toBe('He');

    // Advance another tick -- third character
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(result.current.displayedText).toBe('Hel');
  });

  it('typewriter sets isComplete true when full text revealed', () => {
    const { result } = renderHook(() => useTypewriter('Hi', 30));

    // Advance through all characters: 2 chars + initial delay + completion check
    act(() => {
      vi.advanceTimersByTime(30 * 5);
    });

    expect(result.current.displayedText).toBe('Hi');
    expect(result.current.isComplete).toBe(true);
  });

  it('skip completeInstantly shows all text immediately', () => {
    const { result } = renderHook(() => useTypewriter('Hello World', 30));

    act(() => {
      result.current.completeInstantly();
    });

    expect(result.current.displayedText).toBe('Hello World');
    expect(result.current.isComplete).toBe(true);
  });

  it('typewriter resets on new text', () => {
    const { result, rerender } = renderHook(
      ({ text }) => useTypewriter(text, 30),
      { initialProps: { text: 'Hello' } }
    );

    // Advance partway
    act(() => {
      vi.advanceTimersByTime(90);
    });
    expect(result.current.displayedText.length).toBeGreaterThan(0);

    // Change text
    rerender({ text: 'New text' });

    expect(result.current.displayedText).toBe('');
    expect(result.current.isComplete).toBe(false);
  });
});
