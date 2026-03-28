import { useState, useEffect, useRef, useCallback } from 'react';
import { streamBeatProse } from '../lib/claudeStream';
import type { ChoiceRecord } from '../store/useChaptrStore';
import type { StoryBeat } from '../data/mockStoryData';

export type UseStreamingTypewriterParams = {
  beatId: string;
  choiceHistory: ChoiceRecord[];
  currentBeat: StoryBeat;
  isStaticBeat: boolean;
  fallbackText: string;
};

export type UseStreamingTypewriterReturn = {
  displayedText: string;
  isComplete: boolean;
  completeInstantly: () => void;
};

export function useStreamingTypewriter(
  params: UseStreamingTypewriterParams
): UseStreamingTypewriterReturn {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const abortRef = useRef<AbortController>(new AbortController());
  const bufferRef = useRef('');
  const isCancelledRef = useRef(false);

  const completeInstantly = useCallback(() => {
    abortRef.current.abort();
    isCancelledRef.current = true;
    setDisplayedText(bufferRef.current);
    setIsComplete(true);
  }, []);

  useEffect(() => {
    // Static beat: show fallback text immediately, no API call
    if (params.isStaticBeat) {
      setDisplayedText(params.fallbackText);
      setIsComplete(true);
      return;
    }

    // Reset state for new streaming beat
    bufferRef.current = '';
    isCancelledRef.current = false;
    setDisplayedText('');
    setIsComplete(false);

    abortRef.current = new AbortController();

    async function runStream() {
      try {
        for await (const chunk of streamBeatProse({
          beatId: params.beatId,
          choiceHistory: params.choiceHistory,
          currentBeat: params.currentBeat,
          signal: abortRef.current.signal,
        })) {
          if (isCancelledRef.current) return;
          bufferRef.current += chunk;
          setDisplayedText(bufferRef.current);
        }
        // Stream completed naturally
        if (!isCancelledRef.current) {
          setIsComplete(true);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        // On any error, fall back to static text
        bufferRef.current = params.fallbackText;
        setDisplayedText(params.fallbackText);
        setIsComplete(true);
      }
    }

    runStream();

    return () => {
      isCancelledRef.current = true;
      abortRef.current.abort();
    };
  }, [params.beatId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { displayedText, isComplete, completeInstantly };
}
