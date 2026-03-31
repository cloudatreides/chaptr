import { BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import GemCounter from './GemCounter';

type ReaderNavBarProps = {
  chapterTitle: string;
  onSidebarToggle: () => void;
};

export default function ReaderNavBar({
  chapterTitle,
  onSidebarToggle,
}: ReaderNavBarProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-[2px] z-40 flex h-12 items-center justify-between bg-base/90 backdrop-blur-sm px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-muted hover:text-text-primary"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={onSidebarToggle}
          className="lg:hidden text-muted hover:text-text-primary"
          aria-label="Open Your Story sidebar"
        >
          <BookOpen size={20} />
        </button>
      </div>
      <span className="text-muted text-sm truncate">{chapterTitle}</span>
      <GemCounter />
    </div>
  );
}
