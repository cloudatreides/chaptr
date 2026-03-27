type DecisionEntryProps = {
  chapterNum: number;
  choiceSummary: string;
};

export default function DecisionEntry({ chapterNum, choiceSummary }: DecisionEntryProps) {
  return (
    <div className="flex items-start gap-3">
      {/* Rose dot indicator */}
      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-rose-accent" />
      <div>
        <span className="text-muted text-sm">Ch.{chapterNum}</span>
        <span className="text-muted text-sm"> &mdash; </span>
        <span className="text-text-primary text-sm line-clamp-2">{choiceSummary}</span>
      </div>
    </div>
  );
}
