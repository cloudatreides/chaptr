import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type StoryState = {
  currentNodeId: string;
  chapterId: string;
} | null;

export type ChoiceRecord = {
  nodeId: string;
  choiceIndex: number;
  label: string;
  timestamp: number;
};

export type ChaptrState = {
  // Persisted fields
  gemBalance: number;
  selfieUrl: string | null;
  userName: string | null;
  storyState: StoryState;
  choiceHistory: ChoiceRecord[];
  _schemaVersion: number;

  // Actions
  setGemBalance: (balance: number) => void;
  spendGems: (amount: number) => boolean;
  setSelfie: (url: string) => void;
  setUserName: (name: string) => void;
  setStoryState: (state: StoryState) => void;
  recordChoice: (choice: ChoiceRecord) => void;
  resetStory: () => void;
};

const INITIAL_STATE = {
  gemBalance: 30,
  selfieUrl: null,
  userName: null,
  storyState: null,
  choiceHistory: [],
  _schemaVersion: 1,
};

export const useChaptrStore = create<ChaptrState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setGemBalance: (balance) => set({ gemBalance: balance }),

      spendGems: (amount) => {
        const current = get().gemBalance;
        if (current < amount) return false;
        set({ gemBalance: current - amount });
        return true;
      },

      setSelfie: (url) => set({ selfieUrl: url }),

      setUserName: (name) => set({ userName: name }),

      setStoryState: (state) => set({ storyState: state }),

      recordChoice: (choice) =>
        set((s) => ({ choiceHistory: [...s.choiceHistory, choice] })),

      resetStory: () =>
        set({ storyState: null, choiceHistory: [] }),
    }),
    {
      name: 'chaptr-v1',
      storage: createJSONStorage(() => localStorage),
      // Migrate to new schema versions here in future
      version: 1,
      migrate: (persisted, _version) => {
        // version 0 → 1: no migration needed yet
        return persisted as ChaptrState;
      },
    }
  )
);
