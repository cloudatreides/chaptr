import type { ChoiceRecord } from '../store/useChaptrStore';
import type { StoryBeat } from '../data/mockStoryData';

export type StreamBeatParams = {
  beatId: string;
  choiceHistory: ChoiceRecord[];
  currentBeat: StoryBeat;
  signal: AbortSignal;
};

export function buildSystemPrompt(choiceHistory: ChoiceRecord[], currentBeat: StoryBeat): string {
  const storyStateBlock =
    choiceHistory.length > 0
      ? choiceHistory.map((c) => `- ${c.nodeId} → ${c.label}`).join('\n')
      : '- No choices made yet';

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
Scene: ${currentBeat.sceneImage ? 'See scene context' : 'continuation'}

OUTPUT CONSTRAINTS
- Write exactly one prose paragraph of 80-120 words
- Second-person present tense ("You step", "You notice")
- No choices, no dialogue tags after prose ends
- Do not use: "her heart skipped a beat", "suddenly", "she couldn't help but"
- Do not describe protagonist's physical appearance
- Do not reference real K-pop artists or groups`.trim();
}

export async function* streamBeatProse(params: StreamBeatParams): AsyncGenerator<string> {
  try {
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

    if (!response.ok || !response.body) {
      throw new Error('API error: ' + response.status);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6).trim();
        if (!json) continue;
        const event = JSON.parse(json);

        if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
          yield event.delta.text;
        }

        if (event.type === 'message_stop') return;
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    throw err;
  }
}
