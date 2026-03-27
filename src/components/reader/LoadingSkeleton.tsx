export default function LoadingSkeleton() {
  return (
    <div
      className="space-y-2 px-5 py-8"
      aria-busy="true"
      aria-label="Loading story content"
    >
      <div className="h-4 w-full rounded bg-surface animate-shimmer" />
      <div className="h-4 w-[85%] rounded bg-surface animate-shimmer" />
      <div className="h-4 w-[60%] rounded bg-surface animate-shimmer" />
      <div className="h-4 w-[75%] rounded bg-surface animate-shimmer" />
    </div>
  );
}
