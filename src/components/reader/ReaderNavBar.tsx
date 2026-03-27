import { BookOpen } from 'lucide-react';
import GemCounter from './GemCounter';

type ReaderNavBarProps = {
  chapterTitle: string;
  onSidebarToggle: () => void;
};

export default function ReaderNavBar({
  chapterTitle,
  onSidebarToggle,
}: ReaderNavBarProps) {
  return (
    <div className="sticky top-[2px] z-40 flex h-12 items-center justify-between bg-base/90 backdrop-blur-sm px-5">
      <button
        onClick={onSidebarToggle}
        className="lg:hidden text-muted hover:text-text-primary"
        aria-label="Open Your Story sidebar"
      >
        <BookOpen size={20} />
      </button>
      <span className="text-muted text-sm truncate">{chapterTitle}</span>
      <GemCounter />
    </div>
  );
}
