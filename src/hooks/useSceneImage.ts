import { useState, useEffect, useRef } from 'react';
import { generateSceneImage } from '../lib/imageGen';
import type { StoryBeat } from '../data/chapter1';

// In-memory cache so revisited beats don't re-generate
const imageCache = new Map<string, string>();

export function useSceneImage(beat: StoryBeat) {
  const [generatedSrc, setGeneratedSrc] = useState<string | undefined>(
    imageCache.get(beat.id)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // If beat already has a static sceneImage or we have a cached result, skip
    if (beat.isChapterStart) {
      // Keep the static image for chapter start (has protagonist overlay)
      setGeneratedSrc(undefined);
      return;
    }

    const cached = imageCache.get(beat.id);
    if (cached) {
      setGeneratedSrc(cached);
      return;
    }

    // Generate new image
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);

    generateSceneImage(beat, controller.signal)
      .then((url) => {
        if (!controller.signal.aborted) {
          imageCache.set(beat.id, url);
          setGeneratedSrc(url);
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.warn('Scene image generation failed, using fallback:', err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsGenerating(false);
      });

    return () => {
      controller.abort();
      abortRef.current = null;
    };
  }, [beat.id]);

  return {
    sceneSrc: generatedSrc,
    isGenerating,
  };
}
