import type { DecisionLogEntry } from '../../store/useChaptrStore';
import DecisionEntry from './DecisionEntry';

type SidebarContentProps = {
  decisionLog: DecisionLogEntry[];
};

export default function SidebarContent({ decisionLog }: SidebarContentProps) {
  return (
    <div>
      <h2 className="text-text-primary text-xl font-semibold mb-6">Your Story</h2>
      {decisionLog.length === 0 ? (
        <p className="text-muted text-base italic">
          Your decisions will appear here as you make choices.
        </p>
      ) : (
        <div className="space-y-3">
          {decisionLog.map((entry, i) => (
            <DecisionEntry
              key={`${entry.chapterId}-${entry.timestamp}-${i}`}
              chapterNum={entry.chapterNum}
              choiceSummary={entry.choiceSummary}
            />
          ))}
        </div>
      )}
    </div>
  );
}
