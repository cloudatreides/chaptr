import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChaptrStore } from '../store/useChaptrStore';

type NamePromptModalProps = {
  onClose: () => void;
};

export default function NamePromptModal({ onClose }: NamePromptModalProps) {
  const setUserName = useChaptrStore((s) => s.setUserName);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    setUserName(name.trim());
    onClose();
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="name-modal-headline"
          className="relative bg-surface rounded-2xl max-w-[440px] w-full mx-4 p-8"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <h2
            id="name-modal-headline"
            className="text-text-primary font-sans font-semibold text-xl text-center"
          >
            What should we call you?
          </h2>
          <p className="text-muted font-sans text-base text-center mt-3">
            Your name will appear throughout the story
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(false); }}
              placeholder="Your name"
              className="w-full bg-base border border-white/10 rounded-xl px-4 py-3 text-text-primary font-sans text-base placeholder:text-muted focus:outline-none focus:border-rose-accent transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-rose-accent font-sans text-sm">
                Please enter a name to continue
              </p>
            )}
            <button
              type="submit"
              className="bg-rose-accent text-[#0D0B12] font-sans text-base font-medium px-8 py-3 rounded-full w-full"
            >
              Start reading
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
