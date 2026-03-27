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
