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
  sceneGradient?: string;   // Tailwind bg-gradient-to-b class for placeholder scenes
  choices: StoryChoice[];
  nextBeatId?: string;      // NEW — for prose-only beats with no choices
  isChapterStart?: boolean;
  isChapterEnd?: boolean;
};

export type Chapter = {
  id: string;
  title: string;
  beats: Record<string, StoryBeat>;
  startBeatId: string;
};

export const chapter1: Chapter = {
  id: 'seoul-transfer-ch1',
  title: 'Chapter 1: First Day',
  startBeatId: 'beat-1',
  beats: {
    'beat-1': {
      id: 'beat-1',
      text: 'You step through the glass doors of NOVA Entertainment and the world shifts. The lobby is cavernous -- polished marble floors reflecting a constellation of recessed lights overhead. A reception desk curves like a crescent moon along the far wall, staffed by two women in matching black blazers who glance up in unison. To your left, a floor-to-ceiling LED wall cycles through VEIL comeback teasers. The air smells faintly of jasmine and ambition. A tall figure leans against the far pillar, arms crossed, watching you with sharp, curious eyes. It takes [Name] a full second to recognize him from the profiles -- that is Jiwoo, lead vocalist of VEIL, and he is looking directly at you.',
      isChapterStart: true,
      sceneImage: '/scene-studio.jpeg',
      sceneGradient: 'bg-gradient-to-b from-[#D4AF37]/20 via-[#9B7EC8]/15 to-[#0D0B12]',
      choices: [
        { id: 'c1a', text: 'Introduce yourself confidently and walk toward the reception desk', gemCost: 0, nextBeatId: 'beat-2a' },
        { id: 'c1b', text: 'Hang back near the entrance and observe the lobby quietly', gemCost: 0, nextBeatId: 'beat-2b' },
        { id: 'c1c', text: 'Walk straight up to Jiwoo and ask if he is lost', gemCost: 10, nextBeatId: 'beat-2c' },
      ],
    },
    'beat-2a': {
      id: 'beat-2a',
      sceneImage: '/scene-studio.jpeg',
      text: 'The room quiets as [Name] steps forward, heels clicking against the marble with a confidence that surprises even you. One of the receptionists raises an eyebrow -- not unkindly, but appraisingly. "Transfer student?" she asks before you even reach the desk. Behind you, you hear a low whistle. Jiwoo has pushed off the pillar and is walking in your direction, hands in his pockets, a half-smile playing at his lips. "Bold entrance," he says, just loud enough for you to hear. The receptionist slides a lanyard across the counter -- your trainee ID, your name printed in clean sans-serif beneath the NOVA logo.',
      sceneGradient: 'bg-gradient-to-b from-[#D4AF37]/20 via-[#9B7EC8]/15 to-[#0D0B12]',
      choices: [
        { id: 'c2a1', text: 'Thank Jiwoo and clip on the lanyard', gemCost: 0, nextBeatId: 'beat-3' },
        { id: 'c2a2', text: 'Ignore Jiwoo and ask the receptionist where training begins', gemCost: 0, nextBeatId: 'beat-3' },
      ],
    },
    'beat-2b': {
      id: 'beat-2b',
      sceneImage: '/scene-studio.jpeg',
      text: '[Name] lingers near the glass doors, letting the lobby wash over you. From here you can see everything -- the practiced smiles of the staff, the security cameras tucked into ceiling corners, the way Jiwoo shifts his weight like someone used to being watched. A group of trainees bursts through a side corridor, laughing and shoving each other playfully. One of them -- shorter, with electric-blue streaks dyed through dark hair -- spots you and freezes mid-laugh. "Oh! You must be the new one," she says, breaking away from the group and bounding over. "I am Mina. Everyone has been talking about you."',
      sceneGradient: 'bg-gradient-to-b from-[#D4AF37]/20 via-[#9B7EC8]/15 to-[#0D0B12]',
      choices: [
        { id: 'c2b1', text: 'Smile at Mina and ask what people have been saying', gemCost: 0, nextBeatId: 'beat-2b-2' },
        { id: 'c2b2', text: 'Nod politely and scan the room for someone official', gemCost: 0, nextBeatId: 'beat-2b-2' },
      ],
    },
    'beat-2b-2': {
      id: 'beat-2b-2',
      sceneImage: '/scene-studio.jpeg',
      text: 'Mina leads [Name] through the side corridor at a half-jog, chatting without pausing for breath. She tells you about the training schedule, the best vending machine on floor two, which senior trainees are warm versus which ones only seem that way. "Oh, and Jiwoo -- he is not as cold as he looks, once you are actually in his orbit. Most people never get that far." She says it lightly, like a footnote. You reach the elevator at the end of the corridor. Mina hits the button for floor three and shoots you a quick sideways look. "Whatever nerves you brought with you today -- do not let them show. Not on day one."',
      sceneGradient: 'bg-gradient-to-b from-[#9B7EC8]/20 via-[#6B9EC8]/10 to-[#0D0B12]',
      choices: [],
      nextBeatId: 'beat-3',
    },
    'beat-2c': {
      id: 'beat-2c',
      text: 'Jiwoo blinks. Once. Then a slow grin breaks out -- the kind that has launched a thousand fan edits. "Lost?" he repeats, tilting his head. "In my own building?" He pushes off the pillar and closes the distance between you in two easy strides. Up close, he is taller than the photos suggest, and there is a warmth behind the stage presence that the cameras never quite capture. "You are the transfer," he says -- not a question. "They said you would be interesting." He reaches into his jacket pocket and produces a slim black card. "Studio B. Third floor. Do not be late." He drops the card into [Name]\'s hand and walks away without looking back.',
      sceneGradient: 'bg-gradient-to-b from-[#D4AF37]/20 via-[#9B7EC8]/15 to-[#0D0B12]',
      choices: [
        { id: 'c2c1', text: 'Head straight to Studio B, card in hand', gemCost: 0, nextBeatId: 'beat-3' },
        { id: 'c2c2', text: 'Examine the black card more closely before going anywhere', gemCost: 15, nextBeatId: 'beat-3' },
      ],
    },
    'beat-3': {
      id: 'beat-3',
      text: 'The elevator ascends in silence. [Name] watches the floor numbers tick upward -- one, two, three. Even before the doors open, you can hear it: a pulsing bassline moving through the walls like a second heartbeat. The doors part onto a wide corridor. Frosted glass panels line both sides, each one labeled in clean white text: Studio A, Studio B, Studio C. Through the glass of Studio B, shapes move in unison -- arms extending, bodies pivoting, a choreography so locked in it looks like a single organism. The music stops. Then starts again from the top. You realize your feet have not moved since the elevator doors opened.',
      sceneGradient: 'bg-gradient-to-b from-[#6B9EC8]/20 via-[#9B7EC8]/10 to-[#0D0B12]',
      choices: [],
      nextBeatId: 'beat-4',
    },
    'beat-4': {
      id: 'beat-4',
      text: '[Name] walks the corridor. The music from Studio B grows louder with each step -- something harder-edged than the polished singles VEIL releases publicly. A track you have not heard before. You are almost at the door when a voice comes from behind you. "Took you long enough." Jiwoo is already there, leaning against the Studio B door frame, arms crossed, watching you approach with an expression you cannot read. He pushes off the frame as [Name] reaches him, not moving to block the way -- just marking the moment. "First time seeing them run a set?" He does not wait for an answer. He pushes the door open and holds it. The music spills out into the corridor like a wave.',
      sceneGradient: 'bg-gradient-to-b from-[#6B9EC8]/20 via-[#D4799A]/10 to-[#0D0B12]',
      choices: [
        { id: 'c4a', text: 'Step through the door without hesitation', gemCost: 0, nextBeatId: 'beat-5' },
        { id: 'c4b', text: 'Hold his gaze before stepping through', gemCost: 0, nextBeatId: 'beat-5' },
      ],
    },
    'beat-5': {
      id: 'beat-5',
      text: 'VEIL is in the middle of a run-through. Four members, synchronized down to the breath. The track is one [Name] does not recognize -- something with a lower register than their released work, more urgent. A choreographer stands at the mirror wall calling counts under the music. Jiwoo lets the door close softly behind you and moves to his position like you are not there. But you catch his reflection in the mirror glancing over once -- brief, deliberate, unreadable. One of the other members notices you standing at the edge of the room and offers a short nod. Not unfriendly. Just acknowledging. This is Studio B. This is where NOVA Entertainment makes stars. Whether [Name] belongs here is still an open question -- but the question itself feels like a beginning rather than a doubt.',
      sceneGradient: 'bg-gradient-to-b from-[#D4799A]/25 via-[#9B7EC8]/15 to-[#0D0B12]',
      choices: [],
      isChapterEnd: true,
    },
  },
};
