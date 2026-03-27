import { motion } from 'framer-motion';
import { useChaptrStore } from '../../store/useChaptrStore';

export default function GemCounter() {
  const gemBalance = useChaptrStore((s) => s.gemBalance);

  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-gold text-sm font-semibold">&#10022;</span>
      <motion.span
        key={gemBalance}
        className="text-gold text-sm font-semibold"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
      >
        {gemBalance}
      </motion.span>
    </span>
  );
}
