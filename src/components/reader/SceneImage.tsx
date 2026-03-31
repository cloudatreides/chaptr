import { motion } from 'framer-motion';

type SceneImageProps = {
  src?: string;
  selfieUrl?: string | null;
  userName?: string | null;
  showOverlay?: boolean;
  isLoading?: boolean;
  gradientClass?: string;  // overrides default gradient fallback when src is undefined
};

export default function SceneImage({
  src,
  selfieUrl,
  userName,
  showOverlay,
  isLoading,
  gradientClass,
}: SceneImageProps) {
  return (
    <div className="relative h-[40vh] w-full overflow-hidden bg-surface">
      {isLoading ? (
        <>
          <div className="h-full w-full animate-shimmer" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 border-2 border-rose-accent border-t-transparent rounded-full animate-spin" />
        </>
      ) : src ? (
        <motion.img
          key={src}
          src={src}
          alt="Scene"
          className="h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      ) : (
        <div className={`h-full w-full ${gradientClass ?? 'bg-gradient-to-b from-purple-accent/20 to-base'}`} />
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base" />

      {/* Protagonist portrait card on chapter cover */}
      {showOverlay && selfieUrl && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-[96px] h-[120px] rounded-2xl border-2 border-rose-accent/60 overflow-hidden shadow-2xl">
            <img src={selfieUrl} alt="Protagonist" className="w-full h-full object-cover" />
          </div>
          <div className="bg-base/80 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-text-primary text-xs font-semibold font-sans tracking-wide">
              {userName ? `${userName} · Protagonist` : 'Protagonist'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
