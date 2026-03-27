import { useState } from 'react';
import { useParams } from 'react-router';
import { useChaptrStore } from '../store/useChaptrStore';
import { useTypewriter } from '../hooks/useTypewriter';
import { mockChapter1 } from '../data/mockStoryData';
import type { StoryChoice } from '../data/mockStoryData';
import ProgressBar from '../components/reader/ProgressBar';
import SceneImage from '../components/reader/SceneImage';
import ReaderNavBar from '../components/reader/ReaderNavBar';
import LoadingSkeleton from '../components/reader/LoadingSkeleton';
import TypewriterText from '../components/reader/TypewriterText';
import ChoiceList from '../components/reader/ChoiceList';
import GemGateSheet from '../components/reader/GemGateSheet';
import YourStorySidebar from '../components/reader/YourStorySidebar';

export default function StoryReaderPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const selfieUrl = useChaptrStore((s) => s.selfieUrl);
  const userName = useChaptrStore((s) => s.userName);
  const toggleSidebar = useChaptrStore((s) => s.toggleSidebar);
  const gemBalance = useChaptrStore((s) => s.gemBalance);

  // For PoC, use mock data
  const chapter = mockChapter1;
  const [currentBeatId, setCurrentBeatId] = useState(chapter.startBeatId);
  const currentBeat = chapter.beats[currentBeatId];
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
                  // Only advance on text tap if current beat has no choices (prose-only beats)
                  if (
                    currentBeat.choices.length === 0 &&
                    !currentBeat.isChapterEnd
                  ) {
                    // No auto-advance for prose-only beats without a defined next
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
