import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChoiceList from '../components/reader/ChoiceList';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
}));

// Track mock state for isFirstGemChoiceFree
let mockIsFirstGemChoiceFree = true;
let mockGemBalance = 30;

vi.mock('../store/useChaptrStore', () => ({
  useChaptrStore: Object.assign(
    (selector: (state: Record<string, unknown>) => unknown) =>
      selector({
        gemBalance: mockGemBalance,
        isFirstGemChoiceFree: () => mockIsFirstGemChoiceFree,
      }),
    {
      getState: () => ({
        gemBalance: mockGemBalance,
        isFirstGemChoiceFree: () => mockIsFirstGemChoiceFree,
        spendGems: vi.fn(() => true),
        setFirstGemChoiceUsed: vi.fn(),
      }),
    }
  ),
}));

const mockChoices = [
  { id: 'c1', text: 'Walk forward', gemCost: 0, nextBeatId: 'b2' },
  { id: 'c2', text: 'Premium option', gemCost: 10, nextBeatId: 'b3' },
];

describe('ChoiceList', () => {
  beforeEach(() => {
    mockIsFirstGemChoiceFree = true;
    mockGemBalance = 30;
  });

  it('choices hidden when isComplete is false', () => {
    render(
      <ChoiceList
        choices={mockChoices}
        isComplete={false}
        selectedChoiceId={null}
        chapterId="ch1"
        onChoiceSelect={vi.fn()}
        onGemGateOpen={vi.fn()}
      />
    );
    expect(screen.queryByText('Walk forward')).toBeNull();
    expect(screen.queryByText('Premium option')).toBeNull();
  });

  it('choices visible when isComplete is true', () => {
    render(
      <ChoiceList
        choices={mockChoices}
        isComplete={true}
        selectedChoiceId={null}
        chapterId="ch1"
        onChoiceSelect={vi.fn()}
        onGemGateOpen={vi.fn()}
      />
    );
    expect(screen.getByText('Walk forward')).toBeTruthy();
    expect(screen.getByText('Premium option')).toBeTruthy();
  });

  it('gem badge shows cost for gem-gated choice', () => {
    mockIsFirstGemChoiceFree = false;
    render(
      <ChoiceList
        choices={mockChoices}
        isComplete={true}
        selectedChoiceId={null}
        chapterId="ch1"
        onChoiceSelect={vi.fn()}
        onGemGateOpen={vi.fn()}
      />
    );
    // The gem badge renders ✦ followed by cost number
    expect(screen.getByText((content) => content.includes('10'))).toBeTruthy();
  });

  it('first gem choice shows Free badge', () => {
    mockIsFirstGemChoiceFree = true;
    render(
      <ChoiceList
        choices={mockChoices}
        isComplete={true}
        selectedChoiceId={null}
        chapterId="ch1"
        onChoiceSelect={vi.fn()}
        onGemGateOpen={vi.fn()}
      />
    );
    expect(
      screen.getByText((content) => content.includes('Free'))
    ).toBeTruthy();
  });
});
