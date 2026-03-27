import { useState } from 'react';
import { useParams } from 'react-router';
import { useChaptrStore } from '../store/useChaptrStore';
import { useTypewriter } from '../hooks/useTypewriter';
import { mockChapter1 } from '../data/mockStoryData';
import ProgressBar from '../components/reader/ProgressBar';
import SceneImage from '../components/reader/SceneImage';
import ReaderNavBar from '../components/reader/ReaderNavBar';
import LoadingSkeleton from '../components/reader/LoadingSkeleton';
import YourStorySidebar from '../components/reader/YourStorySidebar';

export default function StoryReaderPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const selfieUrl = useChaptrStore((s) => s.selfieUrl);
  const toggleSidebar = useChaptrStore((s) => s.toggleSidebar);

  // For PoC, use mock data
  const chapter = mockChapter1;
  const [currentBeatId, setCurrentBeatId] = useState(chapter.startBeatId);
  const currentBeat = chapter.beats[currentBeatId];
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleTextTap = () => {
    if (!isComplete) {
      completeInstantly();
    }
    // Second tap advance handled by choice selection, not text tap
    // (choices must appear first per READ-04)
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
              <div
                className="py-8 cursor-pointer"
                onClick={handleTextTap}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleTextTap();
                }}
                aria-live="polite"
              >
                <p className="text-text-primary text-base leading-[1.6] font-sans">
                  {displayedText}
                </p>
              </div>

              {/* Choice list placeholder - Plan 02 replaces this */}
              {isComplete && currentBeat.choices.length > 0 && (
                <div className="space-y-3 pb-8">
                  {currentBeat.choices.map((choice) => (
                    <button
                      key={choice.id}
                      className="w-full rounded-xl border border-surface bg-surface px-4 py-3 text-left text-base text-text-primary hover:border-rose-accent/50 transition-colors duration-150 min-h-[44px]"
                      onClick={() => {
                        setSelectedChoiceId(choice.id);
                        // Delay advance to show selection state
                        setTimeout(() => advanceBeat(choice.nextBeatId), 600);
                      }}
                    >
                      {choice.text}
                      {choice.gemCost > 0 && (
                        <span className="ml-auto float-right bg-gold/15 text-gold text-xs font-semibold px-2 py-0.5 rounded-full">
                          &#10022; {choice.gemCost}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sidebar renders itself (fixed positioning) */}
      <YourStorySidebar />
    </div>
  );
}
