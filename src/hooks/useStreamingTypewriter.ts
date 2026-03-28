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

export function useStreamingTypewriter(params: UseStreamingTypewriterParams): UseStreamingTypewriterReturn {
  throw new Error('Not implemented');
}
