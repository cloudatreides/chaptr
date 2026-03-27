import { useParams } from 'react-router';

export default function StoryReaderPage() {
  const { chapterId } = useParams<{ chapterId: string }>();

  return (
    <div className="min-h-screen bg-base">
      <div className="page-container px-5 py-10">
        <h1 className="text-text-primary text-2xl font-bold font-sans">
          Story Reader
        </h1>
        <p className="text-muted mt-2 text-sm">
          Chapter: <span className="text-rose-accent">{chapterId}</span>
        </p>
        <p className="text-muted mt-1 text-sm">
          Phase 3 will build this out.
        </p>
      </div>
    </div>
  );
}
