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

export type DecisionLogEntry = {
  chapterId: string;
  chapterNum: number;
  choiceSummary: string;
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
  decisionLog: DecisionLogEntry[];
  sidebarOpen: boolean;
  firstGemChoiceUsed: Record<string, boolean>;
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
  logDecision: (entry: DecisionLogEntry) => void;
  toggleSidebar: () => void;
  setFirstGemChoiceUsed: (chapterId: string) => void;
  isFirstGemChoiceFree: (chapterId: string) => boolean;
};

const INITIAL_STATE = {
  gemBalance: 30,
  selfieUrl: null,
  userName: null,
  storyState: null,
  choiceHistory: [],
  showSelfiePrompt: false,
  decisionLog: [] as DecisionLogEntry[],
  sidebarOpen: false,
  firstGemChoiceUsed: {} as Record<string, boolean>,
  _schemaVersion: 3,
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

      logDecision: (entry) =>
        set((s) => ({ decisionLog: [...s.decisionLog, entry] })),

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      setFirstGemChoiceUsed: (chapterId) =>
        set((s) => ({
          firstGemChoiceUsed: { ...s.firstGemChoiceUsed, [chapterId]: true },
        })),

      isFirstGemChoiceFree: (chapterId) =>
        !get().firstGemChoiceUsed[chapterId],
    }),
    {
      name: 'chaptr-v1',
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          state.showSelfiePrompt = false;
        }
        if (version < 3) {
          state.decisionLog = [];
          state.sidebarOpen = false;
          state.firstGemChoiceUsed = {};
        }
        return state as ChaptrState;
      },
    }
  )
);
