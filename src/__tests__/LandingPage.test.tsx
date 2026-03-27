import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';

describe('LandingPage', () => {
  it('renders hero headline', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Your face\. Your story\./i)).toBeTruthy();
  });

  it('renders Start Your Story CTA', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Start Your Story/i)).toBeTruthy();
  });
});
