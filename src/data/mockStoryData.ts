export type StoryChoice = {
  id: string;
  text: string;
  gemCost: number; // 0 = free
  nextBeatId: string;
};

export type StoryBeat = {
  id: string;
  text: string;
  sceneImage?: string;
  choices: StoryChoice[];
  isChapterStart?: boolean;
  isChapterEnd?: boolean;
};

export type Chapter = {
  id: string;
  title: string;
  beats: Record<string, StoryBeat>;
  startBeatId: string;
};

export const mockChapter1: Chapter = {
  id: 'seoul-transfer-ch1',
  title: 'Chapter 1: First Day',
  startBeatId: 'beat-1',
  beats: {
    'beat-1': {
      id: 'beat-1',
      text: 'You step through the glass doors of NOVA Entertainment and the world shifts. The lobby is cavernous -- polished marble floors reflecting a constellation of recessed lights overhead. A reception desk curves like a crescent moon along the far wall, staffed by two women in matching black blazers who glance up in unison. To your left, a floor-to-ceiling LED wall cycles through VEIL comeback teasers. The air smells faintly of jasmine and ambition. A tall figure leans against the far pillar, arms crossed, watching you with sharp, curious eyes. It takes [Name] a full second to recognize him from the profiles -- that is Jiwoo, lead vocalist of VEIL, and he is looking directly at you.',
      sceneImage: undefined,
      isChapterStart: true,
      choices: [
        { id: 'c1a', text: 'Introduce yourself confidently and walk toward the reception desk', gemCost: 0, nextBeatId: 'beat-2a' },
        { id: 'c1b', text: 'Hang back near the entrance and observe the lobby quietly', gemCost: 0, nextBeatId: 'beat-2b' },
        { id: 'c1c', text: 'Walk straight up to Jiwoo and ask if he is lost', gemCost: 10, nextBeatId: 'beat-2c' },
      ],
    },
    'beat-2a': {
      id: 'beat-2a',
      text: 'The room quiets as [Name] steps forward, heels clicking against the marble with a confidence that surprises even you. One of the receptionists raises an eyebrow -- not unkindly, but appraisingly. "Transfer student?" she asks before you even reach the desk. Behind you, you hear a low whistle. Jiwoo has pushed off the pillar and is walking in your direction, hands in his pockets, a half-smile playing at his lips. "Bold entrance," he says, just loud enough for you to hear. The receptionist slides a lanyard across the counter -- your trainee ID, your name printed in clean sans-serif beneath the NOVA logo.',
      choices: [
        { id: 'c2a1', text: 'Thank Jiwoo and clip on the lanyard', gemCost: 0, nextBeatId: 'beat-3' },
        { id: 'c2a2', text: 'Ignore Jiwoo and ask the receptionist where training begins', gemCost: 0, nextBeatId: 'beat-3' },
      ],
    },
    'beat-2b': {
      id: 'beat-2b',
      text: '[Name] lingers near the glass doors, letting the lobby wash over you. From here you can see everything -- the practiced smiles of the staff, the security cameras tucked into ceiling corners, the way Jiwoo shifts his weight like someone used to being watched. A group of trainees bursts through a side corridor, laughing and shoving each other playfully. One of them -- shorter, with electric-blue streaks in her hair -- spots you and freezes mid-laugh. "Oh! You must be the new one," she says, breaking away from the group and bounding over. "I am Mina. Everyone has been talking about you."',
      choices: [
        { id: 'c2b1', text: 'Smile at Mina and ask what people have been saying', gemCost: 0, nextBeatId: 'beat-3' },
        { id: 'c2b2', text: 'Nod politely and scan the room for someone official', gemCost: 0, nextBeatId: 'beat-3' },
      ],
    },
    'beat-2c': {
      id: 'beat-2c',
      text: 'Jiwoo blinks. Once. Then a slow grin spreads across his face, the kind that has launched a thousand fan edits. "Lost?" he repeats, tilting his head. "In my own building?" He pushes off the pillar and closes the distance between you in two easy strides. Up close, he is taller than the photos suggest, and his eyes hold a warmth that the stage presence conceals. "You are the transfer," he says -- not a question. "They said you would be interesting." He reaches into his jacket pocket and produces a slim black card. "Studio B. Third floor. Do not be late." He drops the card into [Name]\'s hand and walks away without looking back.',
      choices: [
        { id: 'c2c1', text: 'Head straight to Studio B, card in hand', gemCost: 0, nextBeatId: 'beat-3' },
        { id: 'c2c2', text: 'Examine the black card more closely before going anywhere', gemCost: 15, nextBeatId: 'beat-3' },
      ],
    },
    'beat-3': {
      id: 'beat-3',
      text: 'The elevator doors slide open onto the third floor and the sound hits [Name] first -- a low, pulsing bassline that vibrates through the soles of your shoes. The corridor stretches ahead, lined with frosted-glass doors, each one labeled with a letter. Studio A. Studio B. Studio C. Through the glass of Studio B, you can make out silhouettes moving in unison -- the sharp, synchronized geometry of idol choreography. This is it. The place where trainees become stars, where NOVA Entertainment decides who rises and who fades. [Name] takes a breath. Whatever happens next, there is no going back to the person who walked through those lobby doors.',
      isChapterEnd: true,
      choices: [],
    },
  },
};
