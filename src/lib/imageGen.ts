import type { StoryBeat } from '../data/chapter1';

const TOGETHER_API_URL = 'https://api.together.xyz/v1/images/generations';

/**
 * Build a scene image prompt from beat context.
 * Extracts setting + mood from the beat text and formats for anime-style generation.
 */
export function buildScenePrompt(beat: StoryBeat): string {
  // Map beat IDs to scene descriptions for better image gen
  const sceneHints: Record<string, string> = {
    'beat-1': 'Grand luxury entertainment company lobby, polished marble floors, recessed ceiling lights, crescent-shaped reception desk, floor-to-ceiling LED wall showing K-pop teasers, jasmine atmosphere',
    'beat-2a': 'Entertainment company lobby reception desk, marble counter, trainee ID lanyard, tall handsome young man with half-smile approaching, polished corporate K-pop atmosphere',
    'beat-2b': 'Entertainment company lobby near glass entrance doors, group of young trainees in corridor, girl with electric-blue hair streaks, energetic atmosphere',
    'beat-2b-2': 'Modern corporate corridor, elevator, young woman with blue-streaked hair leading the way, floor indicator lights, sleek interior',
    'beat-2c': 'Close encounter in grand lobby, tall handsome young man holding slim black card, pillar behind him, dramatic lighting, K-pop idol presence',
    'beat-3': 'Modern dance studio corridor, frosted glass panels labeled Studio A B C, silhouettes dancing behind glass, pulsing ambient light, polished floors',
    'beat-4': 'Dance studio doorway, young man leaning against door frame, music and light spilling from open door, dramatic corridor lighting',
    'beat-5': 'Inside professional dance studio, mirror wall, four dancers in synchronized formation, choreographer calling counts, dramatic studio lighting, beginning of something new',
  };

  const hint = sceneHints[beat.id] || 'K-pop entertainment company interior, dramatic lighting, cinematic mood';

  return `Anime illustration, webtoon style, cinematic lighting, dramatic mood, dark atmospheric tones. ${hint}. High quality, detailed background, no text, no watermark.`;
}

/**
 * Generate a scene image using Together AI's FLUX.1 Schnell model.
 * Returns a base64 data URL or throws on failure.
 */
export async function generateSceneImage(
  beat: StoryBeat,
  signal?: AbortSignal
): Promise<string> {
  const apiKey = import.meta.env.VITE_TOGETHER_API_KEY;
  if (!apiKey) throw new Error('VITE_TOGETHER_API_KEY not set');

  const prompt = buildScenePrompt(beat);

  const response = await fetch(TOGETHER_API_URL, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell',
      prompt,
      width: 1024,
      height: 576, // 16:9 for scene images
      steps: 4,
      n: 1,
      response_format: 'b64_json',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Image gen failed (${response.status}): ${err}`);
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error('No image data in response');

  return `data:image/png;base64,${b64}`;
}
