import { motion } from 'framer-motion';
import type { StoryChoice } from '../../data/mockStoryData';
import { useChaptrStore } from '../../store/useChaptrStore';
import ChoiceButton from './ChoiceButton';

type ChoiceListProps = {
  choices: StoryChoice[];
  isComplete: boolean;
  selectedChoiceId: string | null;
  chapterId: string;
  onChoiceSelect: (choice: StoryChoice) => void;
  onGemGateOpen: (gemCost: number) => void;
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function ChoiceList({
  choices,
  isComplete,
  selectedChoiceId,
  chapterId,
  onChoiceSelect,
  onGemGateOpen,
}: ChoiceListProps) {
  if (!isComplete) return null;
  if (choices.length === 0) return null;

  const getChoiceState = (
    choice: StoryChoice
  ): 'default' | 'selected' | 'unchosen' | 'locked' => {
    if (selectedChoiceId === choice.id) return 'selected';
    if (selectedChoiceId !== null && selectedChoiceId !== choice.id)
      return 'unchosen';
    if (choice.gemCost > 0) {
      const isFree = useChaptrStore.getState().isFirstGemChoiceFree(chapterId);
      if (!isFree) {
        const balance = useChaptrStore.getState().gemBalance;
        if (balance < choice.gemCost) return 'locked';
      }
    }
    return 'default';
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-3 pb-8"
    >
      {choices.map((choice) => {
        const state = getChoiceState(choice);
        const isFreeGemChoice =
          choice.gemCost > 0 &&
          useChaptrStore.getState().isFirstGemChoiceFree(chapterId);

        return (
          <motion.div key={choice.id} variants={itemVariants}>
            <ChoiceButton
              choice={choice}
              state={state}
              isFreeGemChoice={isFreeGemChoice}
              onSelect={() => onChoiceSelect(choice)}
              onLockedTap={() => onGemGateOpen(choice.gemCost)}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
