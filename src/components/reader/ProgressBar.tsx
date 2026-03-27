type ProgressBarProps = {
  percent: number;
};

export default function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] w-full bg-surface"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-rose-accent transition-all duration-300 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
