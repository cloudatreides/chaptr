import { describe, it, expect } from 'vitest';
import { chapter1 } from '../data/chapter1';

describe('chapter1 graph integrity (STORY-01)', () => {
  it('all nextBeatId references on beats exist in beats record', () => {
    for (const beat of Object.values(chapter1.beats)) {
      if (beat.nextBeatId) {
        expect(chapter1.beats[beat.nextBeatId], `beat.nextBeatId "${beat.nextBeatId}" not found`).toBeDefined();
      }
    }
  });

  it('all StoryChoice.nextBeatId references exist in beats record', () => {
    for (const beat of Object.values(chapter1.beats)) {
      for (const choice of beat.choices) {
        expect(chapter1.beats[choice.nextBeatId], `choice "${choice.id}" nextBeatId "${choice.nextBeatId}" not found`).toBeDefined();
      }
    }
  });

  it('first choice appears within 300 words of beat-1', () => {
    const startBeat = chapter1.beats[chapter1.startBeatId];
    expect(startBeat).toBeDefined();
    const wordCount = startBeat.text.trim().split(/\s+/).length;
    expect(wordCount).toBeLessThanOrEqual(300);
    expect(startBeat.choices.length).toBeGreaterThan(0);
  });

  it('at least 3 choices branch and resolve with no dead ends', () => {
    // Count beats that have choices (branching points)
    const beatsWithChoices = Object.values(chapter1.beats).filter((b) => b.choices.length > 0);
    expect(beatsWithChoices.length).toBeGreaterThanOrEqual(3);
  });

  it('full playthrough from startBeatId reaches isChapterEnd without undefined beat', () => {
    // Simulate traversal: follow startBeatId, then nextBeatId (prose-only) or first choice (choice beats)
    let beatId = chapter1.startBeatId;
    const visited = new Set<string>();
    while (true) {
      expect(chapter1.beats[beatId], `beat "${beatId}" not found`).toBeDefined();
      const beat = chapter1.beats[beatId];
      if (beat.isChapterEnd) break;
      if (visited.has(beatId)) throw new Error(`Cycle detected at ${beatId}`);
      visited.add(beatId);
      if (beat.nextBeatId) {
        beatId = beat.nextBeatId;
      } else if (beat.choices.length > 0) {
        beatId = beat.choices[0].nextBeatId;
      } else {
        throw new Error(`Dead end at beat "${beatId}" — no nextBeatId and no choices`);
      }
    }
    expect(chapter1.beats[beatId].isChapterEnd).toBe(true);
  });
});

describe('chapter1 prose requirements (STORY-02)', () => {
  it('[Name] token present in at least one beat', () => {
    const hasNameToken = Object.values(chapter1.beats).some((b) => b.text.includes('[Name]'));
    expect(hasNameToken).toBe(true);
  });

  it('no prose describes protagonist physical appearance', () => {
    const bannedPhrases = ['her hair', 'his hair', 'her eyes', 'his eyes', 'her skin', 'his skin', 'her face', 'his face', 'she had', 'he had'];
    for (const beat of Object.values(chapter1.beats)) {
      for (const phrase of bannedPhrases) {
        expect(beat.text.toLowerCase(), `beat "${beat.id}" contains banned phrase "${phrase}"`).not.toContain(phrase);
      }
    }
  });
});

describe('chapter1 world integrity (STORY-03)', () => {
  it('no real celebrity names appear in any beat text', () => {
    const bannedNames = ['bts', 'exo', 'blackpink', 'twice', 'stray kids', 'nct', 'seventeen', 'got7', 'big bang', 'shinee', 'aespa', 'ive', 'newjeans', 'lee jun', 'kim nam', 'park jimin', 'jungkook', 'taehyung', 'suga', 'j-hope', 'jin'];
    for (const beat of Object.values(chapter1.beats)) {
      for (const name of bannedNames) {
        expect(beat.text.toLowerCase(), `beat "${beat.id}" contains real name "${name}"`).not.toContain(name);
      }
    }
  });
});
