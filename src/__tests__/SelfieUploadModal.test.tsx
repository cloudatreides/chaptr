import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SelfieUploadModal from '../components/SelfieUploadModal';
import { useChaptrStore } from '../store/useChaptrStore';

describe('SelfieUploadModal', () => {
  beforeEach(() => {
    useChaptrStore.setState({ showSelfiePrompt: true });
  });

  it('renders primer screen headline', () => {
    render(<SelfieUploadModal />);
    expect(screen.getByText('Make the story yours')).toBeTruthy();
  });

  it('renders privacy body copy', () => {
    render(<SelfieUploadModal />);
    expect(screen.getByText(/never uploaded or shared/i)).toBeTruthy();
  });

  it('renders Add Your Photo CTA', () => {
    render(<SelfieUploadModal />);
    expect(screen.getByText('Add Your Photo')).toBeTruthy();
  });

  it('renders skip CTA', () => {
    render(<SelfieUploadModal />);
    expect(screen.getByText('Use an illustrated avatar instead')).toBeTruthy();
  });

  it('has role dialog and aria-modal', () => {
    render(<SelfieUploadModal />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });
});
