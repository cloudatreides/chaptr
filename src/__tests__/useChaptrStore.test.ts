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
