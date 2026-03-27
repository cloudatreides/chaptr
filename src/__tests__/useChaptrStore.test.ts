import { describe, it, expect, beforeEach } from 'vitest';
import { useChaptrStore } from '../store/useChaptrStore';

describe('useChaptrStore - selfie prompt', () => {
  beforeEach(() => {
    useChaptrStore.setState({
      showSelfiePrompt: false,
      selfieUrl: null,
    });
  });

  it('initializes with showSelfiePrompt false', () => {
    expect(useChaptrStore.getState().showSelfiePrompt).toBe(false);
  });

  it('triggerSelfiePrompt sets flag to true', () => {
    useChaptrStore.getState().triggerSelfiePrompt();
    expect(useChaptrStore.getState().showSelfiePrompt).toBe(true);
  });

  it('dismissSelfiePrompt sets flag to false', () => {
    useChaptrStore.getState().triggerSelfiePrompt();
    useChaptrStore.getState().dismissSelfiePrompt();
    expect(useChaptrStore.getState().showSelfiePrompt).toBe(false);
  });

  it('setSelfie stores the URL', () => {
    useChaptrStore.getState().setSelfie('data:image/jpeg;base64,abc123');
    expect(useChaptrStore.getState().selfieUrl).toBe('data:image/jpeg;base64,abc123');
  });

  it('clearSelfie removes the URL', () => {
    useChaptrStore.getState().setSelfie('data:image/jpeg;base64,abc123');
    useChaptrStore.getState().clearSelfie();
    expect(useChaptrStore.getState().selfieUrl).toBeNull();
  });
});

describe('useChaptrStore - gem system', () => {
  beforeEach(() => {
    useChaptrStore.setState({ gemBalance: 30 });
  });

  it('gem balance initializes at 30', () => {
    expect(useChaptrStore.getState().gemBalance).toBe(30);
  });

  it('spendGems deducts correctly', () => {
    const result = useChaptrStore.getState().spendGems(10);
    expect(result).toBe(true);
    expect(useChaptrStore.getState().gemBalance).toBe(20);
  });

  it('spendGems returns false when insufficient', () => {
    const result = useChaptrStore.getState().spendGems(50);
    expect(result).toBe(false);
    expect(useChaptrStore.getState().gemBalance).toBe(30);
  });

  it('gem balance persists in state', () => {
    useChaptrStore.getState().spendGems(5);
    expect(useChaptrStore.getState().gemBalance).toBe(25);
  });
});

describe('useChaptrStore - decision log', () => {
  beforeEach(() => {
    useChaptrStore.setState({ decisionLog: [] });
  });

  it('decisionLog initializes as empty array', () => {
    expect(useChaptrStore.getState().decisionLog).toEqual([]);
  });

  it('logDecision adds entry to decisionLog', () => {
    const entry = {
      chapterId: 'ch1',
      chapterNum: 1,
      choiceSummary: 'Introduced yourself confidently',
      timestamp: Date.now(),
    };
    useChaptrStore.getState().logDecision(entry);
    expect(useChaptrStore.getState().decisionLog).toHaveLength(1);
    expect(useChaptrStore.getState().decisionLog[0].choiceSummary).toBe(
      'Introduced yourself confidently'
    );
  });
});

describe('useChaptrStore - first gem choice', () => {
  beforeEach(() => {
    useChaptrStore.setState({ firstGemChoiceUsed: {} });
  });

  it('isFirstGemChoiceFree returns true for new chapter', () => {
    expect(useChaptrStore.getState().isFirstGemChoiceFree('ch1')).toBe(true);
  });

  it('isFirstGemChoiceFree returns false after setFirstGemChoiceUsed', () => {
    useChaptrStore.getState().setFirstGemChoiceUsed('ch1');
    expect(useChaptrStore.getState().isFirstGemChoiceFree('ch1')).toBe(false);
  });
});

describe('useChaptrStore - sidebar', () => {
  beforeEach(() => {
    useChaptrStore.setState({ sidebarOpen: false });
  });

  it('sidebarOpen initializes as false', () => {
    expect(useChaptrStore.getState().sidebarOpen).toBe(false);
  });

  it('toggleSidebar flips sidebarOpen', () => {
    useChaptrStore.getState().toggleSidebar();
    expect(useChaptrStore.getState().sidebarOpen).toBe(true);
    useChaptrStore.getState().toggleSidebar();
    expect(useChaptrStore.getState().sidebarOpen).toBe(false);
  });
});
