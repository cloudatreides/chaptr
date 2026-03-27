type SceneImageProps = {
  src?: string;
  selfieUrl?: string | null;
  showOverlay?: boolean;
  isLoading?: boolean;
};

export default function SceneImage({
  src,
  selfieUrl,
  showOverlay,
  isLoading,
}: SceneImageProps) {
  return (
    <div className="relative h-[40vh] w-full overflow-hidden bg-surface">
      {isLoading ? (
        <>
          <div className="h-full w-full animate-shimmer" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 border-2 border-rose-accent border-t-transparent rounded-full animate-spin" />
        </>
      ) : src ? (
        <img src={src} alt="Scene" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-gradient-to-b from-purple-accent/20 to-base" />
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base" />

      {/* Selfie overlay on chapter cover */}
      {showOverlay && selfieUrl && (
        <img
          src={selfieUrl}
          alt=""
          className="absolute bottom-4 right-4 h-[100px] w-[80px] rounded-lg border-2 border-rose-accent/30 object-cover"
          style={{ mixBlendMode: 'luminosity', opacity: 0.7 }}
        />
      )}
    </div>
  );
}
