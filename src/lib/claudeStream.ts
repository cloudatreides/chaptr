import type { ChoiceRecord } from '../store/useChaptrStore';
import type { StoryBeat } from '../data/mockStoryData';

export type StreamBeatParams = {
  beatId: string;
  choiceHistory: ChoiceRecord[];
  currentBeat: StoryBeat;
  signal: AbortSignal;
};

export function buildSystemPrompt(choiceHistory: ChoiceRecord[], currentBeat: StoryBeat): string {
  throw new Error('Not implemented');
}

export async function* streamBeatProse(params: StreamBeatParams): AsyncGenerator<string> {
  throw new Error('Not implemented');
}
