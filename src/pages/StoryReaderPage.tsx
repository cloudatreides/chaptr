import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router';
import { useChaptrStore } from '../store/useChaptrStore';
import { useTypewriter } from '../hooks/useTypewriter';
import { chapter1 } from '../data/chapter1';
import type { StoryChoice } from '../data/chapter1';
import ProgressBar from '../components/reader/ProgressBar';
import SceneImage from '../components/reader/SceneImage';
import ReaderNavBar from '../components/reader/ReaderNavBar';
import LoadingSkeleton from '../components/reader/LoadingSkeleton';
import TypewriterText from '../components/reader/TypewriterText';
import ChoiceList from '../components/reader/ChoiceList';
import GemGateSheet from '../components/reader/GemGateSheet';
import YourStorySidebar from '../components/reader/YourStorySidebar';
import NamePromptModal from '../components/NamePromptModal';

export default function StoryReaderPage() {
  const { chapterId: _chapterId } = useParams<{ chapterId: string }>();
  const selfieUrl = useChaptrStore((s) => s.selfieUrl);
  const userName = useChaptrStore((s) => s.userName);
  const toggleSidebar = useChaptrStore((s) => s.toggleSidebar);
  const gemBalance = useChaptrStore((s) => s.gemBalance);

  // For PoC, use static story data
  const chapter = chapter1;
  const [currentBeatId, setCurrentBeatId] = useState(chapter.startBeatId);
  const currentBeat = chapter.beats[currentBeatId];
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isLoading] = useState(false);

  // Name prompt modal — shown when userName is null
  const [showNamePrompt, setShowNamePrompt] = useState(userName === null);

  // Gem gate sheet state
  const [gemGateOpen, setGemGateOpen] = useState(false);
  const [gemGateCost, setGemGateCost] = useState(0);

  // Calculate progress as percentage of visited beats
  const totalBeats = Object.keys(chapter.beats).length;
  const [visitedBeats, setVisitedBeats] = useState(1);
  const progress = Math.round((visitedBeats / totalBeats) * 100);

  const { displayedText, isComplete, completeInstantly } = useTypewriter(
    currentBeat.text
  );

  const advanceBeat = (nextBeatId: string) => {
    setSelectedChoiceId(null);
    setCurrentBeatId(nextBeatId);
    setVisitedBeats((v) => v + 1);
  };

  const handleChoiceSelect = (choice: StoryChoice) => {
    const store = useChaptrStore.getState();
    const isFree =
      choice.gemCost > 0 && store.isFirstGemChoiceFree(chapter.id);

    if (choice.gemCost > 0 && !isFree) {
      const success = store.spendGems(choice.gemCost);
      if (!success) {
        setGemGateCost(choice.gemCost);
        setGemGateOpen(true);
        return;
      }
    }

    if (choice.gemCost > 0 && isFree) {
      store.setFirstGemChoiceUsed(chapter.id);
    }

    store.logDecision({
      chapterId: chapter.id,
      chapterNum: 1,
      choiceSummary: choice.text,
      timestamp: Date.now(),
    });

    const choiceIndex = currentBeat.choices.findIndex(
      (c) => c.id === choice.id
    );
    store.recordChoice({
      nodeId: currentBeatId,
      choiceIndex,
      label: choice.text,
      timestamp: Date.now(),
    });

    setSelectedChoiceId(choice.id);
    setTimeout(() => advanceBeat(choice.nextBeatId), 600);
  };

  return (
    <div className="min-h-screen bg-base">
      <ProgressBar percent={progress} />
      <SceneImage
        src={currentBeat.sceneImage}
        selfieUrl={selfieUrl}
        showOverlay={currentBeat.isChapterStart}
        isLoading={isLoading}
        gradientClass={currentBeat.sceneGradient}
      />
      {/* Content area, offset for sidebar on desktop */}
      <div className="lg:pl-[280px]">
        <div className="mx-auto w-full max-w-[680px] px-5 lg:px-0 pb-20">
          <ReaderNavBar
            chapterTitle={chapter.title}
            onSidebarToggle={toggleSidebar}
          />

          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <TypewriterText
                text={displayedText}
                userName={userName}
                isComplete={isComplete}
                onSkip={completeInstantly}
                onAdvance={() => {
                  if (
                    currentBeat.choices.length === 0 &&
                    !currentBeat.isChapterEnd &&
                    currentBeat.nextBeatId
                  ) {
                    advanceBeat(currentBeat.nextBeatId);
                  }
                }}
              />

              <ChoiceList
                choices={currentBeat.choices}
                isComplete={isComplete}
                selectedChoiceId={selectedChoiceId}
                chapterId={chapter.id}
                onChoiceSelect={handleChoiceSelect}
                onGemGateOpen={(cost) => {
                  setGemGateCost(cost);
                  setGemGateOpen(true);
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Chapter-end overlay — renders fixed on top when beat-5 reached */}
      {currentBeat.isChapterEnd && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-base/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.h1
            className="text-text-primary font-sans font-semibold text-3xl md:text-4xl text-center"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            Chapter Complete
          </motion.h1>
          <p className="text-muted font-sans text-base text-center mt-4 max-w-xs">
            Chapter 1: First Day
          </p>
          <p className="text-muted font-sans text-sm text-center mt-2 max-w-[280px]">
            Your decisions are logged in Your Story. Chapter 2 coming soon.
          </p>
          <button
            className="mt-8 text-rose-accent font-sans text-sm font-medium hover:underline"
            onClick={toggleSidebar}
          >
            Review your story so far
          </button>
        </motion.div>
      )}

      {/* Name prompt modal — shown on first visit when userName is null */}
      {showNamePrompt && (
        <NamePromptModal onClose={() => setShowNamePrompt(false)} />
      )}

      {/* Sidebar renders itself (fixed positioning) */}
      <YourStorySidebar />

      <GemGateSheet
        open={gemGateOpen}
        onClose={() => setGemGateOpen(false)}
        gemCost={gemGateCost}
        currentBalance={gemBalance}
      />
    </div>
  );
}
