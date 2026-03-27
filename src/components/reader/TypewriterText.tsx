type TypewriterTextProps = {
  text: string;
  userName?: string | null;
  isComplete: boolean;
  onSkip: () => void;
  onAdvance: () => void;
};

export default function TypewriterText({
  text,
  userName,
  isComplete,
  onSkip,
  onAdvance,
}: TypewriterTextProps) {
  const resolvedText = text.replace(/\[Name\]/g, userName ?? 'you');

  const handleTextTap = () => {
    if (!isComplete) {
      onSkip();
    } else {
      onAdvance();
    }
  };

  const paragraphs = resolvedText.split('\n\n');

  return (
    <div
      className="py-8 cursor-pointer"
      onClick={handleTextTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTextTap();
        }
      }}
      aria-live="polite"
    >
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className="mb-4 text-text-primary text-base leading-[1.6] font-sans"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
