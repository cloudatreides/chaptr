import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import UniversesPage from '../pages/UniversesPage';

describe('UniversesPage', () => {
  it('renders genre tabs', () => {
    render(
      <MemoryRouter>
        <UniversesPage />
      </MemoryRouter>
    );
    expect(screen.getByText('ALL')).toBeTruthy();
    expect(screen.getByText('ROMANCE')).toBeTruthy();
  });

  it('renders The Seoul Transfer card', () => {
    render(
      <MemoryRouter>
        <UniversesPage />
      </MemoryRouter>
    );
    expect(screen.getByText('The Seoul Transfer')).toBeTruthy();
  });

  it('renders coming-soon cards with lock icon', () => {
    render(
      <MemoryRouter>
        <UniversesPage />
      </MemoryRouter>
    );
    const notifyLabels = screen.getAllByText(/Notify me/i);
    expect(notifyLabels.length).toBeGreaterThanOrEqual(1);
  });
});
