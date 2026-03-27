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
  showSelfiePrompt: boolean;
  _schemaVersion: number;

  // Actions
  setGemBalance: (balance: number) => void;
  spendGems: (amount: number) => boolean;
  setSelfie: (url: string) => void;
  clearSelfie: () => void;
  setUserName: (name: string) => void;
  setStoryState: (state: StoryState) => void;
  recordChoice: (choice: ChoiceRecord) => void;
  resetStory: () => void;
  triggerSelfiePrompt: () => void;
  dismissSelfiePrompt: () => void;
};

const INITIAL_STATE = {
  gemBalance: 30,
  selfieUrl: null,
  userName: null,
  storyState: null,
  choiceHistory: [],
  showSelfiePrompt: false,
  _schemaVersion: 2,
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

      clearSelfie: () => set({ selfieUrl: null }),

      setUserName: (name) => set({ userName: name }),

      setStoryState: (state) => set({ storyState: state }),

      recordChoice: (choice) =>
        set((s) => ({ choiceHistory: [...s.choiceHistory, choice] })),

      resetStory: () =>
        set({ storyState: null, choiceHistory: [] }),

      triggerSelfiePrompt: () => set({ showSelfiePrompt: true }),

      dismissSelfiePrompt: () => set({ showSelfiePrompt: false }),
    }),
    {
      name: 'chaptr-v1',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          state.showSelfiePrompt = false;
        }
        return state as ChaptrState;
      },
    }
  )
);
