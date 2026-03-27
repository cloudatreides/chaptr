import type { StoryChoice } from '../../data/mockStoryData';

type ChoiceButtonProps = {
  choice: StoryChoice;
  state: 'default' | 'selected' | 'unchosen' | 'locked';
  isFreeGemChoice: boolean;
  onSelect: () => void;
  onLockedTap: () => void;
};

export default function ChoiceButton({
  choice,
  state,
  isFreeGemChoice,
  onSelect,
  onLockedTap,
}: ChoiceButtonProps) {
  const handleClick = () => {
    if (state === 'selected' || state === 'unchosen') return;
    if (state === 'locked') {
      onLockedTap();
      return;
    }
    onSelect();
  };

  const isGemGated = choice.gemCost > 0;

  const gemBadge = isGemGated ? (
    <span className="bg-gold/15 text-gold text-xs font-semibold px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
      &#10022; {isFreeGemChoice ? 'Free' : choice.gemCost}
    </span>
  ) : null;

  if (state === 'selected') {
    return (
      <button
        className="bg-gradient-to-r from-rose-accent/20 to-transparent bg-surface border border-rose-accent/40 border-l-[3px] border-l-rose-accent rounded-xl px-4 py-3 text-text-primary min-h-[44px] w-full text-left pointer-events-none"
        aria-pressed={true}
        role="button"
      >
        <span className="flex items-center justify-between">
          <span>{choice.text}</span>
          {gemBadge}
        </span>
      </button>
    );
  }

  if (state === 'unchosen') {
    return (
      <button
        className="opacity-30 pointer-events-none transition-opacity duration-300 bg-surface border border-surface rounded-xl px-4 py-3 text-left text-base text-text-primary min-h-[44px] w-full"
        aria-pressed={false}
        role="button"
      >
        <span className="flex items-center justify-between">
          <span>{choice.text}</span>
          {gemBadge}
        </span>
      </button>
    );
  }

  // Default and locked states share similar appearance
  const borderClass = isGemGated ? 'border-gold/30' : 'border-surface';

  return (
    <button
      className={`bg-surface border ${borderClass} hover:border-rose-accent/50 rounded-xl px-4 py-3 text-left text-base text-text-primary transition-colors duration-150 min-h-[44px] w-full cursor-pointer active:scale-[0.98] transition-transform duration-100 focus-visible:ring-2 focus-visible:ring-rose-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base`}
      onClick={handleClick}
      role="button"
      aria-pressed={false}
      aria-label={
        state === 'locked'
          ? `Choose: ${choice.text} (costs ${choice.gemCost} gems)`
          : undefined
      }
    >
      <span className="flex items-center justify-between">
        <span>{choice.text}</span>
        {gemBadge}
      </span>
    </button>
  );
}
