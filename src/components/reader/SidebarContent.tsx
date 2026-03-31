import { useNavigate } from 'react-router';
import type { DecisionLogEntry } from '../../store/useChaptrStore';
import { useChaptrStore } from '../../store/useChaptrStore';
import DecisionEntry from './DecisionEntry';

type SidebarContentProps = {
  decisionLog: DecisionLogEntry[];
};

export default function SidebarContent({ decisionLog }: SidebarContentProps) {
  const navigate = useNavigate();
  const selfieUrl = useChaptrStore((s) => s.selfieUrl);
  const userName = useChaptrStore((s) => s.userName);

  return (
    <div className="flex flex-col h-full">
      <button
        onClick={() => navigate('/')}
        className="text-rose-accent font-sans font-bold text-lg tracking-tight mb-6 block hover:opacity-80 transition-opacity"
        aria-label="Go to homepage"
      >
        Chaptr
      </button>

      {/* Profile link */}
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity group"
        aria-label="Edit profile"
      >
        {selfieUrl ? (
          <div className="w-9 h-9 rounded-full overflow-hidden border border-rose-accent/30 flex-shrink-0">
            <img src={selfieUrl} alt="You" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-surface border border-muted/20 flex items-center justify-center flex-shrink-0">
            <span className="text-muted text-sm">👤</span>
          </div>
        )}
        <div className="text-left">
          <p className="text-text-primary text-sm font-medium font-sans leading-tight">
            {userName ?? 'Your character'}
          </p>
          <p className="text-muted text-xs font-sans group-hover:text-rose-accent transition-colors">Edit profile</p>
        </div>
      </button>

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
